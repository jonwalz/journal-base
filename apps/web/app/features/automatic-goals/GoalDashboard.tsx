import { useState, useEffect } from 'react';
import { Goal, GoalStatus, MetricType } from '~/types/goals';
import GoalList from './GoalList';
import GoalFilters from './GoalFilters';
import GoalStats from './GoalStats';
import './goal-animations.css';

interface GoalDashboardProps {
  initialGoals?: Goal[];
  actionData?: {
    goal?: Goal;
    error?: string;
    success?: boolean;
  };
}

export default function GoalDashboard({ initialGoals = [], actionData }: GoalDashboardProps) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{
    status: GoalStatus | 'all';
    dateRange: 'today' | 'week' | 'month' | 'all';
    metricType: MetricType | 'all';
  }>({
    status: 'all',
    dateRange: 'all',
    metricType: 'all'
  });

  // Update goals when actionData changes (after a goal is accepted, completed, or deleted)
  useEffect(() => {
    if (actionData?.goal) {
      setGoals(prevGoals => 
        prevGoals.map(goal => goal.id === actionData.goal?.id ? actionData.goal : goal)
      );
    }
  }, [actionData]);

  // Apply client-side filtering when filters change
  useEffect(() => {
    setIsLoading(true);
    
    // Apply filters to initialGoals
    const filteredGoals = initialGoals.filter(goal => {
      // Filter by status
      if (filters.status !== 'all') {
        if (filters.status === 'suggested' && (goal.acceptedAt || goal.completedAt || goal.deletedAt)) {
          return false;
        }
        if (filters.status === 'accepted' && (!goal.acceptedAt || goal.completedAt || goal.deletedAt)) {
          return false;
        }
        if (filters.status === 'completed' && (!goal.completedAt || goal.deletedAt)) {
          return false;
        }
        if (filters.status === 'deleted' && !goal.deletedAt) {
          return false;
        }
      }
      
      // Filter by metric type
      if (filters.metricType !== 'all' && goal.relatedMetricType !== filters.metricType) {
        return false;
      }
      
      // Filter by date range
      if (filters.dateRange !== 'all') {
        const now = new Date();
        const goalDate = new Date(goal.suggestedAt);
        
        if (filters.dateRange === 'today') {
          return goalDate.toDateString() === now.toDateString();
        }
        
        if (filters.dateRange === 'week') {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return goalDate >= weekAgo;
        }
        
        if (filters.dateRange === 'month') {
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          return goalDate >= monthAgo;
        }
      }
      
      return true;
    });
    
    setGoals(filteredGoals);
    setIsLoading(false);
  }, [filters, initialGoals]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading text-black dark:text-white">Your Growth Goals</h2>
      </div>
      
      <GoalStats goals={goals} />
      
      <GoalFilters filters={filters} setFilters={setFilters} />
      
      {isLoading ? (
        <div className="flex justify-center py-8 rounded-base border-2 border-border dark:border-darkBorder bg-main-50 dark:bg-main-900/20 animate-pulse">
          <p className="text-black dark:text-white">Loading goals...</p>
        </div>
      ) : (
        <GoalList 
          goals={goals} 
        />
      )}
    </div>
  );
}
