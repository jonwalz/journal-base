# Data Models - Server

## Overview

The server uses **Drizzle ORM** with **PostgreSQL (Neon serverless)** for data persistence. Schema definitions are in `apps/server/src/db/schema.ts`.

## Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    users    │───────│   journals   │───────│   entries   │
└─────────────┘       └──────────────┘       └─────────────┘
       │                                            │
       │                                            │
       ▼                                            ▼
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│user_settings│       │   sessions   │       │    goals    │
└─────────────┘       └──────────────┘       └─────────────┘
       │
       │
       ▼
┌─────────────┐       ┌──────────────┐
│  user_info  │       │   metrics    │
└─────────────┘       └──────────────┘
```

## Table Definitions

### users

Core user account table.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique identifier |
| `email` | TEXT | UNIQUE, NOT NULL | User email address |
| `password_hash` | TEXT | NOT NULL | Bcrypt hashed password |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes**:
- `idx_users_email` on `email` (for login lookups)

```typescript
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

---

### journals

User journals (containers for entries).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique identifier |
| `user_id` | UUID | FK -> users.id, NOT NULL | Owner user |
| `title` | TEXT | NOT NULL | Journal title |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes**:
- `idx_journals_user_id` on `user_id`

```typescript
export const journals = pgTable("journals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

---

### entries

Individual journal entries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique identifier |
| `journal_id` | UUID | FK -> journals.id, NOT NULL | Parent journal |
| `content` | TEXT | NOT NULL | Entry content (rich text) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes**:
- `idx_entries_journal_id` on `journal_id`

```typescript
export const entries = pgTable("entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  journalId: uuid("journal_id").references(() => journals.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

---

### user_settings

User preferences and configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique identifier |
| `user_id` | UUID | FK -> users.id, NOT NULL | Owner user |
| `notification_preferences` | JSONB | NOT NULL, DEFAULT | Notification settings |
| `theme_preferences` | JSONB | NOT NULL, DEFAULT | UI theme settings |
| `privacy_settings` | JSONB | NOT NULL, DEFAULT | Privacy configuration |
| `ai_interaction_settings` | JSONB | NOT NULL, DEFAULT | AI feature toggles |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

**JSONB Structures**:

```typescript
// notification_preferences
{
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderFrequency: string; // 'daily' | 'weekly' | 'monthly'
}

// theme_preferences
{
  darkMode: boolean;
  fontSize: string; // 'small' | 'medium' | 'large'
  colorScheme: string;
}

// privacy_settings
{
  journalVisibility: string; // 'private' | 'shared'
  shareAnalytics: boolean;
}

// ai_interaction_settings
{
  enableAiInsights: boolean;
  enableSentimentAnalysis: boolean;
  enableGrowthSuggestions: boolean;
}
```

---

### metrics

Growth mindset metrics tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique identifier |
| `user_id` | UUID | FK -> users.id, NOT NULL | Owner user |
| `type` | TEXT | NOT NULL | Metric type |
| `value` | TEXT | NOT NULL | Metric value (1-10 scale) |
| `notes` | TEXT | | Optional notes |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Recording time |

**Metric Types**:
- `resilience` - Ability to bounce back from setbacks
- `effort` - Effort put into improvement
- `challenge` - Willingness to take on challenges
- `feedback` - Openness to feedback
- `learning` - Commitment to learning

```typescript
export const metrics = pgTable("metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(),
  value: text("value").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

### sessions

User authentication sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique identifier |
| `user_id` | UUID | FK -> users.id, NOT NULL | Session owner |
| `token` | TEXT | UNIQUE, NOT NULL | Session token |
| `expires_at` | TIMESTAMP | NOT NULL | Expiration time |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

```typescript
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  token: text("token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

---

### user_info

Extended user profile information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique identifier |
| `user_id` | UUID | FK -> users.id, UNIQUE, NOT NULL | Owner (1:1) |
| `first_name` | TEXT | NOT NULL | First name |
| `last_name` | TEXT | NOT NULL | Last name |
| `bio` | TEXT | | User biography |
| `timezone` | TEXT | NOT NULL, DEFAULT 'UTC' | User timezone |
| `growth_goals` | JSONB | DEFAULT | Personal goals |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

```typescript
export const userInfo = pgTable("user_info", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  bio: text("bio"),
  timezone: text("timezone").notNull().default("UTC"),
  growthGoals: jsonb("growth_goals").$type<{
    shortTerm: string[];
    longTerm: string[];
  }>().default({
    shortTerm: [],
    longTerm: []
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

---

### goals

AI-generated and user-created goals.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | Unique identifier |
| `user_id` | UUID | FK -> users.id, NOT NULL | Goal owner |
| `journal_entry_id` | UUID | FK -> entries.id | Source entry (if AI-generated) |
| `content` | TEXT | NOT NULL | Goal description |
| `suggested_at` | TIMESTAMP | DEFAULT NOW() | When suggested |
| `accepted_at` | TIMESTAMP | | When user accepted |
| `completed_at` | TIMESTAMP | | When completed |
| `deleted_at` | TIMESTAMP | | Soft delete timestamp |
| `target_date` | DATE | | Goal target date |
| `related_metric_type` | TEXT | | Associated metric type |
| `source_type` | TEXT | NOT NULL | Origin (ai_generated, user_created) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

**Goal Lifecycle**:
```
suggested_at ─► accepted_at ─► completed_at
                    │
                    └─► deleted_at (if rejected)
```

```typescript
export const goals = pgTable("goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  journalEntryId: uuid("journal_entry_id").references(() => entries.id),
  content: text("content").notNull(),
  suggestedAt: timestamp("suggested_at").defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at"),
  completedAt: timestamp("completed_at"),
  deletedAt: timestamp("deleted_at"),
  targetDate: date("target_date"),
  relatedMetricType: text("related_metric_type"),
  sourceType: text("source_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

---

## Database Operations

### Common Queries

```typescript
// Get user journals with entries count
const journals = await db
  .select({
    journal: journals,
    entryCount: sql<number>`count(${entries.id})`
  })
  .from(journals)
  .leftJoin(entries, eq(journals.id, entries.journalId))
  .where(eq(journals.userId, userId))
  .groupBy(journals.id);

// Get recent entries with goals
const recentEntries = await db
  .select()
  .from(entries)
  .leftJoin(goals, eq(entries.id, goals.journalEntryId))
  .where(eq(journals.userId, userId))
  .orderBy(desc(entries.createdAt))
  .limit(10);
```

### Migrations

Located in `apps/server/src/migrations/`:

```bash
# Generate migration
bun run db:generate

# Run migrations
bun run db:migrate

# Open Drizzle Studio
bun run db:studio
```

---
*Generated by BMM Document Project Workflow - 2026-01-06*
