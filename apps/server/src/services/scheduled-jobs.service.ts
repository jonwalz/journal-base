import { CronJob } from "cron";
import { GoalService } from "./goal.service";
import { UserRepository } from "../repositories/user.repository";
import logger from "../utils/logger";

/**
 * Service for handling scheduled jobs
 */
export class ScheduledJobsService {
  private goalService: GoalService;
  private userRepository: UserRepository;
  private dailyGoalGenerationJob!: CronJob;

  constructor() {
    this.goalService = new GoalService();
    this.userRepository = new UserRepository();
    this.initializeJobs();
  }

  /**
   * Initialize all scheduled jobs
   */
  private initializeJobs(): void {
    // Schedule daily goal generation job to run at midnight every day
    // Cron format: Seconds Minutes Hours DayOfMonth Month DayOfWeek
    this.dailyGoalGenerationJob = new CronJob(
      "0 0 0 * * *", // Run at midnight (00:00:00) every day
      this.generateDailyGoalsForAllUsers.bind(this),
      null, // onComplete
      false, // start
      "UTC" // timezone
    );
  }

  /**
   * Start all scheduled jobs
   */
  public startJobs(): void {
    if (!this.dailyGoalGenerationJob.isActive) {
      this.dailyGoalGenerationJob.start();
      logger.info("Daily goal generation job started");
    }
  }

  /**
   * Stop all scheduled jobs
   */
  public stopJobs(): void {
    if (this.dailyGoalGenerationJob.isActive) {
      this.dailyGoalGenerationJob.stop();
      logger.info("Daily goal generation job stopped");
    }
  }

  /**
   * Generate daily goals for all active users
   */
  private async generateDailyGoalsForAllUsers(): Promise<void> {
    try {
      logger.info("Starting daily goal generation for all users");

      // Get all active users
      const users = await this.userRepository.getAllActiveUsers();
      logger.info(`Found ${users.length} active users for goal generation`);

      // Generate goals for each user
      const results = await Promise.allSettled(
        users.map((user) => this.generateGoalsForUser(user.id))
      );

      // Log results
      const successful = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failed = results.filter(
        (result) => result.status === "rejected"
      ).length;

      logger.info(
        `Daily goal generation completed. Success: ${successful}, Failed: ${failed}`
      );
    } catch (error) {
      logger.error("Error in daily goal generation job:", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Generate goals for a specific user
   * @param userId The user ID
   */
  private async generateGoalsForUser(userId: string): Promise<void> {
    try {
      logger.info(`Generating daily goals for user: ${userId}`);
      await this.goalService.generateDailyGoals(userId);
      logger.info(`Successfully generated daily goals for user: ${userId}`);
    } catch (error) {
      logger.error(`Failed to generate daily goals for user: ${userId}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error; // Re-throw to be caught by Promise.allSettled
    }
  }
}

// Create a singleton instance
export const scheduledJobsService = new ScheduledJobsService();
