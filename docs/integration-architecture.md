# Integration Architecture

## Overview

This document describes how the web and server applications communicate, along with external service integrations.

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        External Services                          │
├─────────────┬─────────────┬─────────────┬───────────────────────┤
│  Anthropic  │   OpenAI    │   Google    │       Zep.ai          │
│   Claude    │    GPT      │   Gemini    │   (Memory Store)      │
└──────┬──────┴──────┬──────┴──────┬──────┴───────────┬───────────┘
       │             │             │                   │
       └─────────────┴─────────────┴───────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Server (Elysia)  │
                    │   localhost:3030  │
                    └─────────┬─────────┘
                              │
                     REST API │ WebSocket
                              │
                    ┌─────────▼─────────┐
                    │   Web (Remix)     │
                    │   localhost:3000  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │      Browser      │
                    └───────────────────┘
```

## Web ↔ Server Communication

### REST API

The web application communicates with the server via REST API calls using the `ApiClient` class.

#### Request Flow

```
Browser Request
       │
       ▼
┌──────────────────┐
│  Remix Route     │
│  (loader/action) │
└────────┬─────────┘
         │ Server-side
         ▼
┌──────────────────┐
│   ApiClient      │
│  (server.ts)     │
└────────┬─────────┘
         │
         │ HTTP(S)
         ▼
┌──────────────────┐
│  Server API      │
│  (Elysia)        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   PostgreSQL     │
└──────────────────┘
```

#### Authentication Flow

```typescript
// 1. Login (Web → Server)
POST /auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// 2. Server returns tokens
{
  "token": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "sessionToken": "session_id"
}

// 3. Web stores in cookie session
await session.set("authToken", token);
await session.set("sessionToken", sessionToken);

// 4. Subsequent requests include tokens
Authorization: Bearer <authToken>
x-session-token: <sessionToken>
```

#### ApiClient Methods

```typescript
// Unprotected requests
ApiClient.get<T>(endpoint)
ApiClient.post<T>(endpoint, data)

// Protected requests (auto-adds auth headers)
ApiClient.getProtected<T>(endpoint, request)
ApiClient.postProtected<T>(endpoint, request, data)
ApiClient.putProtected<T>(endpoint, request, data)
ApiClient.deleteProtected<T>(endpoint, request)
```

### WebSocket

Real-time communication for AI chat features:

```typescript
// Client connection
const ws = new WebSocket('ws://localhost:3030/ws');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: authToken
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // Handle streaming AI responses
};
```

---

## External Integrations

### AI Providers

The server supports multiple AI providers via LangChain:

#### Anthropic Claude

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  modelName: "claude-3-sonnet-20240229",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY
});
```

**Used for**:
- Journal entry analysis
- Growth mindset insights
- Goal generation
- Chat conversations

#### OpenAI GPT

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  modelName: "gpt-4",
  openAIApiKey: process.env.OPENAI_API_KEY
});
```

**Used for**:
- Alternative AI provider
- Specific tasks if configured

#### Google Gemini

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro",
  apiKey: process.env.GOOGLE_AI_API_KEY
});
```

**Used for**:
- Alternative AI provider
- Cost optimization

### Zep.ai Memory Store

Long-term memory for contextual AI interactions:

```typescript
import { ZepClient } from "@getzep/zep-cloud";

const zep = new ZepClient({
  apiKey: process.env.ZEP_API_KEY
});

// Store memory
await zep.memory.add(sessionId, {
  messages: [
    { role: "user", content: journalEntry.content },
    { role: "assistant", content: aiInsight }
  ],
  metadata: {
    entryId: journalEntry.id,
    timestamp: new Date()
  }
});

// Retrieve context
const memory = await zep.memory.get(sessionId, { lastn: 10 });
```

**Use Cases**:
- Store journal entries for context
- Maintain conversation history
- Provide personalized insights based on history

### Database (Neon PostgreSQL)

Serverless PostgreSQL via Neon:

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);
```

**Connection Pooling**: Handled by Neon serverless driver
**Transactions**: Supported via Drizzle

---

## Data Flow Diagrams

### Journal Entry Creation

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌──────────┐
│ Browser │────▶│  Remix  │────▶│ Server  │────▶│ Database │
│         │     │ Action  │     │ API     │     │          │
└─────────┘     └─────────┘     └────┬────┘     └──────────┘
                                     │
                                     ▼ (async)
                               ┌───────────┐
                               │ AI Service│
                               │ (LangChain)│
                               └─────┬─────┘
                                     │
                     ┌───────────────┼───────────────┐
                     ▼               ▼               ▼
               ┌──────────┐   ┌──────────┐   ┌──────────┐
               │ Anthropic│   │  Zep.ai  │   │ Database │
               │  Claude  │   │ (Memory) │   │ (Goals)  │
               └──────────┘   └──────────┘   └──────────┘
```

### AI Chat Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Browser │────▶│  Web    │────▶│ Server  │
│         │     │ Client  │     │ WS/API  │
└────▲────┘     └─────────┘     └────┬────┘
     │                               │
     │                               ▼
     │                         ┌──────────┐
     │                         │ AI Svc   │
     │                         └────┬─────┘
     │                              │
     │         ┌────────────────────┼────────────────────┐
     │         ▼                    ▼                    ▼
     │   ┌──────────┐         ┌──────────┐        ┌──────────┐
     │   │ Zep.ai   │         │ Anthropic│        │ Database │
     │   │ (Context)│         │ (Generate)│       │ (Store)  │
     │   └──────────┘         └────┬─────┘        └──────────┘
     │                              │
     │◀─────────────────────────────┘
     │         Streamed Response
```

---

## Error Handling

### Web → Server Errors

```typescript
// ApiClient handles errors consistently
try {
  const response = await ApiClient.getProtected('/journals', request);
  return json(response.data);
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Redirect to login
    return redirect('/auth/login');
  }
  if (error instanceof ApiError) {
    // Return error to UI
    return json({ error: error.message }, { status: error.status });
  }
  throw error;
}
```

### Server → External Service Errors

```typescript
// AI service errors
try {
  const response = await model.invoke(messages);
  return response;
} catch (error) {
  logger.error('AI service error', { error });
  // Fallback or retry logic
  throw new AppError(503, 'AI service unavailable', 'AI_ERROR');
}
```

---

## Configuration

### Environment Variables Summary

| Variable | Used By | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | Server | PostgreSQL connection |
| `JWT_SECRET` | Server | Token signing |
| `ANTHROPIC_API_KEY` | Server | Claude AI |
| `OPENAI_API_KEY` | Server | GPT AI |
| `GOOGLE_AI_API_KEY` | Server | Gemini AI |
| `ZEP_API_KEY` | Server | Memory store |
| `API_URL` | Web | Server API base URL |
| `PORT` | Server | Server port (default: 3030) |

### CORS Configuration

```typescript
// Server CORS setup
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
```

---

## Security Considerations

1. **Token Storage**: JWTs stored in HTTP-only cookies via Remix session
2. **API Auth**: All protected endpoints verify JWT + session token
3. **Rate Limiting**: Applied per endpoint (see PRD for limits)
4. **Input Validation**: Elysia type validation on all endpoints
5. **AI Safety**: Content moderation on AI inputs/outputs
6. **Database**: Connection string contains credentials - never commit

---
*Generated by BMM Document Project Workflow - 2026-01-06*
