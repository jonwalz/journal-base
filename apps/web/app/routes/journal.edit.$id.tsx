import { useState, useEffect } from "react";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { MainLayout } from "~/layouts/MainLayout";
import { toast } from "sonner";

import { Editor } from "~/components/ui/CustomTextEditor/RichTextEditor";
import {
  Form,
  useActionData,
  useNavigation,
  useLoaderData,
  Link,
  useSubmit,
} from "@remix-run/react";
import { ActionFunctionArgs, json, LoaderFunction } from "@remix-run/node";
import { JournalService } from "~/services/journal.service";
import { requireUserSession } from "~/services/session.server";
import { getSelectedJournalId } from "~/utils/journal.server";
import type { JournalEntry } from "~/types/journal";
import { ApiClient } from "~/services/api-client.server";
import { ApiError } from "~/utils/errors";

type ActionData =
  | { success: true; message: string; error?: never }
  | { success: false; error: string; message?: never };

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
    return json<ActionData>({
      success: false,
      error: "No journal selected",
    });
  }

  const formData = await request.formData();
  const content = formData.get("content") as string;
  const entryId = formData.get("entryId") as string;

  if (!content) {
    return json<ActionData>({
      success: false,
      error: "Content is required",
    });
  }

  try {
    await ApiClient.putProtected(
      `/journals/${journalId}/entries/${entryId}`,
      request,
      { content }
    );

    return json<ActionData>({
      success: true,
      message: "Entry saved successfully!",
    });
  } catch (error) {
    console.error("Error updating entry:", error);
    if (error instanceof ApiError) {
      return json<ActionData>({
        success: false,
        error: error.message,
      });
    }
    return json<ActionData>({
      success: false,
      error: "Failed to update entry. Please try again.",
    });
  }
};

export default function EditJournalEntry() {
  const { entry } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [content, setContent] = useState(entry.content ?? "");

  // Show toast when action data changes
  useEffect(() => {
    console.log("Action data changed:", actionData);
    if (actionData?.success) {
      console.log("Showing success toast");
      console.log("Message:", actionData.message);
      toast.success(actionData.message || "Entry saved successfully!");
    } else if (actionData?.error) {
      console.log("Showing error toast");
      toast.error(actionData.error);
    }
  }, [actionData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    const formData = new FormData(e.currentTarget);
    submit(formData, { method: "post" });
    console.log("Form data submitted to Remix");
  };

  const isSubmitting = navigation.state === "submitting";

  return (
    <MainLayout>
      <div className="flex h-full relative animate-fade-in">
        {/* Main content area with constrained width */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-3xl p-4 md:p-8">
            <div className="flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="flex items-center gap-2">
                  <Link
                    to="/todays-entry"
                    className="hover:opacity-80 text-gray-900 dark:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Edit Entry - {new Date(entry.createdAt).toLocaleDateString()}
                  </h1>
                </div>
              </div>

              <div className="flex-1 bg-neutral-50 dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-4">
                <Editor onChange={setContent} initialContent={entry.content} />
              </div>
              
              <Form
                onSubmit={handleSubmit}
                method="post"
                className="flex items-center gap-2 justify-end"
              >
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
        </div>
      </div>
    </MainLayout>
  );
}
