# Source Tree Analysis

## Repository Structure Overview

```
journal-monorepo/
├── apps/                          # Application packages
│   ├── web/                       # Remix frontend (Part: web)
│   └── server/                    # Elysia backend (Part: server)
├── docs/                          # Generated documentation
├── _bmad/                         # BMAD framework (installed)
├── _bmad-output/                  # BMAD workflow outputs
├── .ai/                           # AI-related documentation
├── .claude/                       # Claude Code configuration
├── .codex/                        # Codex configuration
├── .opencode/                     # OpenCode configuration
├── .windsurf/                     # Windsurf configuration
├── node_modules/                  # Dependencies (shared)
├── scripts/                       # Development scripts
├── package.json                   # Root package manifest
├── pnpm-workspace.yaml            # Workspace configuration
├── turbo.json                     # Turborepo configuration
├── tsconfig.json                  # TypeScript base config
├── .eslintrc.json                 # ESLint configuration
└── README.md                      # Project readme
```

## Web Application (apps/web/)

```
apps/web/
├── app/                           # Remix app directory
│   ├── routes/                    # File-based routing
│   │   ├── _auth.login.tsx        # Login page
│   │   ├── _auth.logout.tsx       # Logout handler
│   │   ├── _auth.register.tsx     # Registration page
│   │   ├── _auth.tsx              # Auth layout wrapper
│   │   ├── _index.tsx             # Home/landing page
│   │   ├── journal.new.tsx        # Create new journal entry
│   │   ├── journal.edit.$id.tsx   # Edit existing entry
│   │   ├── chat.tsx               # AI chat interface
│   │   ├── goal-tracking.tsx      # Goal management page
│   │   ├── api.goals.new-count.ts # API route for goal count
│   │   ├── set-journal.ts         # Set active journal action
│   │   ├── set-theme.tsx          # Theme toggle action
│   │   ├── user-info.ts           # User info action
│   │   ├── dashboard.tsx          # Dashboard page (stub)
│   │   ├── action-items.tsx       # Action items (stub)
│   │   ├── habit-builder.tsx      # Habit builder (stub)
│   │   ├── learning-path.tsx      # Learning path (stub)
│   │   ├── milestones.tsx         # Milestones (stub)
│   │   ├── progress.tsx           # Progress view (stub)
│   │   └── success-stories.tsx    # Success stories (stub)
│   │
│   ├── components/                # Shared components
│   │   ├── ui/                    # Base UI component library
│   │   │   ├── alerts.tsx         # Alert/toast components
│   │   │   ├── avatar.tsx         # User avatar
│   │   │   ├── breadcrumb.tsx     # Navigation breadcrumbs
│   │   │   ├── button.tsx         # Button variants
│   │   │   ├── card.tsx           # Card container
│   │   │   ├── collapsible.tsx    # Collapsible sections
│   │   │   ├── dialog.tsx         # Modal dialogs
│   │   │   ├── dropdown-menu.tsx  # Dropdown menus
│   │   │   ├── form.tsx           # Form components
│   │   │   ├── input.tsx          # Text input
│   │   │   ├── label.tsx          # Form labels
│   │   │   ├── modal.tsx          # Modal wrapper
│   │   │   ├── separator.tsx      # Visual separator
│   │   │   ├── sheet.tsx          # Slide-out panel
│   │   │   ├── sidebar.tsx        # Navigation sidebar
│   │   │   ├── skeleton.tsx       # Loading skeleton
│   │   │   ├── slider.tsx         # Range slider
│   │   │   ├── table.tsx          # Data tables
│   │   │   ├── textarea.tsx       # Multiline input
│   │   │   ├── tooltip.tsx        # Hover tooltips
│   │   │   ├── GoalNotification.tsx    # Goal alerts
│   │   │   └── CustomTextEditor/  # Lexical rich text editor
│   │   │       ├── index.tsx
│   │   │       ├── plugins/
│   │   │       └── themes/
│   │   ├── Sidebar/               # Main navigation
│   │   │   ├── index.tsx
│   │   │   ├── SidebarNav.tsx
│   │   │   └── ...
│   │   ├── Article/               # Article display
│   │   ├── Breadcrumb/            # Breadcrumb nav
│   │   ├── ErrorBoundary.tsx      # Error boundary
│   │   ├── ThemeProvider.tsx      # Theme context
│   │   ├── GoalNotificationProvider.tsx
│   │   └── UserInfoForm.tsx       # User profile form
│   │
│   ├── services/                  # API & business logic
│   │   ├── api-client.server.ts   # Server-side API client
│   │   ├── session.server.ts      # Session management
│   │   ├── auth.service.ts        # Auth operations
│   │   ├── journal.service.ts     # Journal operations
│   │   ├── entry.service.ts       # Entry operations
│   │   ├── goalService.ts         # Client-side goals
│   │   ├── goalService.server.ts  # Server-side goals
│   │   ├── chat.service.ts        # Chat operations
│   │   ├── chat.client.ts         # Client-side chat
│   │   ├── user-info.service.ts   # User profile ops
│   │   └── websocket.client.ts    # WebSocket client
│   │
│   ├── features/                  # Feature modules
│   │   └── automatic-goals/       # Auto goal suggestions
│   │       └── README.md
│   │
│   ├── hooks/                     # Custom React hooks
│   │   └── ...
│   │
│   ├── utils/                     # Utility functions
│   │   └── errors.ts              # Error utilities
│   │
│   ├── types/                     # TypeScript definitions
│   │   ├── journal.ts
│   │   ├── goals.ts
│   │   └── ...
│   │
│   ├── layouts/                   # Page layouts
│   ├── lib/                       # Third-party wrappers
│   ├── config/                    # App configuration
│   ├── constants/                 # App constants
│   ├── styles/                    # Global styles
│   │
│   ├── root.tsx                   # App root component
│   ├── entry.client.tsx           # Client entry
│   ├── entry.server.tsx           # Server entry
│   └── tailwind.css               # Tailwind imports
│
├── public/                        # Static assets
├── build/                         # Build output
├── src/                           # Additional source (unused?)
├── tailwind.config.ts             # Tailwind configuration
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript config
├── postcss.config.js              # PostCSS config
├── components.json                # shadcn/ui config
├── fly.toml                       # Fly.io deployment
├── Dockerfile                     # Container build
├── package.json                   # Dependencies
├── GUIDELINES.md                  # Dev guidelines
└── README.md                      # App readme
```

## Server Application (apps/server/)

```
apps/server/
├── src/
│   ├── index.ts                   # Entry point (server bootstrap)
│   ├── app.ts                     # Elysia app setup
│   ├── env.d.ts                   # Environment type definitions
│   │
│   ├── controllers/               # HTTP route handlers
│   │   ├── index.controller.ts    # Root endpoint
│   │   ├── auth.controller.ts     # Auth endpoints
│   │   ├── journal.controller.ts  # Journal CRUD
│   │   ├── goal.controller.ts     # Goal endpoints
│   │   ├── ai.controller.ts       # AI chat endpoints
│   │   ├── metrics.controller.ts  # Metrics endpoints
│   │   ├── settings.controller.ts # Settings endpoints
│   │   ├── user-info.controller.ts# User profile
│   │   └── test.controller.ts     # Test endpoints
│   │
│   ├── services/                  # Business logic
│   │   ├── auth.service.ts        # Authentication
│   │   ├── journal.service.ts     # Journal operations
│   │   ├── goal.service.ts        # Goal logic
│   │   ├── goal-metrics.service.ts # Goal-related metrics
│   │   ├── goal-event-handler.service.ts
│   │   ├── metrics.service.ts     # Metrics tracking
│   │   ├── settings.service.ts    # User settings
│   │   ├── user-info.service.ts   # User profiles
│   │   ├── scheduled-jobs.service.ts # Cron jobs
│   │   ├── service-initializer.ts # Service startup
│   │   └── ai/                    # AI services
│   │       ├── chat.service.ts
│   │       ├── insights.service.ts
│   │       └── ...
│   │
│   ├── repositories/              # Data access layer
│   │   ├── user.repository.ts     # User data
│   │   ├── journal.repository.ts  # Journal data
│   │   ├── goal.repository.ts     # Goal data
│   │   ├── metrics.repository.ts  # Metrics data
│   │   ├── session.repository.ts  # Session data
│   │   ├── settings.repository.ts # Settings data
│   │   └── user-info.repository.ts# User info data
│   │
│   ├── db/                        # Database
│   │   ├── schema.ts              # Drizzle schema definitions
│   │   └── migrate.ts             # Migration runner
│   │
│   ├── middleware/                # Request middleware
│   │   └── auth.ts                # JWT authentication
│   │
│   ├── migrations/                # SQL migrations
│   │   └── *.sql
│   │
│   ├── types/                     # TypeScript definitions
│   │   ├── domain.ts
│   │   ├── api.ts
│   │   └── ...
│   │
│   ├── utils/                     # Utilities
│   │   ├── errors.ts              # Error classes
│   │   ├── logger.ts              # Logging
│   │   └── validators.ts          # Validation
│   │
│   ├── config/                    # Configuration
│   │   ├── database.ts
│   │   ├── ai.ts
│   │   └── ...
│   │
│   ├── events/                    # Event handlers
│   ├── plugins/                   # Elysia plugins
│   ├── prompts/                   # AI prompts
│   ├── scripts/                   # Utility scripts
│   └── test/                      # Test files
│
├── drizzle/                       # Drizzle output
├── migrations/                    # Migration files
├── logs/                          # Application logs
├── bruno/                         # Bruno API collection
├── dist/                          # Build output
├── drizzle.config.ts              # Drizzle configuration
├── eslint.config.js               # ESLint config
├── tsconfig.json                  # TypeScript config
├── wrangler.toml                  # Cloudflare Workers
├── Dockerfile                     # Container build
├── package.json                   # Dependencies
├── PRD.md                         # Product requirements
├── best-practices.md              # Dev practices
└── README.md                      # App readme
```

## Critical Directories

### Entry Points

| Part | Entry Point | Description |
|------|-------------|-------------|
| web | `app/root.tsx` | React app root, providers setup |
| web | `app/entry.server.tsx` | SSR entry, request handling |
| web | `app/entry.client.tsx` | Client hydration |
| server | `src/index.ts` | Server bootstrap, controller registration |

### Shared Code Patterns

- **Web**: `app/components/ui/*` - Reusable UI components
- **Web**: `app/services/*` - API client and domain services
- **Server**: `src/services/*` - Business logic layer
- **Server**: `src/repositories/*` - Data access layer

### Configuration Files

| File | Purpose |
|------|---------|
| `turbo.json` | Turborepo pipeline configuration |
| `pnpm-workspace.yaml` | Workspace package locations |
| Root `package.json` | Shared dependencies, scripts |
| `apps/web/tailwind.config.ts` | Design system tokens |
| `apps/server/drizzle.config.ts` | Database schema config |

---
*Generated by BMM Document Project Workflow - 2026-01-06*
