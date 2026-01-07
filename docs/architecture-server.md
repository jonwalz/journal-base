# Architecture - Server Application

## Overview

The server application is a REST API built with Elysia on the Bun runtime, providing journal management, AI-powered insights, and growth mindset coaching features.

## Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Runtime** | Bun | Fast JavaScript/TypeScript runtime |
| **Framework** | Elysia 1.1.26 | Type-safe web framework |
| **Language** | TypeScript 5.0 | Type-safe JavaScript |
| **Database** | PostgreSQL (Neon) | Serverless relational database |
| **ORM** | Drizzle 0.36.2 | Type-safe SQL ORM |
| **Auth** | JWT (jose) | Token-based authentication |
| **AI** | LangChain | AI orchestration |
| **Memory** | Zep.ai | Long-term AI memory |
| **Logging** | Winston | Structured logging |

## Architecture Pattern

The application follows a **Layered Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Controllers                           │
│  (HTTP handlers, request validation, response mapping)  │
├─────────────────────────────────────────────────────────┤
│                    Middleware                            │
│  (Authentication, error handling, logging)              │
├─────────────────────────────────────────────────────────┤
│                     Services                             │
│  (Business logic, AI integration, orchestration)        │
├─────────────────────────────────────────────────────────┤
│                   Repositories                           │
│  (Data access, database operations)                     │
├─────────────────────────────────────────────────────────┤
│                    Database                              │
│  (PostgreSQL via Drizzle ORM)                           │
└─────────────────────────────────────────────────────────┘
```

## Directory Structure

```
apps/server/
├── src/
│   ├── index.ts              # Application entry point
│   ├── app.ts                # Elysia app configuration
│   ├── controllers/          # HTTP route handlers
│   │   ├── auth.controller.ts
│   │   ├── journal.controller.ts
│   │   ├── goal.controller.ts
│   │   ├── ai.controller.ts
│   │   ├── metrics.controller.ts
│   │   ├── settings.controller.ts
│   │   └── user-info.controller.ts
│   ├── services/             # Business logic
│   │   ├── auth.service.ts
│   │   ├── journal.service.ts
│   │   ├── goal.service.ts
│   │   ├── metrics.service.ts
│   │   ├── settings.service.ts
│   │   ├── user-info.service.ts
│   │   ├── scheduled-jobs.service.ts
│   │   └── ai/               # AI-specific services
│   ├── repositories/         # Data access layer
│   │   ├── journal.repository.ts
│   │   ├── goal.repository.ts
│   │   ├── user.repository.ts
│   │   ├── metrics.repository.ts
│   │   ├── session.repository.ts
│   │   └── settings.repository.ts
│   ├── db/                   # Database configuration
│   │   └── schema.ts         # Drizzle schema definitions
│   ├── middleware/           # Express-style middleware
│   │   └── auth.ts           # JWT authentication
│   ├── migrations/           # Database migrations
│   ├── types/                # TypeScript definitions
│   ├── utils/                # Utility functions
│   ├── config/               # Configuration
│   ├── events/               # Event handlers
│   └── prompts/              # AI prompt templates
├── drizzle/                  # Drizzle configuration
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

## API Design

### Controllers

| Controller | Prefix | Purpose |
|------------|--------|---------|
| `authController` | `/auth` | User authentication |
| `journalController` | `/journals` | Journal & entry management |
| `goalController` | `/goals` | Goal tracking |
| `aiController` | `/ai` | AI chat & insights |
| `metricsController` | `/metrics` | Growth metrics |
| `settingsController` | `/settings` | User preferences |
| `userInfoController` | `/user-info` | User profile |

### Request Flow

```
HTTP Request
     │
     ▼
┌────────────────┐
│   Controller   │ ◄── Validates request, extracts params
└───────┬────────┘
        │
        ▼
┌────────────────┐
│   Middleware   │ ◄── Auth verification (JWT)
└───────┬────────┘
        │
        ▼
┌────────────────┐
│    Service     │ ◄── Business logic, orchestration
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  Repository    │ ◄── Database operations
└───────┬────────┘
        │
        ▼
┌────────────────┐
│   Database     │
└────────────────┘
```

## Services Layer

### Core Services

| Service | Responsibility |
|---------|----------------|
| **AuthService** | User signup, login, token management |
| **JournalService** | Create/read/update/delete journals and entries |
| **GoalService** | Goal generation, tracking, completion |
| **MetricsService** | Growth mindset metrics tracking and analysis |
| **SettingsService** | User preferences management |
| **UserInfoService** | User profile data |
| **ScheduledJobsService** | Cron-based background tasks |

### AI Services (`src/services/ai/`)

Dedicated AI integration layer handling:
- LangChain orchestration
- Multiple AI provider support (Anthropic, OpenAI, Google)
- Zep.ai memory integration
- Prompt management
- Response streaming

## Data Layer

### Repositories

Each repository handles database operations for a specific domain:

```typescript
// Example: JournalRepository
class JournalRepository {
  async create(userId: string, title: string): Promise<Journal>;
  async findByUserId(userId: string): Promise<Journal[]>;
  async createEntry(journalId: string, content: string): Promise<Entry>;
  async findEntries(journalId: string): Promise<Entry[]>;
  // ...
}
```

### Database Connection

Uses Drizzle ORM with Neon serverless PostgreSQL:

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);
```

## Authentication & Security

### JWT Authentication

```typescript
// Middleware attaches user to context
const authMiddleware = new Elysia()
  .derive(async ({ headers }) => {
    const token = headers.authorization?.split(' ')[1];
    const payload = await verifyToken(token);
    return { user: payload };
  });
```

### Security Features

- **JWT Tokens**: Access (1h) + Refresh (7d) tokens
- **Password Hashing**: Secure password storage
- **Session Management**: Server-side session tracking
- **Rate Limiting**: Request throttling per endpoint
- **CORS**: Configured origin restrictions
- **Input Validation**: Elysia's built-in type validation

## Error Handling

Custom error classes for consistent error responses:

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string
  ) { super(message); }
}

// Specific error types
class ValidationError extends AppError { ... }
class AuthenticationError extends AppError { ... }
class NotFoundError extends AppError { ... }
```

Global error handler in `index.ts`:

```typescript
app.onError(({ error, set }) => {
  if (error.name === 'ValidationError') {
    set.status = 400;
    return { error: error.message };
  }
  // ... handle other error types
});
```

## AI Integration

### LangChain Setup

Multiple AI providers configured:
- **Anthropic Claude**: Primary AI for insights
- **OpenAI GPT**: Alternative provider
- **Google Gemini**: Additional provider

### Zep.ai Memory

Long-term memory storage for contextual AI responses:

```typescript
// Store journal context
await zepClient.addMemory({
  userId: entry.userId,
  content: entry.content,
  metadata: {
    timestamp: entry.createdAt,
    sentiment: analysis.sentiment,
    growthIndicators: analysis.growthIndicators
  }
});
```

## Background Jobs

Scheduled tasks via `cron` package:

```typescript
// ScheduledJobsService
const jobs = [
  {
    name: 'daily-insights',
    schedule: '0 8 * * *',  // 8 AM daily
    handler: generateDailyInsights
  },
  // ...
];
```

## Testing

```bash
# Run tests
bun test

# Watch mode
bun test --watch
```

Test structure in `src/test/`:
- Unit tests for services
- Integration tests for API endpoints

## Build & Deployment

```bash
# Development
bun run dev

# Production build
bun run build

# Start production
bun run start
```

**Deployment Targets**:
- Cloudflare Workers (via Wrangler - see `wrangler.toml`)
- Docker container (see `Dockerfile`)

## Configuration

Environment variables (`.env`):

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
GOOGLE_AI_API_KEY=...
ZEP_API_KEY=...
PORT=3030
```

---
*Generated by BMM Document Project Workflow - 2026-01-06*
