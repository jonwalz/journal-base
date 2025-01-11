import { json, SerializeFrom } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { MainLayout } from "~/layouts/MainLayout";
import { cn } from "~/lib/utils";
import {
  ChatClient,
  ChatClientError,
  IChatMessage,
} from "~/services/chat.client";
import ReactMarkdown from "react-markdown";
import { requireUserSession } from "~/services/session.server";
import type { LoaderFunction } from "@remix-run/node";
import { useUserInfo } from "~/hooks/useUserInfo";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);
  return null;
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: "sending" | "error" | "streaming" | "receiving";
  isPartial?: boolean;
}

type ActionData = SerializeFrom<
  { message: string; error?: never } | { message?: never; error: string }
>;

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const message = formData.get("message") as string;
  console.log("Received message:", message);

  try {
    // This action is now just a fallback for non-JS clients
    return json<ActionData>({ message: "Message sent" });
  } catch (error) {
    const errorMessage = "Failed to send message";
    return json<ActionData>({ error: errorMessage }, { status: 500 });
  }
}

export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userInfo } = useUserInfo();

  // Handle message sending
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const content = formData.get("message") as string;

    if (!content.trim()) return;

    // Generate a temporary ID for optimistic updates
    const tempId = `temp-${Date.now()}`;

    // Create message object
    const newMessage: Message = {
      id: tempId,
      role: "user",
      content,
      status: "sending",
    };

    // Add optimistic message
    setMessages((prev) => [...prev, newMessage]);

    try {
      if (!userInfo) {
        throw new Error("User must be logged in to send messages");
      }

      // Convert messages to IChatMessage array format
      const messageHistory: IChatMessage[] = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content },
      ];

      // Create a placeholder for the assistant's response
      const assistantMessageId = window.crypto.randomUUID();
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          status: "streaming",
          isPartial: true,
        },
      ]);

      // Set up streaming message handler
      ChatClient.onStreamMessage((chunk: string) => {
        setMessages((currentMessages) => {
          const updatedMessages = [...currentMessages];
          const streamingMessageIndex = updatedMessages.findIndex(
            (m) => m.id === assistantMessageId
          );
          if (streamingMessageIndex !== -1) {
            updatedMessages[streamingMessageIndex] = {
              ...updatedMessages[streamingMessageIndex],
              content: updatedMessages[streamingMessageIndex].content + chunk,
              status: "receiving",
            };
          }
          return updatedMessages;
        });
      });

      const response = await ChatClient.sendMessage(
        messageHistory,
        userInfo.id
      );

      // Update messages once streaming is complete
      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages];
        const streamingMessageIndex = updatedMessages.findIndex(
          (m) => m.id === assistantMessageId
        );
        if (streamingMessageIndex !== -1) {
          updatedMessages[streamingMessageIndex] = {
            ...updatedMessages[streamingMessageIndex],
            content: response.message,
            status: undefined,
            isPartial: false,
          };
        }
        return updatedMessages;
      });

      // Update the user message status
      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages];
        const pendingMessageIndex = updatedMessages.findIndex(
          (m) => m.id === tempId
        );
        if (pendingMessageIndex !== -1) {
          updatedMessages[pendingMessageIndex] = {
            ...updatedMessages[pendingMessageIndex],
            status: undefined,
          };
        }
        return updatedMessages;
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages];
        const pendingMessageIndex = updatedMessages.findIndex(
          (m) => m.id === tempId
        );
        if (pendingMessageIndex !== -1) {
          updatedMessages[pendingMessageIndex] = {
            ...updatedMessages[pendingMessageIndex],
            status: "error",
          };
        }
        return updatedMessages;
      });
      setError(
        err instanceof ChatClientError ? err.message : "Failed to send message"
      );
    }

    form.reset();
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let mounted = true;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    const initializeConnection = async () => {
      if (!mounted) return;
      if (!userInfo) {
        console.error("User information is not available.");
        return;
      }

      setIsConnecting(true);
      try {
        await ChatClient.sendMessage([], userInfo.id);
        if (mounted) {
          setIsConnecting(false);
          setError(null);
        }
      } catch (error) {
        if (mounted) {
          console.error("Failed to initialize chat connection:", error);
          setError("Failed to connect to chat server");
          setIsConnecting(false);
          // Attempt to reconnect after 5 seconds
          reconnectTimeout = setTimeout(() => {
            if (mounted) {
              initializeConnection();
            }
          }, 5000);
        }
      }
    };

    // Initialize connection only when userInfo is available
    if (userInfo) {
      initializeConnection();
    }

    // Cleanup only when component unmounts
    return () => {
      mounted = false;
      clearTimeout(reconnectTimeout);
      console.log(
        "Chat component unmounting, cleaning up WebSocket connection"
      );
      ChatClient.cleanup();
    };
  }, []); // Empty dependency array - only run on mount/unmount

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-base border-2 border-red-300">
              {error}
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "p-4 rounded-base border-2 border-border dark:border-darkBorder max-w-3xl",
                message.role === "user"
                  ? "bg-white dark:bg-secondaryBlack ml-auto text-right"
                  : "bg-main dark:bg-[#1e1e2d] mr-auto",
                message.status === "sending" && "opacity-70",
                message.status === "streaming" && "animate-pulse",
                message.status === "error" && "border-red-500"
              )}
            >
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{message.content || " "}</ReactMarkdown>
                {message.status === "sending" && (
                  <span className="text-sm text-gray-500 ml-2">Sending...</span>
                )}
                {message.status === "streaming" && (
                  <span className="text-sm text-gray-500 ml-2">Thinking...</span>
                )}
                {message.status === "receiving" && (
                  <span className="text-sm text-gray-500 ml-2">▋</span>
                )}
                {message.status === "error" && (
                  <span className="text-sm text-red-500 ml-2">
                    Failed to send
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <Form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
          <Input
            name="message"
            placeholder="Type your message..."
            className="flex-1"
            required
            disabled={isConnecting}
          />
          <Button type="submit" disabled={isConnecting} variant="default">
            {isConnecting ? "Connecting..." : "Send"}
          </Button>
        </Form>
      </div>
    </MainLayout>
  );
}
