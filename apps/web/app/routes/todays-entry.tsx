import { useState } from "react";
import {
  Calendar,
  Clock,
  Sparkles,
  Save,
  Loader2,
  X,
  ChevronRight,
  ChevronLeft,
  History,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Alert } from "~/components/ui/alerts";
import { MainLayout } from "~/layouts/MainLayout";
import { Editor } from "~/components/ui/CustomTextEditor/RichTextEditor";
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { ActionFunctionArgs, json, LoaderFunction } from "@remix-run/node";
import { JournalService } from "~/services/journal.service";
import { requireUserSession } from "~/services/session.server";
import { getSelectedJournalId } from "~/utils/journal.server";
import type { Journal, JournalEntry } from "~/types/journal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

type ActionData =
  | { success: true; error?: never }
  | { success?: never; error: string };

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

const TherapeuticJournalEntry = () => {
  const [showPrompt, setShowPrompt] = useState(true);
  const [content, setContent] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const { selectedJournalId } = useOutletContext<ContextType>();
  const { entries } = useLoaderData<LoaderData>();

  const growthPrompts = [
    "What new skill or knowledge did you work on today, and what did you learn from the experience?",
    "Describe a challenge you faced today. What opportunities for growth do you see in it?",
    "What's something you initially found difficult but are getting better at? How can you see your progress?",
    "What would you like to improve or master next? What small step can you take toward that goal?",
    "How did you push outside your comfort zone today, and what did that teach you?",
  ];

  const [selectedPrompt] = useState(
    growthPrompts[Math.floor(Math.random() * growthPrompts.length)]
  );

  return (
    <MainLayout>
      <div className="flex h-full gap-8 p-8 container m-auto">
        <Form method="post" className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          <input
            type="hidden"
            name="journalId"
            value={selectedJournalId || ""}
          />
          <input type="hidden" name="content" value={content} />
          {showPrompt && (
            <Alert className="p-4 rounded-lg mb-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="font-medium mb-1">Today&apos;s Prompt</div>
                <p className="text-sm text-muted-foreground">
                  {selectedPrompt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPrompt(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </Alert>
          )}
          <Editor onChange={setContent} />
          {actionData?.error && (
            <Alert variant="destructive" className="mt-2">
              {actionData.error}
            </Alert>
          )}
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="ml-2">Save Entry</span>
            </Button>
          </div>
        </Form>
        <div
          className={`relative transition-all duration-300 bg-muted ${isSidebarOpen ? "w-96" : "w-0 overflow-hidden"}`}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-background dark:bg-main-700 border rounded-full p-1 hover:bg-accent transition-colors"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <ChevronRight className="w-4 h-4 text-black dark:text-white" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-black dark:text-white" />
            )}
          </button>
          <div className="pl-8 text-black dark:text-white">
            <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
            <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black dark:text-white dark:bg-main-700">
                      Date
                    </TableHead>
                    <TableHead className="text-black dark:text-white dark:bg-main-700">
                      Preview
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow
                      key={entry.id}
                      className="cursor-pointer hover:bg-accent/10"
                      onClick={() => navigate(`/journal/edit/${entry.id}`)}
                    >
                      <TableCell className="whitespace-nowrap text-black dark:text-white dark:bg-main-700">
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-black dark:text-white dark:bg-main-700">
                        {entry.content.replace(/<[^>]*>/g, "")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed right-4 top-20 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105"
          aria-label="Show entry history"
        >
          <History className="w-5 h-5 text-black dark:text-white" />
        </button>
      )}
    </MainLayout>
  );
};

export default TherapeuticJournalEntry;
