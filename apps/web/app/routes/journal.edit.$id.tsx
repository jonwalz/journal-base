import { useState } from "react";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Alert } from "~/components/ui/alerts";
import { MainLayout } from "~/layouts/MainLayout";

import { Editor } from "~/components/ui/CustomTextEditor/RichTextEditor";
import {
  Form,
  useActionData,
  useNavigation,
  useLoaderData,
  Link,
} from "@remix-run/react";
import { ActionFunctionArgs, json, LoaderFunction } from "@remix-run/node";
import { JournalService } from "~/services/journal.service";
import { requireUserSession } from "~/services/session.server";
import { getSelectedJournalId } from "~/utils/journal.server";
import type { JournalEntry } from "~/types/journal";

type ActionData =
  | { success: true; error?: never }
  | { success?: never; error: string };

type LoaderData = {
  entry: JournalEntry;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await requireUserSession(request);
  const journalId = await getSelectedJournalId(request);

  if (!journalId) {
    throw new Error("No journal selected");
  }

  const entryId = params.id;
  if (!entryId) {
    throw new Error("No entry ID provided");
  }

  const entries = await JournalService.getEntries(journalId, {
    headers: {
      Authorization: `Bearer ${session.authToken}`,
      "x-session-token": session.sessionToken,
    },
  });

  const entry = entries.find((e) => e.id === entryId);

  if (!entry) {
    throw new Error("Entry not found");
  }

  return json<LoaderData>({ entry });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await requireUserSession(request);
  const journalId = await getSelectedJournalId(request);

  if (!journalId) {
    return json<ActionData>({ error: "No journal selected" });
  }

  const formData = await request.formData();
  const content = formData.get("content") as string;
  const entryId = formData.get("entryId") as string;

  if (!content) {
    return json<ActionData>({ error: "Content is required" });
  }

  try {
    const journalService = new JournalService();
    // TODO: Implement updateEntry in JournalService
    await JournalService.updateEntry(journalId, entryId, content, {
      headers: {
        Authorization: `Bearer ${session.authToken}`,
        "x-session-token": session.sessionToken,
      },
    });
    return json<ActionData>({ success: true });
  } catch (error) {
    return json<ActionData>({ error: "Failed to update entry" });
  }
};

export default function EditJournalEntry() {
  const { entry } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const [content, setContent] = useState(entry.content ?? "");

  console.log("Entry: ", entry);

  const isSubmitting = navigation.state === "submitting";

  return (
    <MainLayout>
      <div className="flex flex-col h-full container m-auto">
        <div className="flex items-center p-4">
          <div className="flex items-center gap-2">
            <Link to="/todays-entry" className="hover:opacity-80">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-semibold">
              Edit Entry - {new Date(entry.createdAt).toLocaleDateString()}
            </h1>
          </div>
        </div>

        {actionData?.error && (
          <Alert variant="destructive" className="m-4">
            {actionData.error}
          </Alert>
        )}

        <div className="flex-1 p-4">
          <Editor onChange={setContent} initialContent={entry.content} />
        </div>
        <div className="p-4">
          <Form method="post" className="flex items-center gap-2 justify-end">
            <input type="hidden" name="content" value={content} />
            <input type="hidden" name="entryId" value={entry.id} />
            <Link to="/todays-entry">
              <Button variant="neutral" type="button">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </Form>
        </div>
      </div>
    </MainLayout>
  );
}
