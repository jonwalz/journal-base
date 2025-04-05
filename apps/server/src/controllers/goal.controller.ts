import { Elysia, t } from "elysia";
import { GoalService } from "../services/goal.service";
import { JournalRepository } from "../repositories/journal.repository";
import {
  type DateRange,
  type GoalStatus,
  type MetricType,
} from "../types/goal";
import logger from "../utils/logger";

const goalService = new GoalService();
const journalRepository = new JournalRepository();

// Define the schema for the generate goals request
const generateGoalsSchema = {
  body: t.Object({
    entryId: t.String(),
  }),
};

// Define the schema for the get goals request
const getGoalsSchema = {
  query: t.Object({
    userId: t.String(),
    status: t.Optional(
      t.Union([
        t.Literal("suggested"),
        t.Literal("accepted"),
        t.Literal("completed"),
        t.Literal("deleted"),
      ])
    ),
    metricType: t.Optional(
      t.Union([
        t.Literal("resilience"),
        t.Literal("effort"),
        t.Literal("challenge"),
        t.Literal("feedback"),
        t.Literal("learning"),
      ])
    ),
    startDate: t.Optional(t.String()),
    endDate: t.Optional(t.String()),
  }),
};

// Define the schema for the accept goal request
const acceptGoalSchema = {
  params: t.Object({
    id: t.String(),
  }),
};

// Define the schema for the complete goal request
const completeGoalSchema = {
  params: t.Object({
    id: t.String(),
  }),
};

// Define the schema for the delete goal request
const deleteGoalSchema = {
  params: t.Object({
    id: t.String(),
  }),
};

// Define the schema for the get goal analytics request
const getGoalAnalyticsSchema = {
  query: t.Object({
    userId: t.String(),
    startDate: t.Optional(t.String()),
    endDate: t.Optional(t.String()),
  }),
};

// Type for the request body with entryId
type GenerateGoalsBody = { entryId: string };

// Type for the query parameters with optional filters
type GetGoalsQuery = {
  userId: string;
  status?: string;
  metricType?: string;
  startDate?: string;
  endDate?: string;
};

// Type for the params with id
type GoalIdParams = { id: string };

// Type for the query parameters for analytics
type GoalAnalyticsQuery = {
  userId: string;
  startDate?: string;
  endDate?: string;
};

// Type for Elysia context
type Context = {
  set: {
    status: number;
    headers: Record<string, string>;
  };
};

export const goalController = new Elysia({ prefix: "/api/goals" })
  // Generate goals from a journal entry
  .post(
    "/generate",
    async ({ body, set }: { body: GenerateGoalsBody; set: Context["set"] }) => {
      try {
        // First, get the journal entry to validate it exists
        const entry = await journalRepository.findEntryById(body.entryId);
        if (!entry) {
          set.status = 404;
          return { success: false, message: `Journal entry with ID ${body.entryId} not found` };
        }

        // Generate goals from the entry
        const goals = await goalService.generateGoalsFromEntry(body.entryId);
        logger.info(`Generated ${goals.length} goals from journal entry ${body.entryId}`);
        
        return { success: true, goals };
      } catch (error: unknown) {
        logger.error("Error generating goals from entry", {
          error: error instanceof Error ? error.message : String(error),
          entryId: body.entryId
        });
        set.status = 500;
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    generateGoalsSchema
  )

  // Manually trigger daily goal generation for a user
  .post(
    "/generate-daily/:userId",
    async ({ params, set }: { params: { userId: string }; set: Context["set"] }) => {
      try {
        const { userId } = params;
        const goals = await goalService.generateDailyGoals(userId);
        logger.info(`Manually triggered daily goal generation for user ${userId}, generated ${goals.length} goals`);
        
        return { success: true, goals };
      } catch (error: unknown) {
        logger.error("Error generating daily goals", {
          error: error instanceof Error ? error.message : String(error),
          userId: params.userId
        });
        set.status = 500;
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    {
      params: t.Object({
        userId: t.String(),
      }),
    }
  )

  // Get goals for a user with optional filters
  .get(
    "/",
    async ({ query, set }: { query: GetGoalsQuery; set: Context["set"] }) => {
      try {
        const { userId, status, metricType, startDate, endDate } = query;

        let dateRange: DateRange | undefined;
        if (startDate && endDate) {
          dateRange = {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          };
        }

        const goals = await goalService.getGoals(userId, {
          status: status as GoalStatus | undefined,
          metricType: metricType as MetricType | undefined,
          dateRange,
        });

        return { success: true, goals };
      } catch (error: unknown) {
        set.status = 400;
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    getGoalsSchema
  )

  // Accept a goal
  // Support both PATCH and POST methods for accepting goals
  .patch(
    "/:id/accept",
    async ({ params, set }: { params: GoalIdParams; set: Context["set"] }) => {
      try {
        const goal = await goalService.acceptGoal(params.id);
        if (!goal) {
          set.status = 404;
          return { success: false, message: "Goal not found" };
        }
        return { success: true, goal };
      } catch (error: unknown) {
        set.status = 400;
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    acceptGoalSchema
  )
  
  // Add POST handler for accepting goals (to support form submissions)
  .post(
    "/:id/accept",
    async ({ params, set }: { params: GoalIdParams; set: Context["set"] }) => {
      try {
        const goal = await goalService.acceptGoal(params.id);
        if (!goal) {
          set.status = 404;
          return { success: false, message: "Goal not found" };
        }
        return { success: true, goal };
      } catch (error: unknown) {
        set.status = 400;
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    acceptGoalSchema
  )

  // Complete a goal
  // Support both PATCH and POST methods for completing goals
  .patch(
    "/:id/complete",
    async ({ params, set }: { params: GoalIdParams; set: Context["set"] }) => {
      try {
        const goal = await goalService.completeGoal(params.id);
        if (!goal) {
          set.status = 404;
          return { success: false, message: "Goal not found" };
        }
        return { success: true, goal };
      } catch (error: unknown) {
        set.status = 400;
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    completeGoalSchema
  )
  
  // Add POST handler for completing goals (to support form submissions)
  .post(
    "/:id/complete",
    async ({ params, set }: { params: GoalIdParams; set: Context["set"] }) => {
      try {
        const goal = await goalService.completeGoal(params.id);
        if (!goal) {
          set.status = 404;
          return { success: false, message: "Goal not found" };
        }
        return { success: true, goal };
      } catch (error: unknown) {
        set.status = 400;
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    completeGoalSchema
  )

  // Delete a goal
  .delete(
    "/:id",
    async ({ params, set }: { params: GoalIdParams; set: Context["set"] }) => {
      try {
        await goalService.deleteGoal(params.id);
        return { success: true };
      } catch (error: unknown) {
        set.status = 400;
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    deleteGoalSchema
  )

  // Get goal analytics for a user
  .get(
    "/analytics",
    async ({ query, set }: { query: GoalAnalyticsQuery; set: Context["set"] }) => {
      try {
        const { userId, startDate, endDate } = query;

        let dateRange: DateRange | undefined;
        if (startDate && endDate) {
          dateRange = {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          };
        }

        const analytics = await goalService.getGoalAnalytics(userId, dateRange);
        return { success: true, analytics };
      } catch (error: unknown) {
        set.status = 400;
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    getGoalAnalyticsSchema
  )

  // Get count of new (suggested) goals for a user
  .get(
    "/new-count",
    async ({ query, set }: { query: { userId?: string }; set: Context["set"] }) => {
      try {
        const { userId } = query;
        
        if (!userId) {
          set.status = 400;
          return { success: false, message: "User ID is required" };
        }

        const goals = await goalService.getGoals(userId, {
          status: 'suggested',
        });

        return { success: true, count: goals.length };
      } catch (error: unknown) {
        logger.error("Error getting new goals count", {
          error: error instanceof Error ? error.message : String(error),
          userId: query.userId
        });
        set.status = 400;
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
      }
    },
    {
      query: t.Object({
        userId: t.Optional(t.String()),
      }),
    }
  );
