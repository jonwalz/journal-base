import { ApiClient, RequestOptions } from "./api-client.server";
import {
  CreateJournalInput,
  JournalServiceError,
  Journal,
} from "~/types/journal";

export type { JournalServiceError };

export class JournalService {
  static async getJournals(options: RequestOptions = {}): Promise<Journal[]> {
    try {
      const response = await ApiClient.get<Journal[]>("/journals", options);

      return response.data;
    } catch (error) {
      throw new JournalServiceError("Failed to fetch journals", error);
    }
  }

  static async getJournalById(id: number): Promise<Journal> {
    try {
      const response = await ApiClient.get<Journal>(`/journals/${id}`);
      return response.data;
    } catch (error) {
      throw new JournalServiceError(
        `Failed to fetch journal with id ${id}`,
        error
      );
    }
  }

  static async createJournal(
    name: string,
    options: RequestOptions = {}
  ): Promise<Journal> {
    try {
      const response = await ApiClient.post<Journal>(
        "/journals",
        { title: name },
        options
      );
      return response.data;
    } catch (error) {
      throw new JournalServiceError("Failed to create journal", error);
    }
  }

  static async updateJournal(
    id: number,
    input: Partial<CreateJournalInput>
  ): Promise<Journal> {
    try {
      const response = await ApiClient.put<Journal>(`/journals/${id}`, input);
      return response.data;
    } catch (error) {
      throw new JournalServiceError(
        `Failed to update journal with id ${id}`,
        error
      );
    }
  }

  static async deleteJournal(id: number): Promise<void> {
    try {
      await ApiClient.delete(`/journals/${id}`);
    } catch (error) {
      throw new JournalServiceError(
        `Failed to delete journal with id ${id}`,
        error
      );
    }
  }

  static async createEntry(
    journalId: string,
    content: string,
    options: RequestOptions = {}
  ): Promise<unknown> {
    try {
      const response = await ApiClient.post(
        `/journals/${journalId}/entries`,
        {
          content,
        },
        options
      );
      return response.data;
    } catch (error) {
      throw new JournalServiceError("Failed to create journal entry", error);
    }
  }

  static async getEntries(journalId: string, options: RequestOptions = {}) {
    try {
      const response = await ApiClient.get(`/journals/${journalId}/entries`, options);
      return response.data;
    } catch (error) {
      throw new JournalServiceError("Failed to fetch journal entries", error);
    }
  }
}
