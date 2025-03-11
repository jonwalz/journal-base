import { eventEmitter } from './event-emitter';
import type { IEntry } from '../types';

/**
 * Event names for journal-related events
 */
export enum JournalEventType {
  ENTRY_CREATED = 'journal:entry:created',
  ENTRY_UPDATED = 'journal:entry:updated',
  ENTRY_DELETED = 'journal:entry:deleted'
}

/**
 * Emit an event when a journal entry is created
 * @param entry The created journal entry
 */
export function emitEntryCreated(entry: IEntry): void {
  eventEmitter.emit(JournalEventType.ENTRY_CREATED, entry);
}

/**
 * Emit an event when a journal entry is updated
 * @param entry The updated journal entry
 */
export function emitEntryUpdated(entry: IEntry): void {
  eventEmitter.emit(JournalEventType.ENTRY_UPDATED, entry);
}

/**
 * Emit an event when a journal entry is deleted
 * @param entryId The ID of the deleted journal entry
 */
export function emitEntryDeleted(entryId: string): void {
  eventEmitter.emit(JournalEventType.ENTRY_DELETED, entryId);
}

/**
 * Subscribe to the journal entry created event
 * @param listener The callback function
 */
export function onEntryCreated(listener: (entry: IEntry) => void): void {
  eventEmitter.on(JournalEventType.ENTRY_CREATED, listener);
}

/**
 * Subscribe to the journal entry updated event
 * @param listener The callback function
 */
export function onEntryUpdated(listener: (entry: IEntry) => void): void {
  eventEmitter.on(JournalEventType.ENTRY_UPDATED, listener);
}

/**
 * Subscribe to the journal entry deleted event
 * @param listener The callback function
 */
export function onEntryDeleted(listener: (entryId: string) => void): void {
  eventEmitter.on(JournalEventType.ENTRY_DELETED, listener);
}
