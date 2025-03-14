import { eq, and, isNull, not, SQL } from 'drizzle-orm';
import { db } from '../config/database';
import { goals } from '../db/schema';
import type { Goal, GoalStatus, MetricType } from '../types/goal';

export class GoalRepository {
  async createGoal(goalData: Omit<Goal, 'id' | 'suggestedAt' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    // Convert Date objects to strings for database insertion
    const dbGoalData = {
      ...goalData,
      targetDate: goalData.targetDate ? goalData.targetDate.toISOString().split('T')[0] : null
    };
    
    const [goal] = await db.insert(goals).values(dbGoalData).returning();
    return this.mapDbGoalToGoal(goal);
  }

  async getGoalById(id: string): Promise<Goal | undefined> {
    const [goal] = await db.select().from(goals).where(eq(goals.id, id));
    return goal ? this.mapDbGoalToGoal(goal) : undefined;
  }

  async getGoalsByUserId(
    userId: string,
    filters?: {
      status?: GoalStatus;
      metricType?: string;
      sourceType?: 'journal_entry' | 'daily_generation';
    }
  ): Promise<Goal[]> {
    // Create a base condition for userId
    let conditions: SQL<unknown> = eq(goals.userId, userId);
    
    // Add status filter if provided
    if (filters?.status) {
      switch (filters.status) {
        case 'suggested':
          // Suggested goals: not accepted, not completed
          conditions = and(
            conditions,
            isNull(goals.acceptedAt),
            isNull(goals.completedAt)
          ) as SQL<unknown>;
          break;
        case 'accepted':
          // Accepted goals: accepted, not completed
          conditions = and(
            conditions,
            not(isNull(goals.acceptedAt)),
            isNull(goals.completedAt)
          ) as SQL<unknown>;
          break;
        case 'completed':
          // Completed goals: completed
          conditions = and(
            conditions,
            not(isNull(goals.completedAt))
          ) as SQL<unknown>;
          break;
        // Remove 'deleted' case as we're now performing hard deletes
      }
    }
    
    // Add metric type filter if provided
    if (filters?.metricType) {
      conditions = and(conditions, eq(goals.relatedMetricType, filters.metricType)) as SQL<unknown>;
    }
    
    // Add source type filter if provided
    if (filters?.sourceType) {
      conditions = and(conditions, eq(goals.sourceType, filters.sourceType)) as SQL<unknown>;
    }
    
    // Execute the query with all conditions
    const result = await db.select().from(goals).where(conditions);
    return result.map(goal => this.mapDbGoalToGoal(goal));
  }

  async updateGoal(id: string, data: Partial<Goal>): Promise<Goal | undefined> {
    // Convert Date objects to strings for database update
    const dbData: Record<string, any> = {
      ...data,
      updatedAt: new Date()
    };
    
    // Handle date conversions
    if (data.targetDate) {
      dbData.targetDate = data.targetDate.toISOString().split('T')[0];
    }
    
    const [updatedGoal] = await db
      .update(goals)
      .set(dbData)
      .where(eq(goals.id, id))
      .returning();
    
    return updatedGoal ? this.mapDbGoalToGoal(updatedGoal) : undefined;
  }

  async acceptGoal(id: string): Promise<Goal | undefined> {
    const [goal] = await db
      .update(goals)
      .set({ acceptedAt: new Date(), updatedAt: new Date() })
      .where(eq(goals.id, id))
      .returning();
    
    return goal ? this.mapDbGoalToGoal(goal) : undefined;
  }

  async completeGoal(id: string): Promise<Goal | undefined> {
    const [goal] = await db
      .update(goals)
      .set({ completedAt: new Date(), updatedAt: new Date() })
      .where(eq(goals.id, id))
      .returning();
    
    return goal ? this.mapDbGoalToGoal(goal) : undefined;
  }

  async deleteGoal(id: string): Promise<Goal | undefined> {
    // First get the goal to return it before deletion
    const goalToDelete = await this.getGoalById(id);
    
    if (goalToDelete) {
      // Perform a hard delete - completely remove the goal from the database
      await db
        .delete(goals)
        .where(eq(goals.id, id));
    }
    
    return goalToDelete;
  }

  async getGoalsByEntryId(entryId: string): Promise<Goal[]> {
    const result = await db.select().from(goals).where(eq(goals.journalEntryId, entryId));
    return result.map(goal => this.mapDbGoalToGoal(goal));
  }
  
  /**
   * Helper method to map database goal object to Goal interface
   */
  private mapDbGoalToGoal(dbGoal: Record<string, unknown>): Goal {
    return {
      id: dbGoal.id as string,
      userId: dbGoal.userId as string,
      journalEntryId: dbGoal.journalEntryId as string | undefined,
      content: dbGoal.content as string,
      suggestedAt: new Date(dbGoal.suggestedAt as string),
      acceptedAt: dbGoal.acceptedAt ? new Date(dbGoal.acceptedAt as string) : undefined,
      completedAt: dbGoal.completedAt ? new Date(dbGoal.completedAt as string) : undefined,
      deletedAt: dbGoal.deletedAt ? new Date(dbGoal.deletedAt as string) : undefined,
      targetDate: dbGoal.targetDate ? new Date(dbGoal.targetDate as string) : undefined,
      relatedMetricType: (dbGoal.relatedMetricType as string | undefined) as MetricType | undefined,
      sourceType: dbGoal.sourceType as 'journal_entry' | 'daily_generation',
      createdAt: new Date(dbGoal.createdAt as string),
      updatedAt: new Date(dbGoal.updatedAt as string)
    };
  }
}
