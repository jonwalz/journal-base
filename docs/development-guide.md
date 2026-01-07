# Development Guide

## Prerequisites

- **Node.js**: >= 20.0.0
- **pnpm**: 8.9.0+ (`npm install -g pnpm`)
- **Bun**: Latest (for server development)

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd journal-monorepo
pnpm install
```

### 2. Environment Setup

**Root level** (optional):
```bash
cp .env.example .env
```

**Web app** (`apps/web/.env`):
```env
API_URL=http://localhost:3030
```

**Server app** (`apps/server/.env`):
```env
# Database
DATABASE_URL=postgresql://user:pass@host/db

# Authentication
JWT_SECRET=your-secret-key

# AI Providers (at least one required)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=...

# Memory Store (optional)
ZEP_API_KEY=...

# Server
PORT=3030
```

### 3. Database Setup

```bash
# Navigate to server
cd apps/server

# Generate migrations (if schema changed)
bun run db:generate

# Run migrations
bun run db:migrate

# Open Drizzle Studio (optional)
bun run db:studio
```

### 4. Start Development

```bash
# From root - starts both apps
pnpm dev

# Or individually:
# Terminal 1 - Server
cd apps/server && bun run dev

# Terminal 2 - Web
cd apps/web && npm run dev
```

**URLs**:
- Web: http://localhost:3000 (Remix default)
- Server: http://localhost:3030
- Swagger: http://localhost:3030/swagger

---

## Development Workflow

### Making Changes

#### Web Application

1. **Routes**: Add files to `apps/web/app/routes/`
   - File naming determines URL path
   - Use `loader` for data fetching
   - Use `action` for mutations

2. **Components**: Add to `apps/web/app/components/`
   - UI primitives go in `ui/`
   - Feature components go in root or feature folders

3. **Services**: Add to `apps/web/app/services/`
   - `.server.ts` suffix for server-only code
   - `.client.ts` suffix for client-only code

#### Server Application

1. **New Endpoint**:
   ```typescript
   // 1. Create controller (src/controllers/feature.controller.ts)
   export const featureController = new Elysia({ prefix: "/feature" })
     .use(authMiddleware)
     .get("/", async ({ user }) => { /* ... */ });

   // 2. Register in index.ts
   app.use(featureController);
   ```

2. **New Service**:
   ```typescript
   // src/services/feature.service.ts
   export class FeatureService {
     constructor(private repo = new FeatureRepository()) {}

     async doSomething() { /* ... */ }
   }
   ```

3. **New Repository**:
   ```typescript
   // src/repositories/feature.repository.ts
   export class FeatureRepository {
     async find(id: string) {
       return db.select().from(features).where(eq(features.id, id));
     }
   }
   ```

4. **Schema Changes**:
   ```typescript
   // 1. Update src/db/schema.ts
   export const newTable = pgTable("new_table", {
     id: uuid("id").defaultRandom().primaryKey(),
     // ...
   });

   // 2. Generate and run migration
   bun run db:generate
   bun run db:migrate
   ```

---

## Code Style

### TypeScript

- Strict mode enabled
- Use explicit types for function parameters
- Use interfaces for object shapes
- Use type guards for runtime checks

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `JournalEntry.tsx` |
| Routes | kebab-case with dots | `journal.edit.$id.tsx` |
| Services | camelCase | `journalService.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types | camelCase | `journalTypes.ts` |

### Import Order

```typescript
// 1. External dependencies
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";

// 2. Internal absolute imports
import { Button } from "~/components/ui/button";
import { ApiClient } from "~/services/api-client.server";

// 3. Relative imports
import { formatEntry } from "./utils";
```

---

## Testing

### Web

```bash
cd apps/web

# Run tests
npm run test

# Watch mode
npm run test -- --watch

# Coverage
npm run test:coverage
```

### Server

```bash
cd apps/server

# Run tests
bun test

# Watch mode
bun test --watch
```

### Test Structure

```
apps/web/
├── app/
│   └── routes/
│       └── __tests__/
│           └── journal.new.test.tsx

apps/server/
└── src/
    └── test/
        ├── services/
        │   └── journal.service.test.ts
        └── integration/
            └── journal.test.ts
```

---

## Debugging

### Web Application

1. **Browser DevTools**: React DevTools extension
2. **Network**: Monitor API calls in Network tab
3. **Server-Side**: Use console.log in loaders/actions (outputs to terminal)

### Server Application

1. **Winston Logs**: Check `apps/server/logs/`
2. **Console**: Direct output in development
3. **Drizzle Studio**: Database inspection

### API Testing

Use the **Bruno** collection in `apps/server/bruno/`:
1. Open Bruno app
2. Import collection from `apps/server/bruno/`
3. Set environment variables
4. Run requests

---

## Common Tasks

### Add a New Page (Web)

1. Create route file:
   ```bash
   touch apps/web/app/routes/my-page.tsx
   ```

2. Implement:
   ```tsx
   import { json, type LoaderFunctionArgs } from "@remix-run/node";
   import { useLoaderData } from "@remix-run/react";

   export async function loader({ request }: LoaderFunctionArgs) {
     // Fetch data server-side
     return json({ data: "..." });
   }

   export default function MyPage() {
     const { data } = useLoaderData<typeof loader>();
     return <div>{data}</div>;
   }
   ```

### Add a New API Endpoint (Server)

1. Create controller or add to existing:
   ```typescript
   // In existing controller
   .post("/new-endpoint", async ({ body, user }) => {
     const service = new MyService();
     return await service.create(body);
   }, {
     body: t.Object({
       field: t.String()
     })
   })
   ```

### Add AI Feature

1. Create service in `apps/server/src/services/ai/`
2. Use LangChain for orchestration:
   ```typescript
   import { ChatAnthropic } from "@langchain/anthropic";

   const model = new ChatAnthropic({
     modelName: "claude-3-sonnet-20240229"
   });

   const response = await model.invoke([
     { role: "user", content: userMessage }
   ]);
   ```

---

## Build & Deployment

### Development Build

```bash
pnpm build
```

### Production

**Web (Fly.io)**:
```bash
cd apps/web
fly deploy
```

**Server (Cloudflare Workers)**:
```bash
cd apps/server
wrangler deploy
```

### Docker

Both apps include Dockerfiles for containerized deployment.

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `Cannot find module` | Run `pnpm install` |
| Database connection fails | Check `DATABASE_URL` in `.env` |
| Auth errors | Verify `JWT_SECRET` is set |
| AI not responding | Check API keys for AI providers |
| CORS errors | Ensure server CORS config allows web origin |

### Reset Development

```bash
# Clean install
rm -rf node_modules apps/*/node_modules
pnpm install

# Reset database
cd apps/server
bun run db:push  # Recreate schema
```

---
*Generated by BMM Document Project Workflow - 2026-01-06*
