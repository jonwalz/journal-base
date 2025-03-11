export type MetricType = 'resilience' | 'effort' | 'challenge' | 'feedback' | 'learning';
export type GoalSourceType = 'journal_entry' | 'daily_generation';
export type GoalStatus = 'suggested' | 'accepted' | 'completed' | 'deleted';

export interface Goal {
  id: string;
  userId: string;
  journalEntryId?: string;
  content: string;
  suggestedAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  deletedAt?: Date;
  targetDate?: Date;
  relatedMetricType?: MetricType;
  sourceType: GoalSourceType;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalAnalytics {
  totalGoals: number;
  acceptedGoals: number;
  completedGoals: number;
  completionRate: number;
  averageTimeToCompletion: number; // in days
  goalsByMetricType: Record<MetricType, number>;
  mostEffectiveGoalTypes: Array<{
    metricType: MetricType;
    completionRate: number;
  }>;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
