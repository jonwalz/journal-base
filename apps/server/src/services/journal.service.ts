import { JournalRepository } from "../repositories/journal.repository";
import { AuthorizationError, NotFoundError } from "../utils/errors";
import type { IJournal, IEntry, IGrowthIndicators } from "../types";
import { ZepClient } from "@getzep/zep-cloud";
import { env } from "../config/environment";

interface ZepMemory {
  message?: {
    content: string;
    metadata?: Record<string, unknown>;
  };
  score?: number;
}

export class JournalService {
  private journalRepository: JournalRepository;
  private zepClient: ZepClient;

  constructor() {
    this.journalRepository = new JournalRepository();
    this.zepClient = new ZepClient({
      apiKey: env.ZEP_API_KEY,
    });
  }

  async createJournal(userId: string, title: string): Promise<IJournal> {
    return await this.journalRepository.create(userId, title);
  }

  async getJournals(userId: string): Promise<IJournal[]> {
    return await this.journalRepository.findByUserId(userId);
  }

  async createEntry({
    userId,
    journalId,
    content,
    firstName,
    lastName,
    email,
  }: {
    userId: string;
    journalId: string;
    content: string;
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<IEntry> {
    // Verify journal ownership
    const journal = await this.journalRepository.findById(journalId);
    if (journal.userId !== userId) {
      throw new AuthorizationError("You do not have access to this journal");
    }

    // Create the entry
    const entry = await this.journalRepository.createEntry(journalId, content);

    // Create Zep graph data for the entry
    const graphData = {
      id: entry.id,
      content: entry.content,
      metadata: {
        type: "journal_entry",
        journalId: journal.id,
        userFirstName: firstName,
        userLastName: lastName,
        userEmail: email,
      },
    };

    // TODO: Chunk the entry.content into smaller chunks and update the zep client to use chunked data

    // Add the graph data to Zep
    const zepResult = await this.zepClient.graph.add({
      data: JSON.stringify(graphData),
      userId: userId,
      type: "json",
    });

    // Analyze the entry asynchronously
    this.analyzeEntry(entry.id, content).catch((error) => {
      console.error("Error analyzing entry:", error);
    });

    return entry;
  }

  async getEntries(userId: string, journalId: string): Promise<IEntry[]> {
    // Verify journal ownership
    const journal = await this.journalRepository.findById(journalId);
    if (journal.userId !== userId) {
      throw new AuthorizationError("You do not have access to this journal");
    }

    return await this.journalRepository.getEntries(journalId);
  }

  async updateEntry(
    userId: string,
    journalId: string,
    entryId: string,
    content: string
  ): Promise<IEntry> {
    // Verify journal ownership
    const journal = await this.journalRepository.findById(journalId);
    if (journal.userId !== userId) {
      throw new AuthorizationError("You do not have access to this journal");
    }

    // Update the entry
    const entry = await this.journalRepository.updateEntry(entryId, {
      content,
    });
    if (!entry) {
      throw new Error("Entry not found");
    }

    // Analyze the entry asynchronously
    this.analyzeEntry(entry.id, content).catch((error) => {
      console.error("Error analyzing entry:", error);
    });

    return entry;
  }

  async getEntryById(
    userId: string,
    journalId: string,
    entryId: string
  ): Promise<IEntry | null> {
    // 1. Verify journal ownership
    const journal = await this.journalRepository.findById(journalId);
    if (!journal || journal.userId !== userId) {
      return null;
    }

    // 2. Find the specific entry within the journal
    const entry = await this.journalRepository.findEntryById(entryId);

    // 3. Check if the entry belongs to the correct journal and return
    if (!entry || entry.journalId !== journalId) {
      // Entry not found or belongs to a different journal (shouldn't happen if DB is consistent)
      return null;
    }

    return entry;
  }

  async deleteEntry(
    userId: string,
    journalId: string,
    entryId: string
  ): Promise<void> {
    // 1. Verify journal ownership first to prevent deleting entries from other users' journals
    const journal = await this.journalRepository.findById(journalId);
    if (!journal || journal.userId !== userId) {
      throw new AuthorizationError("Journal not found or access denied");
    }

    // 2. Call the repository to delete the entry
    // We need to ensure the entry actually belonged to this journalId,
    // the repository method should handle this check or we can do it here after fetching the entry first.
    // For simplicity, let's assume the repository handles checking the entry exists before deleting.
    const deleted = await this.journalRepository.deleteEntryById(
      entryId,
      journalId
    ); // Pass journalId for potential check in repo

    if (!deleted) {
      // If the repository method returns false or throws, handle it.
      // Here we assume it returns boolean indicating success/failure (e.g., if entry didn't exist)
      throw new NotFoundError("Entry"); // Or appropriate error
    }

    // Optional: Emit an event, e.g., entryDeleted
  }

  private async analyzeEntry(entryId: string, content: string): Promise<void> {
    try {
      // Analyze sentiment and growth indicators using Zep
      // const _memory = await this.zepClient.searchMemory("journal_entries", {
      //   text: content,
      //   meta: {
      //     type: "analysis",
      //     entryId,
      //   },
      // });
      // Extract sentiment and growth indicators using the memory results
      // const sentimentScore = this.extractSentiment(_memory);
      // const growthIndicators = this.extractGrowthIndicators(_memory);
      // Update the entry with analysis results
      // await this.journalRepository.updateEntry(entryId, {
      //   sentimentScore,
      //   growthIndicators,
      // });
    } catch (error) {
      console.error("Error analyzing entry:", error);
      throw error;
    }
  }

  private extractSentiment(_memory: ZepMemory): number {
    // Implement sentiment extraction logic
    // This is a placeholder implementation
    return Math.random() * 2 - 1; // Returns a value between -1 and 1
  }

  private extractGrowthIndicators(_memory: ZepMemory): IGrowthIndicators {
    // Implement growth indicators extraction logic
    // This is a placeholder implementation
    return {
      resilience: Math.random() * 10,
      effort: Math.random() * 10,
      challenge: Math.random() * 10,
      feedback: Math.random() * 10,
      learning: Math.random() * 10,
    };
  }
}
