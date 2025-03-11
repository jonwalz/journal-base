import { ZepClient } from "@getzep/zep-cloud";
import type {
  AIResponse,
  GrowthIndicator,
  MemorySearchResult,
  SentimentAnalysis,
} from "../../types/ai";
import { env } from "../../config/environment";
import type { IEntry } from "../../types";
import { AppError } from "../../utils/errors";
import { langchainAIServiceClaude } from "./instances";
import logger from "../../utils/logger";

export class AIService {
  private zepClient: ZepClient;
  private readonly COLLECTION_NAME = "journal-entries";

  constructor() {
    this.zepClient = new ZepClient({
      apiKey: env.ZEP_API_KEY,
    });
  }

  async initializeUserMemory(userId: string): Promise<void> {
    try {
      await this.zepClient.memory.search(this.COLLECTION_NAME, {
        text: `Initializing memory for user ${userId}`,
        metadata: {
          type: "initialization",
          userId,
        },
      });
    } catch (error) {
      logger.error("Failed to initialize user memory:", { error });
      throw new AppError(
        500,
        "AI_SERVICE_ERROR",
        "Failed to initialize user memory"
      );
    }
  }

  async searchMemory(query: string): Promise<MemorySearchResult> {
    try {
      const memories = await this.zepClient.memory.search(
        this.COLLECTION_NAME,
        {
          text: query,
        }
      );

      if (!memories[0]) {
        return { relevantMemories: [], score: 0 };
      }

      return this.convertZepMemoryResult(memories[0]);
    } catch (error) {
      logger.error("Failed to search memory:", { error });
      throw new AppError(500, "AI_SERVICE_ERROR", "Failed to search memory");
    }
  }

  async chat(
    userId: string,
    message: string,
    onProgress?: (chunk: string) => void
  ): Promise<AIResponse> {
    const sessionId = Math.random().toString(36).slice(2);

    try {
      // Create zep memory session
      await this.zepClient.memory.addSession({
        sessionId,
        userId,
      });

      // Add message to memory
      await this.zepClient.memory.add(sessionId, {
        messages: [
          {
            content: message,
            roleType: "user",
            metadata: {
              type: "chat",
              userId,
            },
          },
        ],
      });

      // Get session memory
      const zepSession = await this.zepClient.memory.get(sessionId);

      // Parse message and add zepSession.facts as context
      const parsedMessage = JSON.parse(message);
      const messageWithContext = [
        ...parsedMessage,
        { context: zepSession.context },
      ];
      logger.info("Message with context:", { messageWithContext });

      // Use LangChain for chat with streaming support
      const response = await langchainAIServiceClaude.chat(
        userId,
        JSON.stringify(messageWithContext),
        onProgress
      );

      logger.info("AI Chat Response:", { response });
      // Store AI response in memory
      await this.zepClient.memory.add(sessionId, {
        messages: [
          {
            content: response.message,
            roleType: "assistant",
            metadata: {
              type: "chat",
              userId,
            },
          },
        ],
      });

      return response;
    } catch (error) {
      logger.error("Failed to process chat message:", { error });
      throw new AppError(
        500,
        "AI_SERVICE_ERROR",
        "Failed to process chat message"
      );
    }
  }

  async generateText(prompt: string): Promise<AIResponse> {
    try {
      const response = await langchainAIServiceClaude.generateText(prompt);
      return { message: response };
    } catch (error) {
      logger.error("Failed to generate text:", { error });
      throw new AppError(500, "AI_SERVICE_ERROR", "Failed to generate text");
    }
  }

  private extractMessageContent(
    message: string | undefined
  ): string | undefined {
    if (!message) return undefined;
    return message;
  }

  private extractSentiment(memory: MemorySearchResult): SentimentAnalysis {
    const score = memory?.score ?? 0;
    let label: SentimentAnalysis["label"] = "neutral";

    if (score > 0.3) label = "positive";
    else if (score < -0.3) label = "negative";

    return {
      score,
      label,
      confidence: Math.abs(score),
    };
  }

  private extractGrowthIndicators(
    memory: MemorySearchResult
  ): GrowthIndicator[] {
    const content = this.extractMessageContent(memory.relevantMemories[0]);
    if (!content) return [];

    const indicators = content
      .split("\n")
      .filter((line: string) => line.startsWith("- Indicator:"))
      .map((line: string) => {
        const [type, evidence] = line
          .replace("- Indicator:", "")
          .split(":")
          .map((s) => s.trim());
        return {
          type: type.toLowerCase() as GrowthIndicator["type"],
          evidence: evidence || "",
          confidence: memory?.score || 0,
        };
      });

    return indicators.length > 0
      ? indicators
      : [
          {
            type: "learning",
            evidence: "No specific indicators found",
            confidence: 0,
          },
        ];
  }

  private generateSuggestedActions(memory: MemorySearchResult): string[] {
    const content = this.extractMessageContent(memory.relevantMemories[0]);
    if (!content) return [];

    const actions = content
      .split("\n")
      .filter((line: string) => line.startsWith("- Action:"))
      .map((line: string) => line.replace("- Action:", "").trim());

    return actions.length > 0
      ? actions
      : ["Reflect on your progress", "Set a new goal", "Review past entries"];
  }

  private convertZepMemoryResult(zepMemory: any): MemorySearchResult {
    return {
      relevantMemories: [zepMemory.message?.content || ""],
      score: zepMemory.score || 0,
    };
  }

  async analyzeEntryContent(content: string): Promise<{
    sentiment: SentimentAnalysis;
    growthIndicators: GrowthIndicator[];
  }> {
    try {
      const memories = await this.zepClient.memory.search(
        this.COLLECTION_NAME,
        {
          text: content,
          metadata: {
            type: "analysis",
          },
        }
      );

      if (!memories[0]) {
        throw new AppError(
          500,
          "AI_SERVICE_ERROR",
          "No analysis results found"
        );
      }

      const convertedMemory = this.convertZepMemoryResult(memories[0]);
      const sentiment = this.extractSentiment(convertedMemory);
      const growthIndicators = this.extractGrowthIndicators(convertedMemory);

      return {
        sentiment,
        growthIndicators,
      };
    } catch (error) {
      logger.error("Failed to analyze entry content:", { error });
      throw new AppError(
        500,
        "AI_SERVICE_ERROR",
        "Failed to analyze entry content"
      );
    }
  }

  async analyzeEntry(entry: IEntry): Promise<{
    sentiment: SentimentAnalysis;
    growthIndicators: GrowthIndicator[];
  }> {
    try {
      const memories = await this.zepClient.memory.search(
        this.COLLECTION_NAME,
        {
          text: entry.content,
          metadata: {
            type: "analysis",
            entryId: entry.id,
          },
        }
      );

      if (!memories[0]) {
        throw new AppError(
          500,
          "AI_SERVICE_ERROR",
          "No analysis results found"
        );
      }

      const convertedMemory = this.convertZepMemoryResult(memories[0]);
      const sentiment = this.extractSentiment(convertedMemory);
      const growthIndicators = this.extractGrowthIndicators(convertedMemory);

      return {
        sentiment,
        growthIndicators,
      };
    } catch (error) {
      logger.error("Failed to analyze entry:", { error });
      throw new AppError(500, "AI_SERVICE_ERROR", "Failed to analyze entry");
    }
  }

  async addToGraph(userId: string, data: any) {
    try {
      await this.zepClient.graph.add({
        data,
        userId: userId,
        type: "json",
      });

      return {
        success: true,
        message: "Data successfully added to graph",
      };
    } catch (error) {
      logger.error("Error adding data to graph:", { error });
      throw new AppError(
        500,
        "AI_SERVICE_ERROR",
        "Failed to add data to graph"
      );
    }
  }

  async getGrowthIndicators(content: string): Promise<GrowthIndicator[]> {
    try {
      const prompt = `
        Analyze the following journal entry for indicators of a growth mindset. 
        Look for evidence of resilience, effort, embracing challenges, seeking feedback, and learning from setbacks.
        
        Journal entry:
        ${content}
        
        Return a JSON array of objects, each with a 'type' (one of: resilience, effort, challenge, feedback, learning) and 'evidence' (the relevant text from the entry).
        Format: [{"type": "resilience", "evidence": "text from entry showing resilience"}]
        If no indicators are found, return an empty array: []
      `;

      const response = await this.generateText(prompt);
      let indicators: GrowthIndicator[] = [];

      try {
        indicators = JSON.parse(response.message) as GrowthIndicator[];
      } catch (parseError) {
        logger.error("Failed to parse AI response as JSON:", {
          error: parseError instanceof Error ? parseError.message : String(parseError),
          response: response.message,
        });
      }

      return indicators;
    } catch (error) {
      logger.error("Failed to get growth indicators:", {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  async generateSummary(entries: IEntry[]): Promise<string> {
    try {
      // Prepare the entries for the prompt
      const entriesText = entries
        .map(
          (entry) =>
            `Date: ${new Date(entry.createdAt).toLocaleDateString()}
Content: ${entry.content}`
        )
        .join("\n\n");

      const prompt = `
        Summarize the following journal entries, highlighting patterns, growth, and insights.
        Focus on identifying themes, progress, and areas for reflection.
        
        Journal entries:
        ${entriesText}
        
        Provide a concise summary (maximum 200 words) that captures the essence of these entries.
      `;

      const response = await this.generateText(prompt);
      return response.message;
    } catch (error) {
      logger.error("Failed to generate summary:", {
        error: error instanceof Error ? error.message : String(error),
      });
      return "";
    }
  }

  async generateGoalSuggestions(content: string): Promise<Array<{
    content: string;
    targetDate?: string;
    metricType?: string;
  }>> {
    try {
      // Prepare the prompt for the AI service
      const prompt = `
        Based on the following journal content, generate 3 actionable growth-oriented goals that would help the user develop a growth mindset.
        Each goal should be specific, measurable, and have a clear timeframe.
        For each goal, also identify which growth mindset metric it relates to (resilience, effort, challenge, feedback, or learning).
        
        Journal content:
        ${content}
        
        Format your response as a JSON array with objects containing:
        - content: The goal text
        - targetDate: A target date for completion (YYYY-MM-DD format)
        - metricType: The related growth mindset metric
        
        Example:
        [
          {
            "content": "Practice piano for 20 minutes daily for the next week, even when it feels challenging",
            "targetDate": "2025-03-18",
            "metricType": "effort"
          }
        ]
      `;

      // Call the AI service to generate goal suggestions
      const aiResponse = await this.generateText(prompt);

      // Parse the AI response as JSON
      let suggestions;
      try {
        suggestions = JSON.parse(aiResponse.message);
      } catch (error) {
        logger.error("Failed to parse AI response as JSON:", {
          error: error instanceof Error ? error.message : String(error),
          response: aiResponse.message,
        });
        return [];
      }

      return suggestions;
    } catch (error) {
      logger.error("Error generating goal suggestions:", {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }
}

export const aiService = new AIService();
