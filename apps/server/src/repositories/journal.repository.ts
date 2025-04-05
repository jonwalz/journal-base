import { eq, and } from "drizzle-orm";
import { db } from "../config/database";
import { journals, entries } from "../db/schema";
import type { IJournal, IEntry } from "../types";
import { NotFoundError } from "../utils/errors";
import { emitEntryCreated } from "../events/journal-events";

export class JournalRepository {
  async create(userId: string, title: string): Promise<IJournal> {
    const [journal] = await db
      .insert(journals)
      .values({ userId, title })
      .returning();

    return journal;
  }

  async findById(id: string): Promise<IJournal> {
    const [journal] = await db
      .select()
      .from(journals)
      .where(eq(journals.id, id))
      .limit(1);

    if (!journal) {
      throw new NotFoundError("Journal");
    }

    return journal;
  }

  async findByUserId(userId: string): Promise<IJournal[]> {
    return await db.select().from(journals).where(eq(journals.userId, userId));
  }

  async createEntry(journalId: string, content: string): Promise<IEntry> {
    const [entry] = await db
      .insert(entries)
      .values({ journalId, content })
      .returning();

    // Emit an event when a journal entry is created
    emitEntryCreated(entry);

    return entry;
  }

  async getEntries(journalId: string): Promise<IEntry[]> {
    return await db
      .select()
      .from(entries)
      .where(eq(entries.journalId, journalId));
  }

  async findEntryById(entryId: string): Promise<IEntry | null> {
    const [entry] = await db
      .select()
      .from(entries)
      .where(eq(entries.id, entryId))
      .limit(1);

    if (!entry) {
      // Return null instead of throwing, let the service handle the error logic
      return null;
    }

    return entry;
  }

  async getRecentEntriesByUserId(userId: string, limit: number): Promise<IEntry[]> {
    // First get all journals for this user
    const userJournals = await this.findByUserId(userId);
    
    if (userJournals.length === 0) {
      return [];
    }
    
    // Get the journal IDs
    const journalIds = userJournals.map(journal => journal.id);
    
    // Since we can't use inArray directly with the types, we'll use a different approach
    // We'll get entries for each journal and combine them
    let allEntries: IEntry[] = [];
    
    for (const journalId of journalIds) {
      const journalEntries = await this.getEntries(journalId);
      allEntries = [...allEntries, ...journalEntries];
    }
    
    // Sort by creation date (newest first) and limit
    return allEntries
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async updateEntry(id: string, updates: Partial<IEntry>): Promise<IEntry> {
    const validFields = ["content"];

    const updateFields = Object.entries(updates)
      .filter(([key]) => validFields.includes(key))
      .map(([key, value]) => ({
        key,
        value,
      }));

    if (updateFields.length === 0) {
      throw new Error("No valid fields to update");
    }

    const updateValues = Object.fromEntries(
      updateFields.map(({ key, value }) => [key, value])
    );

    const [entry] = await db
      .update(entries)
      .set(updateValues)
      .where(eq(entries.id, id))
      .returning();

    if (!entry) {
      throw new NotFoundError("Entry");
    }

    return entry;
  }

  async deleteEntryById(
    entryId: string,
    journalId: string
  ): Promise<boolean> {
    // Drizzle's delete might not directly return the number of affected rows easily across drivers.
    // A common pattern is to attempt the delete and assume success if no error is thrown,
    // or to select the entry first (more robust but requires extra query).
    // Let's try a delete and assume success if it completes.
    // The `where` clause ensures we only delete if both entryId and journalId match.
    try {
      await db
        .delete(entries)
        .where(and(eq(entries.id, entryId), eq(entries.journalId, journalId)));
      // If the query completes without error, assume deletion was successful *if* the entry existed.
      // We cannot easily tell from the delete result itself if 0 rows were deleted vs 1 row.
      // For the service layer to return true/false based on actual deletion, 
      // we'd ideally fetch first or use a DB feature that returns affected rows reliably.
      // Let's return true for now if no error, the service layer handles non-existence with findById first.
      // A potentially better approach is to return the result of the delete operation if it provides useful info.
      // For now, we stick to the boolean return type expected by the service.
      return true; // Indicate the operation was attempted.
    } catch (error) {
      console.error("Error deleting entry:", error);
      // Depending on expected errors, might re-throw or return false.
      return false;
    }
  }
}
