# Component Inventory - Web Application

## Overview

The web application uses a custom component library built on **Radix UI** primitives with a **Neobrutalism** design aesthetic. Components follow the shadcn/ui pattern of composable, copy-paste components.

## Component Categories

### Base UI Components (`app/components/ui/`)

#### Inputs & Forms

| Component | File | Dependencies | Description |
|-----------|------|--------------|-------------|
| **Input** | `input.tsx` | - | Text input field with neobrutalist styling |
| **Textarea** | `textarea.tsx` | - | Multiline text input |
| **Label** | `label.tsx` | @radix-ui/react-label | Form labels |
| **Form** | `form.tsx` | - | Form wrapper with validation |
| **Slider** | `slider.tsx` | @radix-ui/react-slider | Range slider for metrics |

#### Buttons & Actions

| Component | File | Dependencies | Description |
|-----------|------|--------------|-------------|
| **Button** | `button.tsx` | @radix-ui/react-slot, CVA | Primary action button with variants |

**Button Variants**:
```typescript
variants: {
  variant: {
    default: "bg-main text-text shadow-light...",
    destructive: "...",
    outline: "...",
    secondary: "...",
    ghost: "...",
    link: "...",
    noShadow: "...",
    neutral: "...",
    reverse: "...",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  }
}
```

#### Overlays & Modals

| Component | File | Dependencies | Description |
|-----------|------|--------------|-------------|
| **Dialog** | `dialog.tsx` | @radix-ui/react-dialog | Modal dialogs |
| **Modal** | `modal.tsx` | dialog.tsx | Simplified modal wrapper |
| **Sheet** | `sheet.tsx` | @radix-ui/react-dialog | Slide-out side panels |
| **Tooltip** | `tooltip.tsx` | @radix-ui/react-tooltip | Hover tooltips |
| **Dropdown Menu** | `dropdown-menu.tsx` | @radix-ui/react-dropdown-menu | Context menus |
| **Alerts** | `alerts.tsx` | sonner | Toast notifications |

#### Layout & Containers

| Component | File | Dependencies | Description |
|-----------|------|--------------|-------------|
| **Card** | `card.tsx` | - | Content card with neobrutalist shadow |
| **Separator** | `separator.tsx` | @radix-ui/react-separator | Visual divider |
| **Collapsible** | `collapsible.tsx` | @radix-ui/react-collapsible | Expandable sections |
| **Table** | `table.tsx` | - | Data table components |

#### Navigation

| Component | File | Dependencies | Description |
|-----------|------|--------------|-------------|
| **Sidebar** | `sidebar.tsx` | Multiple Radix | Main navigation sidebar |
| **Breadcrumb** | `breadcrumb.tsx` | @radix-ui/react-slot | Navigation breadcrumbs |

#### Display

| Component | File | Dependencies | Description |
|-----------|------|--------------|-------------|
| **Avatar** | `avatar.tsx` | @radix-ui/react-avatar | User avatars |
| **Skeleton** | `skeleton.tsx` | - | Loading placeholder |
| **GoalNotification** | `GoalNotification.tsx` | - | Goal alert toast |

---

### Rich Text Editor (`app/components/ui/CustomTextEditor/`)

Built on **Lexical** editor framework:

| File | Purpose |
|------|---------|
| `index.tsx` | Main editor component |
| `plugins/` | Lexical plugins (lists, links, markdown) |
| `themes/` | Editor theming |

**Features**:
- Rich text formatting (bold, italic, underline)
- Lists (ordered, unordered)
- Links
- Markdown shortcuts
- Custom toolbar

**Usage**:
```tsx
<CustomTextEditor
  content={entry.content}
  onChange={(content) => setContent(content)}
  placeholder="Start writing..."
/>
```

---

### Sidebar System (`app/components/Sidebar/`)

Complex navigation sidebar with mobile responsiveness:

| File | Purpose |
|------|---------|
| `index.tsx` | Main sidebar export |
| `SidebarNav.tsx` | Navigation items |
| Additional files | Sub-components |

**Features**:
- Collapsible sections
- Mobile drawer mode (Sheet)
- Active route highlighting
- Journal selection
- Goal notification badges

---

### Feature Components

#### GoalNotificationProvider (`app/components/GoalNotificationProvider.tsx`)

Context provider for goal-related notifications:

```tsx
<GoalNotificationProvider>
  {children}
</GoalNotificationProvider>
```

**Provides**:
- New goal count polling
- Toast notifications for new goals
- Mark goals as seen

#### ThemeProvider (`app/components/ThemeProvider.tsx`)

Dark/light mode context:

```tsx
<ThemeProvider defaultTheme="light" storageKey="journal-theme">
  {children}
</ThemeProvider>
```

#### ErrorBoundary (`app/components/ErrorBoundary.tsx`)

React error boundary for graceful error handling.

#### UserInfoForm (`app/components/UserInfoForm.tsx`)

User profile editing form with fields:
- First name / Last name
- Bio
- Timezone
- Growth goals

---

### Component Patterns

#### Styling Approach

Components use **Tailwind CSS** with **class-variance-authority (CVA)** for variants:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: { default: "...", secondary: "..." },
      size: { default: "...", sm: "...", lg: "..." }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export const Button = ({ variant, size, ...props }) => (
  <button className={buttonVariants({ variant, size })} {...props} />
);
```

#### Composition Pattern

Components are designed for composition:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Journal Entry</CardTitle>
    <CardDescription>Write your thoughts</CardDescription>
  </CardHeader>
  <CardContent>
    <CustomTextEditor />
  </CardContent>
  <CardFooter>
    <Button>Save Entry</Button>
  </CardFooter>
</Card>
```

#### Radix UI Integration

All interactive components use Radix primitives for accessibility:

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="..." />
    <DialogPrimitive.Content ref={ref} className={cn("...", className)} {...props} />
  </DialogPrimitive.Portal>
));
```

---

### Design Tokens Reference

From `tailwind.config.ts`:

```typescript
// Colors
main: "#b3cb9a"      // Primary action color
bg: "#dfe5f2"        // Background
background: "#ecefd6" // Alternative background
text: "#000"         // Primary text
border: "#000"       // Bold borders (neobrutalism)

// Effects
boxShadow: {
  light: "4px 4px 0px 0px #000",  // Offset shadow
  dark: "4px 4px 0px 0px #000"
}

// Borders
borderRadius: {
  base: "5px"  // Sharp corners
}
```

---

### Component Usage Examples

#### Creating a New Journal Entry

```tsx
export default function JournalNew() {
  const [content, setContent] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <CustomTextEditor
          content={content}
          onChange={setContent}
        />
      </CardContent>
      <CardFooter>
        <Button type="submit">
          Save Entry
        </Button>
      </CardFooter>
    </Card>
  );
}
```

#### Displaying Goals with Actions

```tsx
<Card>
  <CardHeader>
    <CardTitle>Suggested Goal</CardTitle>
  </CardHeader>
  <CardContent>
    <p>{goal.content}</p>
  </CardContent>
  <CardFooter className="flex gap-2">
    <Button variant="default" onClick={handleAccept}>
      Accept
    </Button>
    <Button variant="outline" onClick={handleDismiss}>
      Dismiss
    </Button>
  </CardFooter>
</Card>
```

---
*Generated by BMM Document Project Workflow - 2026-01-06*
