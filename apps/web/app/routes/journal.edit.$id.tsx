import { useState, useEffect } from "react";
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  useActionData,
  useNavigation,
  useLoaderData,
  Link,
  useSubmit,
} from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Button } from "~/components/ui/button";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
} from "~/components/ui/modal";
import { MainLayout } from "~/layouts/MainLayout";

import { requireUserSession } from "~/services/session.server";
import { getSelectedJournalId } from "~/utils/journal.server";
import type { JournalEntry } from "~/types/journal";
import { deleteEntry, updateEntry } from "~/services/entry.service";
import { ApiClient } from "~/services/api-client.server";
import { ApiError } from "~/utils/errors";
import Editor from "~/components/ui/CustomTextEditor/RichTextEditor";

type ActionData =
  | { success: true; message: string; error?: never }
  | { success: false; error: string; message?: never };

type LoaderData = {
  entry: JournalEntry;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserSession(request);
  const entryId = params.id;
  const journalId = await getSelectedJournalId(request);

  if (!journalId) {
    throw redirect("/select-journal"); // Or handle appropriately
  }

  if (!entryId) {
    throw new Response("Entry ID not found", { status: 404 });
  }

  console.log(
    `Loader: Attempting to fetch entry ${entryId} for journal ${journalId}`
  );

  try {
    // Use ApiClient to fetch the entry
    const response = await ApiClient.getProtected<JournalEntry>(
      `/journals/${journalId}/entries/${entryId}`,
      request
    );
    // Check if response and response.data exist
    if (!response?.data) {
      throw new Response("Entry data not found in response", { status: 404 });
    }
    const entry = response.data; // Access the data property

    if (!entry) {
      throw new Response("Entry not found", { status: 404 });
    }
    return json<LoaderData>({ entry });
  } catch (e: unknown) {
    console.error("Failed to load entry:", e); // Log the error regardless

    // Handle API 404 specifically
    if (e instanceof ApiError && e.statusCode === 404) {
      throw new Response("Entry not found", { status: 404 });
    }

    // For other errors, throw a generic 500
    const errorMessage =
      e instanceof Error
        ? e.message
        : "Failed to load entry. Please try again.";
    throw new Response(errorMessage, { status: 500 });
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const journalId = await getSelectedJournalId(request);
  const entryId = params.id;

  if (!entryId) {
    return json<ActionData>({
      success: false,
      error: "Entry ID is required for this action",
    });
  }

  if (!journalId) {
    return json<ActionData>({ success: false, error: "No journal selected" });
  }

  try {
    const formData = await request.formData();
    const content = formData.get("content") as string;
    const _action = formData.get("_action") as string;

    if (_action === "delete") {
      await deleteEntry(request, journalId, entryId);
      return redirect("/journal/new"); // Redirect after successful deletion
    } else {
      // Default action is update
      await updateEntry(request, journalId, entryId, { content });
      return json<ActionData>({
        success: true,
        message: "Entry saved successfully!",
      });
    }
  } catch (error) {
    console.error("Error processing action:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred. Please try again.";
    return json<ActionData>({ success: false, error: errorMessage });
  }
};

export default function EditJournalEntry() {
  const { entry } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [content, setContent] = useState(entry.content ?? "");

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.message || "Entry saved successfully!");
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    submit(formData, { method: "post" });
  };

  const handleConfirmDelete = () => {
    const formData = new FormData();
    formData.set("_action", "delete");
    formData.set("entryId", entry.id);
    submit(formData, { method: "post", replace: true });
  };

  const isSubmitting = navigation.state === "submitting";
  const isDeleting =
    navigation.formData?.get("_action") === "delete" && isSubmitting;
  const isSaving =
    navigation.formData?.get("_action") !== "delete" && isSubmitting;

  return (
    <>
      <MainLayout>
        <div className="flex h-full relative animate-fade-in">
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-3xl p-4 md:p-8">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Link
                      to="/journal/new"
                      className="hover:opacity-80 text-gray-900 dark:text-white"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Edit Entry -{" "}
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </h1>
                  </div>
                </div>

                <Form
                  method="post"
                  onSubmit={handleSubmit}
                  className="flex-1 flex flex-col"
                >
                  <input type="hidden" name="entryId" value={entry.id} />
                  <div className="flex-1 bg-neutral-50 dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-4 min-h-[200px]">
                    <Editor
                      onChange={setContent} // Pass setContent to update state
                      initialContent={content} // Pass current content state
                    />
                  </div>
                  <div className="flex justify-between mt-4">
                    <Modal>
                      <ModalTrigger asChild>
                        <Button
                          variant="destructive"
                          type="button"
                          disabled={isSubmitting}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </ModalTrigger>
                      <ModalContent>
                        <ModalHeader>
                          <ModalTitle>Confirm Deletion</ModalTitle>
                          <ModalDescription>
                            Are you sure you want to delete this journal entry?
                            This action cannot be undone.
                          </ModalDescription>
                        </ModalHeader>
                        <ModalFooter>
                          <ModalClose asChild>
                            <Button variant="neutral" disabled={isDeleting}>
                              Cancel
                            </Button>
                          </ModalClose>
                          <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="flex items-center gap-2"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Confirm Delete
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>

                    <Link to="/journal/new">
                      <Button
                        variant="neutral"
                        type="button"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
