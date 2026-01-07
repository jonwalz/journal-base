# Architecture - Web Application

## Overview

The web application is a Remix-based React application following modern full-stack patterns with server-side rendering, file-based routing, and a Neobrutalism design aesthetic.

## Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Remix 2.13.1 | Full-stack React framework with SSR |
| **UI Library** | React 18.2.0 | Component-based UI |
| **Build Tool** | Vite 5.1.0 | Fast development and bundling |
| **Language** | TypeScript 5.1.6 | Type-safe JavaScript |
| **Styling** | Tailwind CSS 3.4.14 | Utility-first CSS |
| **UI Components** | Radix UI | Accessible component primitives |
| **Rich Text** | Lexical 0.22.0 | Extensible text editor |
| **Testing** | Vitest | Unit and integration testing |

## Architecture Pattern

The application follows the **Remix Convention** architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Remix Application                     │
├─────────────────────────────────────────────────────────┤
│  Routes (File-based)                                     │
│  ├── Loaders (Server-side data fetching)                │
│  ├── Actions (Server-side mutations)                    │
│  └── Components (Client/Server rendering)               │
├─────────────────────────────────────────────────────────┤
│  Services Layer                                          │
│  ├── API Client (Server-side authenticated requests)    │
│  ├── Session Management (Cookie-based auth)             │
│  └── Domain Services (Business logic)                   │
├─────────────────────────────────────────────────────────┤
│  UI Layer                                                │
│  ├── Components (Reusable UI elements)                  │
│  ├── Features (Feature-specific components)             │
│  └── Layouts (Page structure)                           │
└─────────────────────────────────────────────────────────┘
```

## Directory Structure

```
apps/web/
├── app/
│   ├── routes/              # File-based routing
│   │   ├── _auth.login.tsx  # Auth routes (grouped)
│   │   ├── _auth.logout.tsx
│   │   ├── _auth.register.tsx
│   │   ├── _index.tsx       # Home page
│   │   ├── journal.new.tsx  # Create journal entry
│   │   ├── journal.edit.$id.tsx  # Edit entry
│   │   ├── chat.tsx         # AI chat interface
│   │   ├── goal-tracking.tsx # Goal management
│   │   └── ...
│   ├── components/          # Shared components
│   │   ├── ui/              # Base UI components
│   │   ├── Sidebar/         # Navigation sidebar
│   │   ├── Article/         # Article display
│   │   └── ...
│   ├── services/            # Business logic & API
│   │   ├── api-client.server.ts  # Authenticated API calls
│   │   ├── session.server.ts     # Session management
│   │   ├── journal.service.ts    # Journal operations
│   │   ├── goalService.ts        # Goal operations
│   │   └── ...
│   ├── features/            # Feature modules
│   │   └── automatic-goals/ # Goal suggestion feature
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript definitions
│   ├── styles/              # Global styles
│   ├── root.tsx             # App root component
│   └── entry.*.tsx          # Entry points
├── public/                  # Static assets
├── build/                   # Build output
├── tailwind.config.ts       # Tailwind configuration
├── vite.config.ts           # Vite configuration
└── package.json
```

## Key Components

### Routes

| Route | Purpose | Key Features |
|-------|---------|--------------|
| `_auth.*` | Authentication | Login, register, logout |
| `_index` | Home/Landing | Entry point |
| `journal.new` | Create Entry | Lexical editor, AI prompts |
| `journal.edit.$id` | Edit Entry | Update existing entries |
| `chat` | AI Chat | Real-time AI conversation |
| `goal-tracking` | Goals | View/manage goals |

### Services

| Service | File | Purpose |
|---------|------|---------|
| **ApiClient** | `api-client.server.ts` | Centralized API communication |
| **Session** | `session.server.ts` | Cookie-based session management |
| **Journal** | `journal.service.ts` | Journal CRUD operations |
| **Goals** | `goalService.ts` | Goal management |
| **Chat** | `chat.service.ts` | AI chat operations |
| **WebSocket** | `websocket.client.ts` | Real-time communication |

### UI Components

The component library uses a **Neobrutalism** design system:

| Component | Description |
|-----------|-------------|
| `button` | Primary action buttons with bold shadows |
| `card` | Content containers |
| `dialog` | Modal dialogs (Radix) |
| `dropdown-menu` | Context menus (Radix) |
| `sidebar` | Navigation sidebar |
| `sheet` | Slide-out panels |
| `CustomTextEditor` | Lexical-based rich text |
| `GoalNotification` | Goal alert toasts |

## Design System

### Color Palette (Neobrutalism)

```typescript
colors: {
  main: {
    DEFAULT: "#b3cb9a",  // Primary green
    // ... shades 50-900
  },
  bg: "#dfe5f2",         // Background
  background: "#ecefd6", // Alt background
  text: "#000",          // Primary text
  border: "#000",        // Bold borders
  darkBg: "#1C1C1C",     // Dark mode bg
  darkText: "#eeefe9",   // Dark mode text
}
```

### Design Tokens

- **Border Radius**: `5px` (sharp, minimal)
- **Box Shadow**: `4px 4px 0px 0px #000` (offset shadows)
- **Font Weight**: Base `500`, Heading `700`

## Data Flow

### Server-Side Rendering Flow

```
1. Browser Request
       │
       ▼
2. Remix Route Loader
       │
       ├── getSession() - Get auth tokens
       │
       ├── ApiClient.getProtected() - Fetch data
       │
       ▼
3. Server renders component with data
       │
       ▼
4. HTML + hydration sent to browser
       │
       ▼
5. Client hydrates, attaches event handlers
```

### Mutation Flow (Actions)

```
1. Form Submit / Action Call
       │
       ▼
2. Remix Action Handler
       │
       ├── Validate input
       │
       ├── ApiClient.postProtected() - Send mutation
       │
       ▼
3. Redirect or return data
       │
       ▼
4. Loaders re-run, UI updates
```

## Authentication

Authentication uses cookie-based sessions with JWT tokens:

```typescript
// Session structure
interface Session {
  authToken: string;    // JWT access token
  sessionToken: string; // Server session ID
}

// Protected API calls automatically include tokens
ApiClient.getProtected('/journals', request);
```

## State Management

- **Server State**: Managed by Remix loaders (automatic caching/revalidation)
- **Client State**: React useState/useReducer for local UI state
- **Theme State**: ThemeProvider context for dark/light mode
- **Notifications**: GoalNotificationProvider for goal alerts

## Testing Strategy

```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage
```

- **Unit Tests**: Vitest for utility functions
- **Component Tests**: @testing-library/react
- **Integration**: Route-level testing

## Build & Deployment

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

**Deployment Target**: Fly.io (see `fly.toml`, `Dockerfile`)

---
*Generated by BMM Document Project Workflow - 2026-01-06*
