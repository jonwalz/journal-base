# Automatic Goals Feature - PRD (Implementation Status)

## 1. Overview

### 1.1 Feature Purpose

The Automatic Goals feature analyzes users' journal entries to generate personalized growth-oriented goals. These goals create accountability in users' daily lives by encouraging them to act upon growth mindset principles identified in their journaling practice.

### 1.2 Technical Integration

This feature integrates with:
- Journal Management Service - to access and analyze journal entries
- Mindset Metrics Service - to incorporate metrics into goal generation and track goal completion as metrics
- AI Interaction Service - to leverage AI for intelligent goal generation based on journal content

### 1.3 Implementation Notes

1. Use TypeScript for all code implementation
2. Implement proper error handling with custom error classes
3. Use scheduled jobs for daily goal generation
4. Implement event-driven architecture for real-time goal generation after journal entries
5. Follow SOLID principles

## 2. Feature Requirements

### 2.1 Functional Requirements

1. **Goal Generation**
   - System should automatically generate personalized goals based on journal content
   - Goals should be generated in two scenarios:
     - Immediately after a user submits a new journal entry
     - Daily at midnight for all active users
   - Goals should be relevant to the user's growth mindset journey
   - Each goal should have a clear action item and timeframe

2. **Goal Management**
   - Users must be able to confirm/accept suggested goals
   - Users must be able to mark goals as completed
   - Users must be able to delete goals
   - System should track goal status (suggested, accepted, completed, deleted)

3. **Goal Analytics**
   - System should track goal completion rates
   - System should correlate goal completion with growth mindset metrics
   - System should provide insights on most effective goal types for each user

### 2.2 Non-Functional Requirements

1. **Performance**
   - Goal generation should complete within 3 seconds after journal entry submission
   - Daily batch goal generation should complete within 30 minutes for the entire user base

2. **Scalability**
   - System should handle goal generation for up to 100,000 daily active users

3. **Security**
   - Goals should only be accessible to the user they were generated for
   - Goal data should be encrypted at rest

## 3. System Design

### 3.1 Database Schema

**STATUS: NOT STARTED**

```sql
-- Goals table
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    journal_entry_id UUID REFERENCES entries(id) NULL,
    content TEXT NOT NULL,
    suggested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP WITH TIME ZONE NULL,
    completed_at TIMESTAMP WITH TIME ZONE NULL,
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    target_date DATE NULL,
    related_metric_type VARCHAR(50) NULL,
    source_type VARCHAR(20) NOT NULL,
    CONSTRAINT valid_source_type CHECK (
        source_type IN ('journal_entry', 'daily_generation')
    ),
    CONSTRAINT valid_related_metric CHECK (
        related_metric_type IS NULL OR
        related_metric_type IN ('resilience', 'effort', 'challenge', 'feedback', 'learning')
    )
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(user_id, accepted_at, completed_at, deleted_at);
```

### 3.2 Service Interface

**STATUS: NOT STARTED**

```typescript
interface IGoalService {
  // Generate goals based on a specific journal entry
  generateGoalsFromEntry(entryId: string): Promise<Goal[]>;
  
  // Generate daily goals for a user
  generateDailyGoals(userId: string): Promise<Goal[]>;
  
  // Get all goals for a user with optional filters
  getGoals(
    userId: string, 
    filters?: {
      status?: 'suggested' | 'accepted' | 'completed' | 'deleted';
      dateRange?: DateRange;
      metricType?: MetricType;
    }
  ): Promise<Goal[]>;
  
  // Accept a suggested goal
  acceptGoal(goalId: string): Promise<Goal>;
  
  // Mark a goal as completed
  completeGoal(goalId: string): Promise<Goal>;
  
  // Delete a goal
  deleteGoal(goalId: string): Promise<void>;
  
  // Get goal analytics for a user
  getGoalAnalytics(userId: string, timeRange?: DateRange): Promise<GoalAnalytics>;
}
```

### 3.3 Type Definitions

**STATUS: NOT STARTED**

```typescript
interface Goal {
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

interface GoalAnalytics {
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
```

## 4. Implementation Plan

### 4.1 Core Components

**STATUS: NOT STARTED**

1. **GoalService**
   - Implements the IGoalService interface
   - Handles goal generation, management, and analytics

2. **GoalRepository**
   - Handles database operations for goals
   - Implements CRUD operations and specialized queries

3. **GoalController**
   - Exposes REST API endpoints for goal management
   - Handles user interactions with goals

4. **GoalGenerator**
   - Contains the logic for generating goals from journal entries
   - Uses AI service to analyze journal content and suggest relevant goals

5. **ScheduledJobService**
   - Handles the daily midnight goal generation for all users

### 4.2 API Endpoints

**STATUS: NOT STARTED**

```typescript
// Goal management endpoints
app.post('/api/goals/generate', generateGoalsHandler);
app.get('/api/goals', getGoalsHandler);
app.patch('/api/goals/:id/accept', acceptGoalHandler);
app.patch('/api/goals/:id/complete', completeGoalHandler);
app.delete('/api/goals/:id', deleteGoalHandler);

// Goal analytics endpoints
app.get('/api/goals/analytics', getGoalAnalyticsHandler);
```

### 4.3 Integration with Existing Services

**STATUS: NOT STARTED**

1. **Journal Entry Service Integration**
   - Add event emission after journal entry creation
   - Subscribe to journal entry events in the GoalService

2. **Metrics Service Integration**
   - Record goal completions as metrics
   - Use metrics history to inform goal generation

3. **AI Service Integration**
   - Extend AI prompts to include goal generation capabilities
   - Ensure AI responses include actionable goal suggestions

## 5. Testing Strategy

### 5.1 Unit Tests

- Test goal generation logic
- Test goal management operations
- Test analytics calculations

### 5.2 Integration Tests

- Test journal entry event triggering goal generation
- Test scheduled job for daily goal generation
- Test goal completion affecting metrics

### 5.3 Performance Tests

- Test goal generation performance under load
- Test daily batch processing performance

## 6. Rollout Plan

### 6.1 Phase 1: Development

**STATUS: NOT STARTED**

- Implement database schema
- Develop core GoalService and repository
- Implement basic goal generation logic

### 6.2 Phase 2: Testing

**STATUS: NOT STARTED**

- Internal testing with sample journal entries
- Refine goal generation algorithms
- Performance testing and optimization

### 6.3 Phase 3: Beta Release

**STATUS: NOT STARTED**

- Release to limited user group
- Collect feedback on goal quality and relevance
- Iterate on goal generation algorithms

### 6.4 Phase 4: Full Release

**STATUS: NOT STARTED**

- Release to all users
- Monitor system performance
- Track goal completion metrics

## 7. Success Metrics

- Goal acceptance rate > 60%
- Goal completion rate > 40%
- User retention increase of 15% for users who complete goals
- Positive correlation between goal completion and growth mindset metrics
