import { Elysia, t } from "elysia";
import { aiService } from "../services/ai/ai.service";

type MessageData = {
  type: string;
  payload: {
    userId: string;
    id: string;
    message: string;
    timestamp: string;
  };
};

export const aiController = new Elysia({ prefix: "/ai" })
  .ws("/chat", {
    body: t.Object({
      type: t.String(),
      payload: t.Object({
        id: t.String(),
        message: t.String(),
        timestamp: t.String(),
      }),
    }),
    open: ({ data }) => {
      console.log("WebSocket: Connection opened", {
        headers: data.headers,
        url: data.request?.url,
        method: data.request?.method,
      });
    },
    close: ({
      data,
      code,
      message,
    }: {
      data: any;
      code?: number;
      message?: string;
    }) => {
      console.log("WebSocket: Connection closed", {
        code,
        message,
        headers: data.headers,
      });
    },
    error: ({ error }) => {
      // Type guard to check if error has message and stack properties
      const isAppError = (err: unknown): err is { message: string; stack?: string } => {
        return typeof err === 'object' && err !== null && 'message' in err;
      };
      
      console.error("WebSocket: Error occurred", {
        error,
        message: isAppError(error) ? error.message : 'Unknown error',
        stack: isAppError(error) && error.stack ? error.stack : undefined,
      });
    },
    message: async (ws, data: unknown) => {
      try {
        const headers = ws.data.headers;
        console.log("WebSocket: Message received", {
          headers,
          data,
        });

        const message = data as MessageData;
        console.log("Received message:", message.payload);

        // Send chunks as they arrive
        const onProgress = (chunk: string) => {
          ws.send({ message: chunk, isPartial: true });
        };

        const response = await aiService.chat(
          message.payload.userId,
          message.payload.message,
          onProgress
        );

        console.log("AI Chat Response:", response);
        // Send final complete response
        ws.send({
          ...response,
          isComplete: true,
          id: message.payload.id,
        });
      } catch (error) {
        console.error("WebSocket: Error processing message", {
          error,
          data,
        });
        // Send error back to client
        ws.send({
          type: "error",
          payload: {
            id: (data as any)?.payload?.id || "unknown",
            message: "Error processing message",
            timestamp: new Date().toISOString(),
          },
        });
      }
    },
  })
  .post(
    "/analyze",
    async ({ body }: { body: { content: string } }) => {
      const analysis = await aiService.analyzeEntryContent(body.content);
      return analysis;
    },
    {
      body: t.Object({
        content: t.String(),
      }),
      response: t.Object({
        sentiment: t.Object({
          score: t.Number(),
          label: t.Union([
            t.Literal("positive"),
            t.Literal("negative"),
            t.Literal("neutral"),
          ]),
          confidence: t.Number(),
        }),
        growthIndicators: t.Array(
          t.Object({
            type: t.Union([
              t.Literal("resilience"),
              t.Literal("effort"),
              t.Literal("challenge"),
              t.Literal("feedback"),
              t.Literal("learning"),
            ]),
            confidence: t.Number(),
            evidence: t.String(),
          })
        ),
      }),
    }
  )
  .post(
    "/graph",
    async ({ body }: { body: { userId: string; data: any } }) => {
      const result = await aiService.addToGraph(body.userId, body.data);
      return result;
    },
    {
      body: t.Object({
        userId: t.String(),
        data: t.Any(),
      }),
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
      }),
    }
  );
