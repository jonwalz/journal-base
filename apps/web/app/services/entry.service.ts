import { ApiClient } from "~/services/api-client.server";
import { ApiError } from "~/utils/errors";

interface UpdateEntryPayload {
  content: string;
}

export const updateEntry = async (
  request: Request,
  journalId: string,
  entryId: string,
  payload: UpdateEntryPayload
) => {
  if (!payload.content) {
    throw new Error("Content is required");
  }

  try {
    await ApiClient.putProtected(
      `/journals/${journalId}/entries/${entryId}`,
      request,
      payload
    );
  } catch (error: unknown) {
    console.error("Error updating entry:", error);
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "Failed to update entry. Please try again.";
    throw new Error(errorMessage);
  }
};

export const deleteEntry = async (
  request: Request,
  journalId: string,
  entryId: string
) => {
  if (!entryId) {
    throw new Error("Entry ID is required for deletion");
  }

  try {
    await ApiClient.deleteProtected(
      `/journals/${journalId}/entries/${entryId}`,
      request
    );
  } catch (error: unknown) {
    console.error("Error deleting entry:", error);
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "Failed to delete entry. Please try again.";
    throw new Error(errorMessage);
  }
};
