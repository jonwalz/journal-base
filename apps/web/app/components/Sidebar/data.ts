import { Target } from "lucide-react";
import { JournalTypeInfo, UserData } from "./types";

export const userData: UserData = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "",
};

export const journalTypes: JournalTypeInfo[] = [
  {
    id: "growth",
    name: "Growth Coach Journal",
    icon: Target,
    description:
      "Focus on personal development with goal tracking and actionable insights.",
  },
];
