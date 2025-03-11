import { Goal, GoalFilters } from '~/types/goals';

export class GoalServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'GoalServiceError';
  }
}

export class GoalService {
  static async getGoals(filters?: GoalFilters): Promise<Goal[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
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
      
      const response = await fetch(`/goal-tracking?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      
      const data = await response.json();
      return data.goals || [];
    } catch (error) {
      throw new GoalServiceError('Failed to fetch goals', error);
    }
  }

  static async acceptGoal(goalId: string): Promise<Goal> {
    try {
      const formData = new FormData();
      formData.append('goalId', goalId);
      formData.append('_action', 'acceptGoal');
      
      const response = await fetch(`/goal-tracking`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to accept goal');
      }
      
      const data = await response.json();
      return data.goal;
    } catch (error) {
      throw new GoalServiceError(`Failed to accept goal with id ${goalId}`, error);
    }
  }

  static async completeGoal(goalId: string): Promise<Goal> {
    try {
      const formData = new FormData();
      formData.append('goalId', goalId);
      formData.append('_action', 'completeGoal');
      
      const response = await fetch(`/goal-tracking`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete goal');
      }
      
      const data = await response.json();
      return data.goal;
    } catch (error) {
      throw new GoalServiceError(`Failed to complete goal with id ${goalId}`, error);
    }
  }

  static async deleteGoal(goalId: string): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('goalId', goalId);
      formData.append('_action', 'deleteGoal');
      
      const response = await fetch(`/goal-tracking`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }
    } catch (error) {
      throw new GoalServiceError(`Failed to delete goal with id ${goalId}`, error);
    }
  }

  static async getNewGoalsCount(userId: string): Promise<number> {
    try {
      if (!userId) {
        return 0; // Can't fetch goals without a user ID
      }

      const queryParams = new URLSearchParams();
      queryParams.append('userId', userId);
      
      // This endpoint should be implemented as a resource route in Remix
      const response = await fetch(`/api/goals/new-count?${queryParams}`);
      
      if (!response.ok) {
        return 0; // Fail silently for notification count
      }
      
      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      // Fail silently for notification count
      console.error('Failed to get new goals count:', error);
      return 0;
    }
  }

  static async generateGoals(entryId: string): Promise<Goal[]> {
    try {
      const response = await fetch('/api/goals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate goals');
      }
      
      const data = await response.json();
      return data.goals || [];
    } catch (error) {
      throw new GoalServiceError(`Failed to generate goals for entry ${entryId}`, error);
    }
  }

  static async getGoalAnalytics(userId: string, dateRange?: { startDate: string, endDate: string }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('userId', userId);
      
      if (dateRange) {
        queryParams.append('startDate', dateRange.startDate);
        queryParams.append('endDate', dateRange.endDate);
      }
      
      const response = await fetch(`/api/goals/analytics?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch goal analytics');
      }
      
      return response.json();
    } catch (error) {
      throw new GoalServiceError('Failed to fetch goal analytics', error);
    }
  }
}
