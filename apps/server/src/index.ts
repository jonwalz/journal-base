import { app } from "./app";
import { authController } from "./controllers/auth.controller";
import { journalController } from "./controllers/journal.controller";
import { metricsController } from "./controllers/metrics.controller";
import { aiController } from "./controllers/ai.controller";
import { settingsController } from "./controllers/settings.controller";
import { indexController } from "./controllers/index.controller";
import { userInfoController } from "./controllers/user-info.controller";
import { goalController } from "./controllers/goal.controller";
import {
  initializeServices,
  shutdownServices,
} from "./services/service-initializer";

app
  .use(aiController)
  .use(indexController)
  .use(authController)
  .use(journalController)
  .use(metricsController)
  .use(settingsController)
  .use(userInfoController)
  .use(goalController)
  .onError(({ error, set }) => {
    console.error("Error:", error);

    // TODO: Extract all these error handling into utils
    // Type guard to check if error has name and message properties
    const isAppError = (
      err: unknown
    ): err is { name: string; message: string } => {
      return (
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        "message" in err
      );
    };

    if (isAppError(error) && error.name === "ValidationError") {
      set.status = 400;
      return { error: error.message };
    }

    if (isAppError(error) && error.name === "AuthenticationError") {
      set.status = 401;
      return { error: error.message };
    }

    if (isAppError(error) && error.name === "AuthorizationError") {
      set.status = 403;
      return { error: error.message };
    }

    if (isAppError(error) && error.name === "NotFoundError") {
      set.status = 404;
      return { error: error.message };
    }

    if (isAppError(error) && error.name === "ConflictError") {
      set.status = 409;
      return { error: error.message };
    }

    set.status = 500;
    return { error: "Internal Server Error" };
  })
  .listen(process.env.PORT ?? 3000);

// Initialize services after the server starts
initializeServices();

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  shutdownServices();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  shutdownServices();
  process.exit(0);
});

console.log(
  `🚀 Journal-Up API is running at ${app.server?.hostname}:${app.server?.port}`
);
