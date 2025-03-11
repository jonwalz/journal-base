import { GoalRepository } from "../repositories/goal.repository";
import {
  type Goal,
  type GoalAnalytics,
  type MetricType,
  type DateRange,
  type GoalStatus,
} from "../types/goal";
import { JournalRepository } from "../repositories/journal.repository";
import { AIService } from "./ai/ai.service";
import { goalMetricsService } from "./goal-metrics.service";
import logger from "../utils/logger";

export class GoalService {
  private goalRepository: GoalRepository;
  private journalRepository: JournalRepository;
  private aiService: AIService;

  constructor(
    goalRepository: GoalRepository = new GoalRepository(),
    journalRepository: JournalRepository = new JournalRepository(),
    aiService: AIService = new AIService()
  ) {
    this.goalRepository = goalRepository;
    this.journalRepository = journalRepository;
    this.aiService = aiService;
  }

  /**
   * Generate goals based on a journal entry
   */
  async generateGoalsFromEntry(entryId: string): Promise<Goal[]> {
    // Get the journal entry
    const entry = await this.journalRepository.getEntryById(entryId);
    
    // Get the journal to access the userId
    const journal = await this.journalRepository.findById(entry.journalId);
    
    // Use AI to generate goal suggestions based on the entry content
    const goalSuggestions = await this.generateGoalSuggestionsFromContent(
      entry.content,
      journal.userId
    );

    // Create goals in the database
    const goals: Goal[] = [];
    for (const suggestion of goalSuggestions) {
      const goal = await this.goalRepository.createGoal({
        userId: journal.userId,
        journalEntryId: entryId,
        content: suggestion.content,
        targetDate: suggestion.targetDate,
        relatedMetricType: suggestion.metricType,
        sourceType: "journal_entry",
      });
      goals.push(goal);
    }

    return goals;
  }

  /**
   * Generate daily goals for a user
   */
  async generateDailyGoals(userId: string): Promise<Goal[]> {
    // Get recent journal entries for the user
    const recentEntries = await this.journalRepository.getRecentEntriesByUserId(
      userId,
      5
    );

    // Combine content from recent entries
    const combinedContent = recentEntries
      .map((entry) => entry.content)
      .join("\n\n");

    // Use AI to generate goal suggestions based on combined content
    const goalSuggestions = await this.generateGoalSuggestionsFromContent(
      combinedContent,
      userId
    );

    // Create goals in the database
    const goals: Goal[] = [];
    for (const suggestion of goalSuggestions) {
      const goal = await this.goalRepository.createGoal({
        userId,
        content: suggestion.content,
        targetDate: suggestion.targetDate,
        relatedMetricType: suggestion.metricType,
        sourceType: "daily_generation",
      });
      goals.push(goal);
    }

    return goals;
  }

  /**
   * Get all goals for a user with optional filters
   */
  async getGoals(
    userId: string,
    filters?: {
      status?: GoalStatus;
      dateRange?: DateRange;
      metricType?: MetricType;
    }
  ): Promise<Goal[]> {
    return this.goalRepository.getGoalsByUserId(userId, {
      status: filters?.status,
      metricType: filters?.metricType,
    });
  }

  /**
   * Accept a suggested goal
   */
  async acceptGoal(goalId: string): Promise<Goal> {
    const goal = await this.goalRepository.acceptGoal(goalId);
    if (!goal) {
      throw new Error(`Goal with ID ${goalId} not found`);
    }
    return goal;
  }

  /**
   * Mark a goal as completed
   */
  async completeGoal(goalId: string): Promise<Goal> {
    const goal = await this.goalRepository.completeGoal(goalId);
    if (!goal) {
      throw new Error(`Goal with ID ${goalId} not found`);
    }
    
    // Record the goal completion as a metric
    try {
      await goalMetricsService.recordGoalCompletion(goal);
      logger.info(`Recorded goal completion metric for goal: ${goalId}`);
    } catch (error) {
      // Log the error but don't fail the operation if metrics recording fails
      logger.error(`Failed to record goal completion metric for goal: ${goalId}`, {
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    return goal;
  }

  /**
   * Delete a goal
   */
  async deleteGoal(goalId: string): Promise<void> {
    const goal = await this.goalRepository.deleteGoal(goalId);
    if (!goal) {
      throw new Error(`Goal with ID ${goalId} not found`);
    }
  }

  /**
   * Get goal analytics for a user
   */
  async getGoalAnalytics(
    userId: string,
    timeRange?: DateRange
  ): Promise<GoalAnalytics> {
    // Get all goals for the user
    const allGoals = await this.goalRepository.getGoalsByUserId(userId);

    // Filter goals based on time range if provided
    const filteredGoals = timeRange
      ? allGoals.filter((goal) => {
          const suggestedDate = new Date(goal.suggestedAt);
          return (
            suggestedDate >= timeRange.startDate &&
            suggestedDate <= timeRange.endDate
          );
        })
      : allGoals;

    // Count goals by status
    const totalGoals = filteredGoals.length;
    const acceptedGoals = filteredGoals.filter(
      (goal) => goal.acceptedAt && !goal.deletedAt
    ).length;
    const completedGoals = filteredGoals.filter(
      (goal) => goal.completedAt && !goal.deletedAt
    ).length;

    // Calculate completion rate
    const completionRate =
      acceptedGoals > 0 ? completedGoals / acceptedGoals : 0;

    // Calculate average time to completion
    const completedGoalsWithDates = filteredGoals.filter(
      (goal) => goal.acceptedAt && goal.completedAt && !goal.deletedAt
    );

    const totalCompletionDays = completedGoalsWithDates.reduce(
      (total, goal) => {
        const acceptedDate = new Date(goal.acceptedAt!);
        const completedDate = new Date(goal.completedAt!);
        const daysDifference =
          (completedDate.getTime() - acceptedDate.getTime()) /
          (1000 * 60 * 60 * 24);
        return total + daysDifference;
      },
      0
    );

    const averageTimeToCompletion =
      completedGoalsWithDates.length > 0
        ? totalCompletionDays / completedGoalsWithDates.length
        : 0;

    // Count goals by metric type
    const goalsByMetricType: Record<MetricType, number> = {
      resilience: 0,
      effort: 0,
      challenge: 0,
      feedback: 0,
      learning: 0,
    };

    filteredGoals.forEach((goal) => {
      if (goal.relatedMetricType) {
        goalsByMetricType[goal.relatedMetricType] += 1;
      }
    });

    // Calculate most effective goal types
    const metricTypes: MetricType[] = [
      "resilience",
      "effort",
      "challenge",
      "feedback",
      "learning",
    ];
    const mostEffectiveGoalTypes = metricTypes
      .map((metricType) => {
        const goalsOfType = filteredGoals.filter(
          (goal) => goal.relatedMetricType === metricType
        );
        const acceptedGoalsOfType = goalsOfType.filter(
          (goal) => goal.acceptedAt && !goal.deletedAt
        ).length;
        const completedGoalsOfType = goalsOfType.filter(
          (goal) => goal.completedAt && !goal.deletedAt
        ).length;
        const typeCompletionRate =
          acceptedGoalsOfType > 0
            ? completedGoalsOfType / acceptedGoalsOfType
            : 0;

        return {
          metricType,
          completionRate: typeCompletionRate,
        };
      })
      .sort((a, b) => b.completionRate - a.completionRate);

    return {
      totalGoals,
      acceptedGoals,
      completedGoals,
      completionRate,
      averageTimeToCompletion,
      goalsByMetricType,
      mostEffectiveGoalTypes,
    };
  }

  /**
   * Generate goal suggestions from content using AI
   */
  private async generateGoalSuggestionsFromContent(
    content: string,
    _userId: string
  ): Promise<
    Array<{
      content: string;
      targetDate?: Date;
      metricType?: MetricType;
    }>
  > {
    try {
      // Use AI service to analyze the content and generate goal suggestions
      const response = await this.aiService.generateGoalSuggestions(content);
      
      // Process and validate the response
      const suggestions = response.map((suggestion: {
        content: string;
        targetDate?: string;
        metricType?: string;
      }) => {
        // Validate metric type
        const metricType = suggestion.metricType
          ? this.validateMetricType(suggestion.metricType)
          : undefined;

        // Process target date if provided
        let targetDate: Date | undefined = undefined;
        if (suggestion.targetDate) {
          try {
            targetDate = new Date(suggestion.targetDate);
            // Validate date is not in the past
            if (targetDate < new Date()) {
              // If date is in the past, set it to 7 days from now
              targetDate = new Date();
              targetDate.setDate(targetDate.getDate() + 7);
            }
          } catch {
            // If date parsing fails, leave it undefined
            targetDate = undefined;
          }
        }

        return {
          content: suggestion.content,
          targetDate,
          metricType,
        };
      });

      return suggestions;
    } catch (error) {
      logger.error('Error generating goal suggestions from content', {
        error: error instanceof Error ? error.message : String(error)
      });
      // Return a default suggestion if AI fails
      return [
        {
          content: 'Consider setting a personal growth goal based on your journal entries',
          targetDate: new Date(new Date().setDate(new Date().getDate() + 7)),
          metricType: 'resilience',
        },
      ];
    }
  }

  /**
   * Validate that a metric type is one of the allowed values
   */
  private validateMetricType(metricType: string): MetricType | undefined {
    const validMetricTypes: MetricType[] = [
      'resilience',
      'effort',
      'challenge',
      'feedback',
      'learning',
    ];

    return validMetricTypes.includes(metricType as MetricType)
      ? (metricType as MetricType)
      : undefined;
  }
}
