import { goalEventHandler } from './goal-event-handler.service';
import { scheduledJobsService } from './scheduled-jobs.service';
import logger from '../utils/logger';

/**
 * Initialize all services that need to be started when the server boots
 */
export function initializeServices(): void {
  try {
    logger.info('Initializing event handlers and scheduled jobs');
    
    // The goalEventHandler is initialized when imported, which registers all event listeners
    // We need to reference it here to prevent the linter from complaining about unused imports
    if (!goalEventHandler) {
      logger.error('Goal event handler not initialized properly');
    } else {
      logger.info('Goal event handlers initialized');
    }
    
    // Start scheduled jobs
    scheduledJobsService.startJobs();
    logger.info('Scheduled jobs started');
    
    logger.info('All services successfully initialized');
  } catch (error) {
    logger.error('Failed to initialize services', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    // Don't throw the error - we want the server to continue starting up
    // even if there's an issue with the services
  }
}

/**
 * Shutdown all services gracefully
 */
export function shutdownServices(): void {
  try {
    logger.info('Shutting down services');
    
    // Stop scheduled jobs
    scheduledJobsService.stopJobs();
    logger.info('Scheduled jobs stopped');
    
    logger.info('All services successfully shut down');
  } catch (error) {
    logger.error('Error shutting down services', { 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}
