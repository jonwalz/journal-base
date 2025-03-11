import { ApiClient, RequestOptions } from './api-client.server';
import { Goal, GoalFilters } from '~/types/goals';

export class GoalServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'GoalServiceError';
  }
}

export class GoalService {
  static async getGoals(filters?: GoalFilters, options: RequestOptions = {}): Promise<Goal[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        // Add userId as a required parameter
        if (filters.userId) {
          queryParams.append('userId', filters.userId);
        }
        
        if (filters.status && filters.status !== 'all') {
          queryParams.append('status', filters.status);
        }
        
        if (filters.dateRange && filters.dateRange !== 'all') {
          queryParams.append('dateRange', filters.dateRange);
        }
        
        if (filters.metricType && filters.metricType !== 'all') {
          queryParams.append('metricType', filters.metricType);
        }
      }
      
      const response = await ApiClient.get<{ success: boolean; goals: Goal[] }>(`/api/goals?${queryParams}`, options);
      return response.data.goals;
    } catch (error) {
      throw new GoalServiceError('Failed to fetch goals', error);
    }
  }

  static async acceptGoal(goalId: string, options: RequestOptions = {}): Promise<Goal> {
    try {
      const response = await ApiClient.post<{ success: boolean; goal: Goal }>(`/api/goals/${goalId}/accept`, {}, options);
      return response.data.goal;
    } catch (error) {
      throw new GoalServiceError(`Failed to accept goal with id ${goalId}`, error);
    }
  }

  static async completeGoal(goalId: string, options: RequestOptions = {}): Promise<Goal> {
    try {
      const response = await ApiClient.post<{ success: boolean; goal: Goal }>(`/api/goals/${goalId}/complete`, {}, options);
      return response.data.goal;
    } catch (error) {
      throw new GoalServiceError(`Failed to complete goal with id ${goalId}`, error);
    }
  }

  static async deleteGoal(goalId: string, options: RequestOptions = {}): Promise<void> {
    try {
      await ApiClient.delete(`/api/goals/${goalId}`, options);
    } catch (error) {
      throw new GoalServiceError(`Failed to delete goal with id ${goalId}`, error);
    }
  }

  static async getNewGoalsCount(userId: string, options: RequestOptions = {}): Promise<number> {
    try {
      if (!userId) {
        return 0; // Can't fetch goals without a user ID
      }

      const queryParams = new URLSearchParams();
      queryParams.append('userId', userId);
      
      const response = await ApiClient.get<{ count: number }>(`/api/goals/new-count?${queryParams}`, options);
      return response.data.count || 0;
    } catch (error) {
      // Fail silently for notification count
      console.error('Failed to get new goals count:', error);
      return 0;
    }
  }

  static async generateGoals(entryId: string, options: RequestOptions = {}): Promise<Goal[]> {
    try {
      const response = await ApiClient.post<{ success: boolean; goals: Goal[] }>('/api/goals/generate', { entryId }, options);
      return response.data.goals || [];
    } catch (error) {
      throw new GoalServiceError(`Failed to generate goals for entry ${entryId}`, error);
    }
  }

  static async getGoalAnalytics(userId: string, dateRange?: { startDate: string, endDate: string }, options: RequestOptions = {}): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('userId', userId);
      
      if (dateRange) {
        queryParams.append('startDate', dateRange.startDate);
        queryParams.append('endDate', dateRange.endDate);
      }
      
      const response = await ApiClient.get<{ success: boolean; analytics: any }>(`/api/goals/analytics?${queryParams}`, options);
      return response.data.analytics;
    } catch (error) {
      throw new GoalServiceError('Failed to fetch goal analytics', error);
    }
  }
}
