import { GoalService } from './goal.service';
import { onEntryCreated } from '../events/journal-events';
import logger from '../utils/logger';

/**
 * Service that handles goal-related events
 */
export class GoalEventHandlerService {
  private goalService: GoalService;

  constructor() {
    this.goalService = new GoalService();
    this.registerEventHandlers();
  }

  /**
   * Register event handlers for journal events
   */
  private registerEventHandlers(): void {
    // Listen for journal entry creation events
    onEntryCreated(async (entry) => {
      try {
        logger.info(`Generating goals for new journal entry: ${entry.id}`);
        await this.goalService.generateGoalsFromEntry(entry.id);
      } catch (error) {
        logger.error('Error generating goals from journal entry:', { error: error instanceof Error ? error.message : String(error) });
      }
    });
  }
}

// Create a singleton instance
export const goalEventHandler = new GoalEventHandlerService();
