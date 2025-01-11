import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { setSelectedJournalId } from "~/utils/journal.server";

// Redirect GET requests to the dashboard
export const loader: LoaderFunction = async () => {
  return json({ success: true });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const journalId = formData.get("journalId");
  const action = formData.get("_action");

  if (action !== "setJournal" || !journalId || typeof journalId !== "string") {
    return json({ success: false }, { status: 400 });
  }

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await setSelectedJournalId(journalId),
      },
    }
  );
};
