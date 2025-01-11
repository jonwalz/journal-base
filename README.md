# Journal Monorepo

This monorepo contains both the frontend and backend applications for the Journal project.

## Project Structure

```
apps/
  ├── web/          # Remix frontend application
  └── server/       # Elysia backend application
```

## Development

This project uses [Turborepo](https://turbo.build/repo) and pnpm workspaces.

### Prerequisites

- Node.js
- pnpm (`npm install -g pnpm`)

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start development servers:
```bash
pnpm dev
```

## Apps and Packages

- `web`: Remix application
- `server`: Elysia backend application

## Useful Commands

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications
- `pnpm lint` - Lint all applications
