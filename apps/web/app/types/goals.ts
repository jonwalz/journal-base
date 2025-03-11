export type MetricType = 'resilience' | 'effort' | 'challenge' | 'feedback' | 'learning';

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
  sourceType: 'journal_entry' | 'daily_generation';
}

export interface GoalFilters {
  userId?: string;
  status?: GoalStatus | 'all';
  dateRange?: 'today' | 'week' | 'month' | 'all';
  metricType?: MetricType | 'all';
}
