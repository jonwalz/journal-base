import { Elysia, t } from "elysia";
import { JournalService } from "../services/journal.service";
import { GoalService } from "../services/goal.service";
import { authMiddleware } from "../middleware/auth";
import { ValidationError, AppError } from "../utils/errors";
import { UserInfoService } from "../services/user-info.service";

export const journalController = new Elysia({ prefix: "/journals" })
  .use(authMiddleware)
  .post(
    "/",
    async ({
      body,
      user,
    }: {
      body: { title: string };
      user: { id: string };
    }) => {
      const journalService = new JournalService();
      return await journalService.createJournal(user.id, body.title);
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1, maxLength: 255 }),
      }),
      error: ({ error }: { error: Error | AppError }) => {
        if (error.message === "Validation Failed") {
          throw new ValidationError(error.message);
        }
        throw error;
      },
    }
  )
  .get(
    "/",
    async ({ user }: { user: { id: string } }) => {
      const journalService = new JournalService();
      return await journalService.getJournals(user.id);
    },
    {
      error: ({ error }: { error: Error | AppError }) => {
        if (error.message === "Validation Failed") {
          throw new ValidationError(error.message);
        }
        throw error;
      },
    }
  )
  .post(
    "/:journalId/entries",
    async ({
      params: { journalId },
      body,
      user,
    }: {
      params: { journalId: string };
      body: { content: string };
      user: { id: string; email: string };
    }) => {
      const journalService = new JournalService();
      const goalService = new GoalService();

      const userInfoService = new UserInfoService();
      // TODO: Move to middleware
      let userInfo = await userInfoService.getUserInfo(user.id).catch(() => {
        return undefined;
      });

      if (!userInfo) {
        userInfo = await userInfoService.createUserInfo({
          userId: user.id,
          firstName: user.email.split("@")[0], // Use email username as default name
          lastName: "",
          timezone: "UTC", // Default timezone
        });
      }

      const entry = await journalService.createEntry({
        userId: user.id,
        journalId,
        content: body.content,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: user.email,
      });

      console.log("This ran here ====================");
      // Generate goals after entry creation
      // goalService.generateGoalsFromEntry(entry.id);

      return entry; // Return the created entry
    },
    {
      body: t.Object({
        content: t.String({ minLength: 1 }),
      }),
      error: ({ error }: { error: Error | AppError }) => {
        if (error.message === "Validation Failed") {
          throw new ValidationError(error.message);
        }
        throw error;
      },
    }
  )
  .get(
    "/:journalId/entries",
    async ({
      params: { journalId },
      user,
    }: {
      params: { journalId: string };
      user: { id: string };
    }) => {
      const journalService = new JournalService();
      return await journalService.getEntries(user.id, journalId);
    }
  )
  .get(
    "/:journalId/entries/:entryId",
    async ({
      params: { journalId, entryId },
      user,
    }: {
      params: { journalId: string; entryId: string };
      user: { id: string };
    }) => {
      const journalService = new JournalService();
      const entry = await journalService.getEntryById(
        user.id,
        journalId,
        entryId
      );
      if (!entry) {
        throw new Error("Entry not found");
      }
      return entry;
    }
  )
  .put(
    "/:journalId/entries/:entryId",
    async ({
      params: { journalId, entryId },
      body,
      user,
    }: {
      params: { journalId: string; entryId: string };
      body: { content: string };
      user: { id: string };
    }) => {
      const journalService = new JournalService();
      return await journalService.updateEntry(
        user.id,
        journalId,
        entryId,
        body.content
      );
    },
    {
      body: t.Object({
        content: t.String({ minLength: 1 }),
      }),
      error: ({ error }: { error: Error | AppError }) => {
        if (error.message === "Validation Failed") {
          throw new ValidationError(error.message);
        }
        throw error;
      },
    }
  )
  .delete(
    "/:journalId/entries/:entryId",
    async ({
      params: { journalId, entryId },
      user,
      set,
    }: {
      params: { journalId: string; entryId: string };
      user: { id: string };
      set: any;
    }) => {
      const journalService = new JournalService();
      await journalService.deleteEntry(user.id, journalId, entryId);

      set.status = 204;
      return;
    }
  );
