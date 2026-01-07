# Journal Monorepo - Project Overview

## Executive Summary

**Journal Up** is a growth mindset journaling application that combines reflective writing with AI-powered coaching and insights. The application helps users develop positive mindsets through structured journaling, sentiment analysis, and personalized recommendations.

## Project Information

| Property | Value |
|----------|-------|
| **Project Name** | journal-monorepo |
| **Repository Type** | Monorepo (pnpm workspaces + Turborepo) |
| **Primary Language** | TypeScript |
| **Architecture** | Full-stack web application |
| **Parts** | 2 (web frontend + server backend) |

## Project Purpose

Journal Up provides:
- **Smart Journaling**: AI-powered prompts encouraging reflection and growth
- **Growth Mindset Coaching**: Techniques to develop positive mindset patterns
- **Personalized Insights**: AI analysis identifying patterns in journal entries
- **Goal Tracking**: Automatic goal suggestions based on journal content
- **Progress Metrics**: Track growth across resilience, effort, challenge, feedback, and learning

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Users                                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   Web Application                            │
│                   (Remix + React)                           │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐   │
│  │ Routes  │  │Components│  │  Services  │  │  Hooks   │   │
│  └────┬────┘  └────┬─────┘  └─────┬──────┘  └────┬─────┘   │
│       │            │              │               │          │
│       └────────────┴──────────────┴───────────────┘          │
│                          │                                   │
│                   API Client Layer                           │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API / WebSocket
┌──────────────────────────▼──────────────────────────────────┐
│                   Server Application                         │
│                   (Elysia + Bun)                            │
│  ┌────────────┐  ┌──────────┐  ┌─────────────┐             │
│  │Controllers │  │ Services │  │Repositories │             │
│  └─────┬──────┘  └────┬─────┘  └──────┬──────┘             │
│        │              │                │                     │
│        └──────────────┴────────────────┘                     │
│                       │                                      │
│  ┌────────────────────┼────────────────────┐                │
│  │                    │                    │                │
│  ▼                    ▼                    ▼                │
│ PostgreSQL         Zep.ai            AI Providers           │
│ (Neon)          (Memory Store)    (Claude/GPT/Gemini)      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack Summary

### Web (apps/web)
| Category | Technology | Version |
|----------|------------|---------|
| Framework | Remix | 2.13.1 |
| UI Library | React | 18.2.0 |
| Build Tool | Vite | 5.1.0 |
| Language | TypeScript | 5.1.6 |
| Styling | Tailwind CSS | 3.4.14 |
| UI Components | Radix UI | Multiple |
| Rich Text Editor | Lexical | 0.22.0 |
| Testing | Vitest | - |

### Server (apps/server)
| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Bun | Latest |
| Framework | Elysia | 1.1.26 |
| Language | TypeScript | 5.0.0 |
| Database | PostgreSQL (Neon) | Serverless |
| ORM | Drizzle | 0.36.2 |
| Auth | JWT (jose) | 5.9.6 |
| AI | LangChain | 0.3.x |
| Memory Store | Zep.ai | 2.1.1 |
| Logging | Winston | 3.17.0 |

## Repository Structure

```
journal-monorepo/
├── apps/
│   ├── web/          # Remix frontend application
│   └── server/       # Elysia backend application
├── docs/             # Generated documentation (you are here)
├── _bmad/            # BMAD framework configuration
├── _bmad-output/     # BMAD workflow outputs
├── package.json      # Root package configuration
├── pnpm-workspace.yaml
└── turbo.json        # Turborepo configuration
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development (both apps)
pnpm dev

# Build all applications
pnpm build
```

## Documentation Index

- [Architecture - Web](./architecture-web.md)
- [Architecture - Server](./architecture-server.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [API Contracts](./api-contracts-server.md)
- [Data Models](./data-models-server.md)
- [Component Inventory](./component-inventory-web.md)
- [Development Guide](./development-guide.md)
- [Integration Architecture](./integration-architecture.md)

## Existing Documentation

| Document | Location | Description |
|----------|----------|-------------|
| Root README | `/README.md` | Project overview |
| Server README | `/apps/server/README.md` | Server setup guide |
| Server PRD | `/apps/server/PRD.md` | Comprehensive product requirements |
| Web README | `/apps/web/README.md` | Web app overview |
| Web Guidelines | `/apps/web/GUIDELINES.md` | Development guidelines |
| Security Audit | `/.ai/SECURITY_AUDIT_2025-04-15.md` | Security assessment |
| Security Practices | `/.ai/SECURITY_PRACTICES.md` | Security guidelines |

---
*Generated by BMM Document Project Workflow - 2026-01-06*
