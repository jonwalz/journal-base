import { Goal, GoalFilters } from "~/types/goals";
import { ApiClient, RequestOptions } from "./api-client.server";

export class GoalServiceError extends Error {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "GoalServiceError";
  }
}

export class GoalService {
  static async getGoals(filters?: GoalFilters, options: RequestOptions = {}): Promise<Goal[]> {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        if (filters.status && filters.status !== "all") {
          queryParams.append("status", filters.status);
        }

        if (filters.dateRange && filters.dateRange !== "all") {
          queryParams.append("dateRange", filters.dateRange);
        }

        if (filters.metricType && filters.metricType !== "all") {
          queryParams.append("metricType", filters.metricType);
        }
      }

      const response = await ApiClient.get<{goals: Goal[]}>(`/goals?${queryParams}`, options);
      return response.data.goals || [];
    } catch (error) {
      throw new GoalServiceError("Failed to fetch goals", error);
    }
  }

  static async acceptGoal(goalId: string, options: RequestOptions = {}): Promise<Goal> {
    try {
      console.log(`Sending acceptGoal request for goal ID: ${goalId}`);
      
      // Using POST method for the accept goal endpoint to match the form submission
      const response = await ApiClient.post<{success: boolean; goal: Goal}>(`/api/goals/${goalId}/accept`, {}, options);
      console.log("Response data:", response.data);

      if (!response.data.goal) {
        console.error("Response missing goal data:", response.data);
        throw new Error("Response missing goal data");
      }

      return response.data.goal;
    } catch (error) {
      console.error("Error in acceptGoal:", error);
      throw new GoalServiceError(
        `Failed to accept goal with id ${goalId}`,
        error
      );
    }
  }

  static async completeGoal(goalId: string, options: RequestOptions = {}): Promise<Goal> {
    try {
      console.log(`Sending completeGoal request for goal ID: ${goalId}`);
      
      // Using POST method for the complete goal endpoint to match the form submission
      const response = await ApiClient.post<{success: boolean; goal: Goal}>(`/api/goals/${goalId}/complete`, {}, options);
      console.log("Response data:", response.data);

      if (!response.data.goal) {
        console.error("Response missing goal data:", response.data);
        throw new Error("Response missing goal data");
      }

      return response.data.goal;
    } catch (error) {
      console.error("Error in completeGoal:", error);
      throw new GoalServiceError(
        `Failed to complete goal with id ${goalId}`,
        error
      );
    }
  }

  static async deleteGoal(goalId: string, options: RequestOptions = {}): Promise<void> {
    try {
      console.log(`Sending deleteGoal request for goal ID: ${goalId}`);
      
      // Using the delete method from ApiClient
      await ApiClient.delete(`/api/goals/${goalId}`, options);
      console.log("Goal deleted successfully");
    } catch (error) {
      console.error("Error in deleteGoal:", error);
      throw new GoalServiceError(
        `Failed to delete goal with id ${goalId}`,
        error
      );
    }
  }
  
  static async getNewGoalsCount(userId: string, options: RequestOptions = {}): Promise<number> {
    try {
      if (!userId) {
        return 0; // Can't fetch goals without a user ID
      }

      // Using ApiClient to fetch suggested goals count
      // Use the /api/goals/new-count endpoint which is specifically designed for this purpose
      const response = await ApiClient.get<{count: number}>(`/api/goals/new-count?userId=${userId}`, options);
      return response.data.count || 0;
    } catch (error) {
      // Fail silently for notification count
      console.error("Failed to get new goals count:", error);
      return 0;
    }
  }

  static async generateGoals(entryId: string, options: RequestOptions = {}): Promise<Goal[]> {
    try {
      const response = await ApiClient.post<{goals: Goal[]}>("/api/goals/generate", { entryId }, options);
      return response.data.goals || [];
    } catch (error) {
      throw new GoalServiceError(
        `Failed to generate goals for entry ${entryId}`,
        error
      );
    }
  }

  static async getGoalAnalytics(userId: string, options: RequestOptions = {}): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("userId", userId);

      const response = await ApiClient.get<any>(`/api/goals/analytics?${queryParams}`, options);
      return response.data;
    } catch (error) {
      throw new GoalServiceError("Failed to fetch goal analytics", error);
    }
  }
}
