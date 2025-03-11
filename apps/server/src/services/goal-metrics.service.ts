import { MetricsService } from './metrics.service';
import logger from '../utils/logger';
import type { Goal, MetricType as GoalMetricType } from '../types/goal';
import type { MetricType as MetricsMetricType, DateRange } from '../types/metrics';

/**
 * Service for handling goal-related metrics
 */
export class GoalMetricsService {
  private metricsService: MetricsService;

  constructor() {
    this.metricsService = new MetricsService();
  }

  /**
   * Map goal metric type to metrics service metric type
   * @param goalMetricType The goal metric type
   */
  private mapMetricType(goalMetricType?: GoalMetricType): MetricsMetricType {
    // Both types have the same values, but TypeScript treats them as different types
    // This function ensures we're using the correct type for the metrics service
    if (!goalMetricType) {
      return 'resilience'; // Default metric type
    }
    
    // Validate that the goal metric type is a valid metrics metric type
    const validMetricTypes: MetricsMetricType[] = ['resilience', 'learning', 'challenge', 'feedback', 'effort'];
    return validMetricTypes.includes(goalMetricType as any) 
      ? goalMetricType as unknown as MetricsMetricType 
      : 'resilience';
  }

  /**
   * Record a goal completion as a metric
   * @param goal The completed goal
   */
  async recordGoalCompletion(goal: Goal): Promise<void> {
    try {
      // Extract the metric type from the goal if available
      const metricType = this.mapMetricType(goal.relatedMetricType);
      
      // Record the metric
      await this.metricsService.recordMetric(
        goal.userId,
        metricType,
        5, // Use a mid-range value for goal completions
        `Goal completed: ${goal.content}`
      );
      
      logger.info(`Recorded goal completion metric for user ${goal.userId}`, { 
        goalId: goal.id, 
        metricType 
      });
    } catch (error) {
      logger.error('Failed to record goal completion metric', { 
        error: error instanceof Error ? error.message : String(error),
        goalId: goal.id
      });
    }
  }

  /**
   * Get metrics related to goal completions
   * @param userId The user ID
   * @param startDate Optional start date for filtering
   * @param endDate Optional end date for filtering
   */
  async getGoalCompletionMetrics(userId: string, startDate?: Date, endDate?: Date) {
    try {
      // Create a date range if dates are provided
      const timeRange: DateRange | undefined = startDate && endDate 
        ? { start: startDate, end: endDate }
        : undefined;
      
      // Get all metrics for the user within the date range
      const metrics = await this.metricsService.getMetrics(userId, timeRange);
      
      // Filter to only include goal-related metrics
      return metrics.filter(metric => 
        metric.notes?.includes('Goal completed:')
      );
    } catch (error) {
      logger.error('Failed to get goal completion metrics', { 
        error: error instanceof Error ? error.message : String(error),
        userId
      });
      return [];
    }
  }
}

// Create a singleton instance
export const goalMetricsService = new GoalMetricsService();
