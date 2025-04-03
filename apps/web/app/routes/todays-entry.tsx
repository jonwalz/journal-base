import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Save,
  Loader2,
  ChevronRight,
  ChevronLeft,
  History,
} from "lucide-react";
import "~/features/automatic-goals/goal-animations.css";
import { Button } from "~/components/ui/button";
import { MainLayout } from "~/layouts/MainLayout";
import { Editor } from "~/components/ui/CustomTextEditor/RichTextEditor";
import {
  useOutletContext,
  useLoaderData,
  useNavigate,
  useFetcher,
} from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { JournalService } from "~/services/journal.service";
import { requireUserSession } from "~/services/session.server";
import { getSelectedJournalId } from "~/utils/journal.server";
import type { Journal, JournalEntry } from "~/types/journal";

type ActionData = { success: true } | { error: string };

type LoaderData = {
  journals: Journal[];
  entries: JournalEntry[];
  selectedJournalId: string | null;
};

type ContextType = {
  journals: Journal[];
  entries: JournalEntry[];
  selectedJournalId: string | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { authToken, sessionToken } = await requireUserSession(request);
  const journals = await JournalService.getJournals({
    headers: {
      Authorization: `Bearer ${authToken}`,
      "x-session-token": sessionToken,
    },
  });

  const selectedJournalId = await getSelectedJournalId(request);
  let entries: JournalEntry[] = [];

  if (selectedJournalId) {
    entries = (await JournalService.getEntries(selectedJournalId, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken,
      },
    })) as JournalEntry[];
  }

  return json<LoaderData>({
    journals,
    entries,
    selectedJournalId,
  });
};

export async function action({ request }: ActionFunctionArgs) {
  const { authToken, sessionToken } = await requireUserSession(request);
  const formData = await request.formData();
  const journalId = formData.get("journalId");
  const content = formData.get("content");

  if (!content || typeof content !== "string" || !content.trim()) {
    return json<ActionData>(
      { error: "Please write something before saving" },
      { status: 400 }
    );
  }

  if (!journalId) {
    return json<ActionData>(
      { error: "Please select a journal before saving" },
      { status: 400 }
    );
  }

  try {
    await JournalService.createEntry(journalId as string, content, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken,
      },
    });
    return json<ActionData>({ success: true });
  } catch (error) {
    console.error("Failed to save entry:", error);
    return json<ActionData>(
      {
        error: error instanceof Error ? error.message : "Failed to save entry",
      },
      { status: 500 }
    );
  }
}

export const meta: MetaFunction = () => {
  return [
    { title: "Today's Journal Entry" },
    {
      name: "description",
      content: "Record your thoughts, feelings, and experiences for today",
    },
  ];
};

export function ErrorBoundary() {
  return (
    <div className="p-4 text-red-500 bg-red-50 rounded-lg">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p>
        There was an error loading or saving your journal entry. Please try
        again later.
      </p>
    </div>
  );
}

const TherapeuticJournalEntry = () => {
  // Removed showPrompt state as it's no longer needed
  const [content, setContent] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { selectedJournalId } = useOutletContext<ContextType>();
  const { entries } = useLoaderData<LoaderData>();

  // Sort entries by createdAt date, most recent first
  const sortedEntries = [...entries].sort((a, b) => {
    // Assuming createdAt is a string or Date object that can be parsed by new Date()
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime(); // Descending order for most recent first
  });

  // Use optimistic UI pattern with useFetcher for better UX
  const fetcher = useFetcher<{ data: ActionData }>();
  const isSubmitting = fetcher.state === "submitting";

  // This enables progressive enhancement - the form will work even without JS
  const formRef = React.useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher.data && "success" in fetcher.data) {
      setContent("");
      setShowSuccess(true);
      // Auto-hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
    return undefined; // Explicit return for all code paths
  }, [fetcher.data]);

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto p-4 pt-2 space-y-3 animate-fade-in">
        <h1 className="text-3xl font-bold mb-1">Today's Journal Entry</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Record your thoughts, feelings, and experiences for today.
        </p>
        <fetcher.Form
          method="post"
          className="flex-1 flex flex-col"
          ref={formRef}
        >
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
            <div className="animate-fade-in bg-white dark:bg-gray-800 border-2 dark:border-gray-700 rounded-lg p-4">
              <p className="text-sm text-black/70 dark:text-white/90 font-medium">
                Date
              </p>
              <div className="flex items-center gap-1.5 text-xl font-bold text-black dark:text-white">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div
              className="animate-fade-in bg-white dark:bg-gray-800 border-2 dark:border-gray-700 rounded-lg p-4"
              style={{ animationDelay: "0.1s" }}
            >
              <p className="text-sm text-black/70 dark:text-white/90 font-medium">
                Time
              </p>
              <div className="flex items-center gap-1.5 text-xl font-bold text-black dark:text-white">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
          <input
            type="hidden"
            name="journalId"
            value={selectedJournalId || ""}
          />
          <input type="hidden" name="content" value={content} />
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <Editor onChange={setContent} initialContent={content} />
          </div>
          {showSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mt-4 mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Journal entry saved successfully!
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              variant="default"
              className="px-8 py-2 text-base bg-green-600 hover:bg-green-700 text-white font-medium"
              disabled={isSubmitting || !content.trim()}
              aria-label="Save journal entry"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2
                  className="w-5 h-5 animate-spin mr-2"
                  aria-hidden="true"
                />
              ) : (
                <Save className="w-5 h-5 mr-2" aria-hidden="true" />
              )}
              Save Entry
            </Button>
          </div>
        </fetcher.Form>
      </div>

      {/* Floating button for opening sidebar */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed right-4 top-20 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105 z-20"
          aria-label="Show entry history"
        >
          <History className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar - positioned absolutely on the right side */}
      <div
        className={`fixed top-0 right-0 h-screen z-50 transition-all duration-300 bg-white dark:bg-gray-800 border-l dark:border-gray-700 shadow-lg ${isSidebarOpen ? "w-80 md:w-96" : "w-0 overflow-hidden"}`}
        style={{ marginTop: "60px" }}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? (
            <ChevronRight className="w-4 h-4 text-black dark:text-white" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-black dark:text-white" />
          )}
        </button>
        <div className="p-4 text-black dark:text-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading text-black dark:text-white flex items-center">
              <History className="w-5 h-5 mr-2" />
              Recent Entries
            </h2>
            <div className="text-sm bg-main-100 dark:bg-main-900/70 text-black dark:text-white px-2 py-1 rounded-base font-medium border-2 border-border dark:border-main-600">
              {sortedEntries.length}{" "}
              {sortedEntries.length === 1 ? "entry" : "entries"}
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
            {sortedEntries.length === 0 ? (
              <div className="text-center py-8 text-black/70 dark:text-white/70">
                <div className="mb-2">No entries yet</div>
                <div className="text-sm">
                  Start journaling to see your entries here
                </div>
              </div>
            ) : (
              sortedEntries.map((entry: JournalEntry) => {
                // Format date - get relative time (today, yesterday) or actual date
                const entryDate = new Date(entry.createdAt);
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                let dateDisplay;
                if (entryDate.toDateString() === today.toDateString()) {
                  dateDisplay = "Today";
                } else if (
                  entryDate.toDateString() === yesterday.toDateString()
                ) {
                  dateDisplay = "Yesterday";
                } else {
                  dateDisplay = entryDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }

                // Get clean preview text (no HTML)
                const previewText = entry.content.replace(/<[^>]*>/g, "");

                return (
                  <div
                    key={entry.id}
                    onClick={() => navigate(`/journal/edit/${entry.id}`)}
                    className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg p-2.5 hover:bg-accent/10 border-2 border-gray-200 dark:border-gray-700 mb-2 transition-colors goal-list-item"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-medium flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-primary" />
                        {dateDisplay}
                        <span className="mx-1 text-black/50 dark:text-white/50">
                          &middot;
                        </span>
                        <span className="text-xs text-black/70 dark:text-white/70">
                          {entryDate.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-black/60 dark:text-white/60" />
                    </div>
                    <div className="text-xs line-clamp-2 text-black/70 dark:text-white/70">
                      {previewText || "<Empty entry>"}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TherapeuticJournalEntry;
