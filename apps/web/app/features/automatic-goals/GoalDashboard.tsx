import { useState, useEffect } from 'react';
import { Goal, GoalStatus, MetricType } from '~/types/goals';
import { GoalService } from '~/services/goalService.client';
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

  useEffect(() => {
    // If we have initialGoals and no filters are applied, skip the initial fetch
    if (initialGoals.length > 0 && 
        filters.status === 'all' && 
        filters.dateRange === 'all' && 
        filters.metricType === 'all') {
      setIsLoading(false);
      return;
    }
    
    const loadGoals = async () => {
      setIsLoading(true);
      try {
        const fetchedGoals = await GoalService.getGoals(filters);
        setGoals(fetchedGoals);
      } catch (error) {
        console.error('Failed to load goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGoals();
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
          onGoalUpdate={(updatedGoal) => {
            setGoals(goals.map(goal => 
              goal.id === updatedGoal.id ? updatedGoal : goal
            ));
          }}
        />
      )}
    </div>
  );
}
