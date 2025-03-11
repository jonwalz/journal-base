# Automatic Goals Feature - UI Implementation Guide

## 1. Overview

This document outlines the UI implementation for the Automatic Goals feature, which analyzes users' journal entries to generate personalized growth-oriented goals. The UI will allow users to view, accept, complete, and delete automatically generated goals.

## 2. UI Components

### 2.1 Goal Dashboard Component

Create a main dashboard component that will be integrated into the existing `/goal-tracking` route.

```typescript
// apps/web/app/features/automatic-goals/GoalDashboard.tsx
import { useState, useEffect } from 'react';
import { Goal, GoalStatus } from '~/types/goals';
import { fetchGoals } from '~/services/goalService';
import GoalList from './GoalList';
import GoalFilters from './GoalFilters';
import GoalStats from './GoalStats';

export default function GoalDashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    metricType: 'all'
  });

  useEffect(() => {
    const loadGoals = async () => {
      setIsLoading(true);
      try {
        const fetchedGoals = await fetchGoals(filters);
        setGoals(fetchedGoals);
      } catch (error) {
        console.error('Failed to load goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGoals();
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Growth Goals</h2>
      </div>
      
      <GoalStats goals={goals} />
      
      <GoalFilters filters={filters} setFilters={setFilters} />
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading goals...</p>
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
```

### 2.2 Goal List Component

Create a component to display the list of goals with actions for each goal.

```typescript
// apps/web/app/features/automatic-goals/GoalList.tsx
import { Goal } from '~/types/goals';
import GoalCard from './GoalCard';

interface GoalListProps {
  goals: Goal[];
  onGoalUpdate: (goal: Goal) => void;
}

export default function GoalList({ goals, onGoalUpdate }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No goals found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map(goal => (
        <GoalCard 
          key={goal.id} 
          goal={goal} 
          onUpdate={onGoalUpdate} 
        />
      ))}
    </div>
  );
}
```

### 2.3 Goal Card Component

Create a component for individual goal cards with actions.

```typescript
// apps/web/app/features/automatic-goals/GoalCard.tsx
import { Goal } from '~/types/goals';
import { acceptGoal, completeGoal, deleteGoal } from '~/services/goalService';
import { formatDate } from '~/utils/dateUtils';

interface GoalCardProps {
  goal: Goal;
  onUpdate: (goal: Goal) => void;
}

export default function GoalCard({ goal, onUpdate }: GoalCardProps) {
  const handleAccept = async () => {
    try {
      const updatedGoal = await acceptGoal(goal.id);
      onUpdate(updatedGoal);
    } catch (error) {
      console.error('Failed to accept goal:', error);
    }
  };

  const handleComplete = async () => {
    try {
      const updatedGoal = await completeGoal(goal.id);
      onUpdate(updatedGoal);
    } catch (error) {
      console.error('Failed to complete goal:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGoal(goal.id);
      // Instead of updating, we'll let the parent component handle removal
      onUpdate({ ...goal, deletedAt: new Date() });
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const getStatusBadge = () => {
    if (goal.deletedAt) return <span className="badge badge-error">Deleted</span>;
    if (goal.completedAt) return <span className="badge badge-success">Completed</span>;
    if (goal.acceptedAt) return <span className="badge badge-info">Accepted</span>;
    return <span className="badge badge-warning">Suggested</span>;
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            {getStatusBadge()}
            {goal.relatedMetricType && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {goal.relatedMetricType}
              </span>
            )}
          </div>
          <p className="text-lg font-medium">{goal.content}</p>
          
          <div className="mt-2 text-sm text-gray-500">
            <p>Suggested: {formatDate(goal.suggestedAt)}</p>
            {goal.targetDate && (
              <p>Target completion: {formatDate(goal.targetDate)}</p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {!goal.acceptedAt && !goal.completedAt && !goal.deletedAt && (
            <button 
              onClick={handleAccept}
              className="btn btn-sm btn-primary"
            >
              Accept
            </button>
          )}
          
          {goal.acceptedAt && !goal.completedAt && !goal.deletedAt && (
            <button 
              onClick={handleComplete}
              className="btn btn-sm btn-success"
            >
              Complete
            </button>
          )}
          
          {!goal.deletedAt && (
            <button 
              onClick={handleDelete}
              className="btn btn-sm btn-error"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 2.4 Goal Filters Component

Create a component for filtering goals.

```typescript
// apps/web/app/features/automatic-goals/GoalFilters.tsx
import { MetricType } from '~/types/goals';

interface GoalFiltersProps {
  filters: {
    status: string;
    dateRange: string;
    metricType: string;
  };
  setFilters: (filters: any) => void;
}

export default function GoalFilters({ filters, setFilters }: GoalFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="select select-bordered w-full"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="suggested">Suggested</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <select
            className="select select-bordered w-full"
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Growth Metric
          </label>
          <select
            className="select select-bordered w-full"
            value={filters.metricType}
            onChange={(e) => handleFilterChange('metricType', e.target.value)}
          >
            <option value="all">All Metrics</option>
            <option value="resilience">Resilience</option>
            <option value="effort">Effort</option>
            <option value="challenge">Challenge</option>
            <option value="feedback">Feedback</option>
            <option value="learning">Learning</option>
          </select>
        </div>
      </div>
    </div>
  );
}
```

### 2.5 Goal Stats Component

Create a component to display goal statistics.

```typescript
// apps/web/app/features/automatic-goals/GoalStats.tsx
import { Goal } from '~/types/goals';

interface GoalStatsProps {
  goals: Goal[];
}

export default function GoalStats({ goals }: GoalStatsProps) {
  const totalGoals = goals.length;
  const acceptedGoals = goals.filter(g => g.acceptedAt && !g.deletedAt).length;
  const completedGoals = goals.filter(g => g.completedAt).length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm text-gray-500">Total Goals</p>
        <p className="text-2xl font-bold">{totalGoals}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm text-gray-500">Accepted</p>
        <p className="text-2xl font-bold">{acceptedGoals}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm text-gray-500">Completed</p>
        <p className="text-2xl font-bold">{completedGoals}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm text-gray-500">Completion Rate</p>
        <p className="text-2xl font-bold">{completionRate}%</p>
      </div>
    </div>
  );
}
```

## 3. Type Definitions

Create the necessary type definitions for the goals feature:

```typescript
// apps/web/app/types/goals.ts
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
  status?: GoalStatus | 'all';
  dateRange?: 'today' | 'week' | 'month' | 'all';
  metricType?: MetricType | 'all';
}
```

## 4. API Service

Create a service to interact with the goals API:

```typescript
// apps/web/app/services/goalService.ts
import { Goal, GoalFilters } from '~/types/goals';

export async function fetchGoals(filters?: GoalFilters): Promise<Goal[]> {
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
  
  const response = await fetch(`/api/goals?${queryParams}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch goals');
  }
  
  return response.json();
}

export async function acceptGoal(goalId: string): Promise<Goal> {
  const response = await fetch(`/api/goals/${goalId}/accept`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to accept goal');
  }
  
  return response.json();
}

export async function completeGoal(goalId: string): Promise<Goal> {
  const response = await fetch(`/api/goals/${goalId}/complete`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to complete goal');
  }
  
  return response.json();
}

export async function deleteGoal(goalId: string): Promise<void> {
  const response = await fetch(`/api/goals/${goalId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete goal');
  }
}
```

## 5. Integration with Goal Tracking Page

Update the existing goal-tracking route to include the new automatic goals components:

```typescript
// apps/web/app/routes/goal-tracking.tsx
import { MainLayout } from "~/layouts/MainLayout";
import GoalDashboard from "~/features/automatic-goals/GoalDashboard";

export default function GoalTracking() {
  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Goal Tracking</h1>
        <p className="text-gray-600">
          Track your personalized growth goals generated from your journal entries.
        </p>
        
        <GoalDashboard />
      </div>
    </MainLayout>
  );
}
```

## 6. Notifications for New Goals

Implement a notification system to alert users when new goals are generated:

```typescript
// apps/web/app/components/ui/GoalNotification.tsx
import { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';

interface GoalNotificationProps {
  newGoalsCount: number;
}

export default function GoalNotification({ newGoalsCount }: GoalNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (newGoalsCount === 0 || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm border-l-4 border-blue-500 animate-slide-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">New Growth Goals Available</h3>
          <p className="text-sm text-gray-600 mt-1">
            {newGoalsCount} new goal{newGoalsCount > 1 ? 's' : ''} generated based on your journal entries.
          </p>
          <Link 
            to="/goal-tracking" 
            className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
          >
            View Goals
          </Link>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
```

## 7. Implementation Steps

1. Create the type definitions in `apps/web/app/types/goals.ts`
2. Implement the goal service in `apps/web/app/services/goalService.ts`
3. Create the UI components in the `apps/web/app/features/automatic-goals/` directory:
   - GoalDashboard.tsx
   - GoalList.tsx
   - GoalCard.tsx
   - GoalFilters.tsx
   - GoalStats.tsx
4. Update the existing goal-tracking route to integrate the new components
5. Implement the notification component for new goals
6. Add CSS animations and transitions for a polished user experience

## 8. Testing Strategy

1. **Unit Tests**: Create tests for individual components using Vitest or Jest
2. **Integration Tests**: Test the interaction between components and the API service
3. **E2E Tests**: Test the full user flow from receiving a notification to completing a goal

## 9. Accessibility Considerations

1. Ensure all interactive elements have proper ARIA attributes
2. Maintain sufficient color contrast for text and UI elements
3. Provide keyboard navigation support for all interactive elements
4. Include proper focus management for modals and notifications

## 10. Performance Considerations

1. Implement pagination for the goals list if the number of goals becomes large
2. Use React.memo for components that don't need frequent re-renders
3. Implement optimistic UI updates for goal actions (accept, complete, delete)
4. Use proper loading states and error handling
