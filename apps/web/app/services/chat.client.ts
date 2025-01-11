import { WebSocketClient } from "./websocket.client";

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface IChatResponse {
  message: string;
  id: string;
}

export class ChatClientError extends Error {
  constructor(
    message: string,
    public override cause?: unknown
  ) {
    super(message);
    this.name = "ChatClientError";
  }
}

export class ChatClient {
  private static messageCallbacks: Map<
    string,
    (response: IChatResponse) => void
  > = new Map();
  private static streamCallbacks: Set<(chunk: string) => void> = new Set();
  private static isInitialized = false;
  private static connectionPromise: Promise<void> | null = null;
  private static isCleaningUp = false;

  static onStreamMessage(callback: (chunk: string) => void) {
    this.streamCallbacks.add(callback);
    return () => {
      this.streamCallbacks.delete(callback);
    };
  }

  private static async ensureConnection(): Promise<void> {
    console.log("ChatClient: Ensuring connection...");
    if (this.isInitialized && !this.isCleaningUp) {
      console.log("ChatClient: Connection already initialized");
      return;
    }

    if (this.connectionPromise) {
      console.log("ChatClient: Connection in progress, waiting...");
      try {
        await this.connectionPromise;
        console.log("ChatClient: Existing connection promise resolved");
        return;
      } catch (error) {
        console.error("ChatClient: Existing connection promise failed:", error);
        this.connectionPromise = null;
      }
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      WebSocketClient.connectWebSocket({
        onMessage: (data) => {
          try {
            const response = JSON.parse(data as string);
            console.log("ChatClient: Received message:", response);

            if (response.isPartial) {
              // Handle streaming message chunks
              this.streamCallbacks.forEach((callback) => {
                callback(response.message);
              });
            } else if (response.isComplete) {
              // Handle complete message
              const messageId = response.id;
              const callback = this.messageCallbacks.get(messageId);
              if (callback) {
                callback({
                  id: messageId,
                  message: response.message,
                });
                this.messageCallbacks.delete(messageId);
              }
            } else if (response.type === "error") {
              console.error("ChatClient: Received error:", response);
              const messageId = response.payload?.id;
              if (messageId) {
                const callback = this.messageCallbacks.get(messageId);
                if (callback) {
                  callback({
                    id: messageId,
                    message: response.payload.message || "Unknown error",
                  });
                  this.messageCallbacks.delete(messageId);
                }
              }
            }
          } catch (error) {
            console.error("ChatClient: Error processing message:", error);
          }
        },
        onError: (error) => {
          console.error("ChatClient: WebSocket error:", error);
          reject(new ChatClientError("WebSocket connection failed", error));
        },
        onClose: () => {
          console.log("ChatClient: WebSocket connection closed");
          this.isInitialized = false;
          this.connectionPromise = null;
        },
      })
        .then(() => {
          console.log("ChatClient: WebSocket connection established");
          this.isInitialized = true;
          resolve();
        })
        .catch((error) => {
          console.error(
            "ChatClient: Failed to establish WebSocket connection:",
            error
          );
          reject(
            new ChatClientError(
              "Failed to establish WebSocket connection",
              error
            )
          );
        });
    });

    try {
      await this.connectionPromise;
    } catch (error) {
      this.connectionPromise = null;
      throw error;
    }
  }

  static async sendMessage(
    messages: IChatMessage[],
    userId: string
  ): Promise<IChatResponse> {
    await this.ensureConnection();
    if (
      messages.length === 0 ||
      messages.every((m) => m.content.trim() === "")
    ) {
      console.log("ChatClient: Connection test message");
      return { id: "connection-test", message: "" };
    }

    console.log("ChatClient: Sending messages...");
    return new Promise((resolve, reject) => {
      try {
        const messageId = window.crypto.randomUUID();
        console.log("ChatClient: Created message ID:", messageId);

        const payload = {
          type: "chat_message",
          payload: {
            id: messageId,
            message: JSON.stringify(messages),
            timestamp: new Date().toISOString(),
            userId,
          },
        };

        this.messageCallbacks.set(messageId, resolve);

        WebSocketClient.sendWebSocketMessage(payload).catch((error) => {
          this.messageCallbacks.delete(messageId);
          reject(new ChatClientError("Failed to send message", error));
        });
      } catch (error) {
        reject(new ChatClientError("Failed to prepare message", error));
      }
    });
  }

  static cleanup() {
    console.log("ChatClient: Cleaning up...");
    this.isCleaningUp = true;
    this.messageCallbacks.clear();
    this.streamCallbacks.clear();
    this.isInitialized = false;
    this.connectionPromise = null;
    WebSocketClient.cleanup?.();
    this.isCleaningUp = false;
  }
}
