import { LucideIcon } from "lucide-react";

export interface Journal {
  id: string;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface JournalTypeInfo {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export interface CreateJournalInput {
  title: string;
  content?: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  journalId: string;
  createdAt: string;
  updatedAt: string;
}

export class JournalServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = "JournalServiceError";
  }
}

export interface JournalApiResponse<T> {
  data: T;
  status?: string;
  message?: string;
}

// Type alias for common response types
export type SingleJournalResponse = JournalApiResponse<Journal>;
export type JournalListResponse = JournalApiResponse<Journal[]>;
export type JournalEntryResponse = JournalApiResponse<JournalEntry>;

export interface JournalContextType {
  selectedJournalId: string;
  setSelectedJournalId: (id: string) => void;
  journals: Journal[];
}
