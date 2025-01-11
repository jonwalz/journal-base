import {
  Book,
  Clock,
  ListTodo,
  MessageCircle,
  Target,
  LineChart,
  Star,
  ClipboardList,
  LucideIcon,
} from "lucide-react";

export type JournalType = "growth";

interface SidebarItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

export const sidebarOptions: SidebarItem[] = [
  { name: "Today's Entry", icon: Book, href: "/todays-entry" },
  { name: "Entry History", icon: Clock, href: "/journals/history" },
  { name: "Goal Tracking", icon: Target, href: "/goal-tracking" },
  { name: "Growth Chat", icon: MessageCircle, href: "/chat" },
  // { name: "Action Items", icon: ListTodo, href: "/action-items" },
  // { name: "Progress Dashboard", icon: LineChart, href: "/progress" },
  // { name: "Milestone Tracker", icon: Clock, href: "/milestones" },
  // { name: "Learning Path", icon: ClipboardList, href: "/learning-path" },
  // { name: "Success Stories", icon: Star, href: "/success-stories" },
  // { name: "Habit Builder", icon: Target, href: "/habit-builder" },
];
