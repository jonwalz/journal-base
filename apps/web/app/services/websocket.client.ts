interface IWebSocketMessage {
  type: string;
  payload: {
    id: string;
    message: string; // Will contain stringified IChatMessage[] or stream chunk
    timestamp: string;
    userId: string;
    chunk?: string;
  };
}

interface IWebSocketConfig {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onMessage?: (data: unknown) => void;
  onError?: (error: Event) => void;
  onClose?: (event: CloseEvent) => void;
  headers?: Record<string, string>;
}

export class WebSocketClient {
  private static wsConnection: WebSocket | null = null;
  private static wsConfig: IWebSocketConfig = {
    reconnectAttempts: 3,
    reconnectInterval: 3000,
  };
  private static readonly CONNECTION_TIMEOUT = 5000; // 5 seconds timeout
  private static reconnectAttempt = 0;
  private static reconnectTimeout: number | null = null;
  private static isConnecting = false;
  private static connectionPromise: Promise<WebSocket> | null = null;

  static async connectWebSocket(
    config: Partial<IWebSocketConfig> = {}
  ): Promise<WebSocket> {
    console.log("WebSocketClient: Starting connection attempt");
    this.wsConfig = { ...this.wsConfig, ...config };

    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      console.log("WebSocketClient: Reusing existing open connection");
      return this.wsConnection;
    }

    if (this.connectionPromise) {
      console.log(
        "WebSocketClient: Connection already in progress, waiting..."
      );
      return this.connectionPromise;
    }

    this.isConnecting = true;
    console.log("WebSocketClient: Creating new connection");

    this.connectionPromise = new Promise((resolve, reject) => {
      const getWebSocketUrl = () => {
        // In development, use localhost with specific port
        if (import.meta.env.DEV) {
          const serverPort = import.meta.env.PORT ?? 3030;
          return `ws://localhost:${serverPort}/ai/chat`;
        }

        // In production, use Render.com URL
        const wsProtocol = "wss:";
        const apiHost = "journal-up.onrender.com";
        return `${wsProtocol}//${apiHost}/ai/chat`;
      };

      const wsUrl = getWebSocketUrl();
      console.log("WebSocketClient: Connecting to", wsUrl);

      if (this.wsConnection?.readyState === WebSocket.CONNECTING) {
        console.log("WebSocketClient: Closing existing connecting socket");
        this.wsConnection.close();
      }

      this.wsConnection = new WebSocket(wsUrl);

      // Add connection timeout
      const timeoutId = setTimeout(() => {
        if (
          this.wsConnection &&
          this.wsConnection.readyState === WebSocket.CONNECTING
        ) {
          console.log("WebSocketClient: Connection timeout");
          this.wsConnection.close();
          reject(new Error("WebSocket connection timeout"));
        }
      }, this.CONNECTION_TIMEOUT);

      this.wsConnection.onopen = () => {
        console.log("WebSocketClient: Connection opened");
        clearTimeout(timeoutId);
        this.isConnecting = false;
        this.reconnectAttempt = 0;
        resolve(this.wsConnection!);
      };

      this.wsConnection.onclose = (event) => {
        console.log("WebSocketClient: Connection closed", event);
        clearTimeout(timeoutId);
        this.isConnecting = false;
        this.wsConnection = null;
        this.connectionPromise = null;

        if (this.wsConfig.onClose) {
          this.wsConfig.onClose(event);
        }

        // Attempt to reconnect if not manually closed
        if (
          !event.wasClean &&
          this.reconnectAttempt < (this.wsConfig.reconnectAttempts || 3)
        ) {
          console.log("WebSocketClient: Attempting to reconnect...");
          this.reconnectTimeout = window.setTimeout(() => {
            this.reconnectAttempt++;
            this.connectWebSocket(this.wsConfig);
          }, this.wsConfig.reconnectInterval || 3000);
        }
      };

      this.wsConnection.onerror = (error) => {
        console.error("WebSocketClient: Connection error", error);
        if (this.wsConfig.onError) {
          this.wsConfig.onError(error);
        }
      };

      this.wsConnection.onmessage = (event) => {
        if (this.wsConfig.onMessage) {
          this.wsConfig.onMessage(event.data);
        }
      };
    });

    return this.connectionPromise;
  }

  static async sendWebSocketMessage(message: IWebSocketMessage): Promise<void> {
    if (!this.wsConnection || this.wsConnection.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket connection not open");
    }

    this.wsConnection.send(JSON.stringify(message));
  }

  static cleanup() {
    console.log("WebSocketClient: Cleaning up...");
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.wsConnection) {
      if (this.wsConnection.readyState === WebSocket.OPEN) {
        this.wsConnection.close(1000, "Cleanup");
      }
      this.wsConnection = null;
    }

    this.isConnecting = false;
    this.connectionPromise = null;
    this.reconnectAttempt = 0;
  }
}
