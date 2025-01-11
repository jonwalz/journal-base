interface WebSocket {
  send: (data: string) => void;
}

export class ChatServiceError extends Error {
  constructor(
    message: string,
    public override cause?: unknown
  ) {
    super(message);
    this.name = "ChatServiceError";
  }
}

export class ChatService {
  private static activeConnections = new Set<WebSocket>();

  static addConnection(ws: WebSocket) {
    this.activeConnections.add(ws);
  }

  static removeConnection(ws: WebSocket) {
    this.activeConnections.delete(ws);
  }

  static async handleMessage(
    message: string,
    messageId: string,
    ws: WebSocket
  ): Promise<void> {
    try {
      console.log("ChatService: Processing message:", { messageId, message });

      // Simulate streaming response
      const response =
        "This is a streaming response that will be sent chunk by chunk.";
      const chunks = response.split(" ");

      // Send each word as a separate chunk with a delay
      for (const chunk of chunks) {
        const streamMessage = {
          type: "stream",
          payload: {
            id: messageId,
            chunk: chunk + " ",
            timestamp: new Date().toISOString(),
          },
        };
        ws.send(JSON.stringify(streamMessage));
        await new Promise((resolve) => setTimeout(resolve, 200)); // 200ms delay between chunks
      }

      // Send final complete message
      const finalMessage = {
        type: "chat_response",
        payload: {
          id: messageId,
          message: response,
          timestamp: new Date().toISOString(),
        },
      };
      ws.send(JSON.stringify(finalMessage));
    } catch (error) {
      console.error("ChatService: Error processing message:", error);
      const errorMessage = {
        type: "error",
        payload: {
          id: messageId,
          error: "Failed to process message",
          timestamp: new Date().toISOString(),
        },
      };
      ws.send(JSON.stringify(errorMessage));
      throw new ChatServiceError("Failed to process message", error);
    }
  }
}
