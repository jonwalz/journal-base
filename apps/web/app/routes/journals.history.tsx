import {
  useLoaderData,
  useOutletContext,
  useNavigate,
  useLocation,
} from "@remix-run/react";
import { json, type DataFunctionArgs } from "@remix-run/node";
import { MainLayout } from "~/layouts/MainLayout";
import { JournalService } from "~/services/journal.service";
import { requireUserSession } from "~/services/session.server";
import { getSelectedJournalId } from "~/utils/journal.server";
import type { JournalEntry, Journal } from "~/types/journal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useEffect } from "react";

type LoaderData = {
  entries: JournalEntry[];
  selectedJournalId: string | null;
};

type ContextType = {
  journals: Journal[];
};

export const loader = async ({ request }: DataFunctionArgs) => {
  const { authToken, sessionToken } = await requireUserSession(request);
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  // Try to get journal ID from URL, fallback to cookie
  let journalId = searchParams.get("journalId");
  if (!journalId) {
    journalId = await getSelectedJournalId(request);
  }

  if (!journalId) {
    return json<LoaderData>({ entries: [], selectedJournalId: null });
  }

  const entries = (await JournalService.getEntries(journalId, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "x-session-token": sessionToken,
    },
  })) as JournalEntry[];

  return json<LoaderData>({ entries, selectedJournalId: journalId });
};

export default function JournalHistory() {
  const { entries, selectedJournalId } = useLoaderData<typeof loader>();
  const { journals } = useOutletContext<ContextType>();
  const navigate = useNavigate();
  const location = useLocation();

  // Update URL with selectedJournalId if it's not already there
  useEffect(() => {
    if (!selectedJournalId) return;

    const searchParams = new URLSearchParams(location.search);
    const journalIdFromUrl = searchParams.get("journalId");

    if (journalIdFromUrl !== selectedJournalId) {
      const newParams = new URLSearchParams(location.search);
      newParams.set("journalId", selectedJournalId);
      navigate(`${location.pathname}?${newParams.toString()}`, {
        replace: true,
      });
    }
  }, [selectedJournalId, location.search, location.pathname, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (journals.length === 0) {
    return (
      <MainLayout>
        <div className="container max-w-4xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Journal Entry History</h1>
          <p className="text-muted-foreground">
            Please create a journal first to view entries.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Journal Entry History</h1>
        <div className="rounded-md border">
          <Table className="rounded-b-md">
            <TableHeader>
              <TableRow className="bg-main dark:bg-main-700">
                <TableHead>Date</TableHead>
                <TableHead>Content</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-muted-foreground"
                  >
                    No entries found. Start by creating an entry in Today's
                    Entry.
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id} className="bg-main dark:bg-main-700">
                    <TableCell className="font-medium">
                      {formatDate(entry.createdAt)}
                    </TableCell>
                    <TableCell className="max-w-xl">
                      <div className="prose max-w-none dark:prose-invert">
                        {entry.content.length > 200
                          ? `${entry.content.substring(0, 200)}...`
                          : entry.content}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
