import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { JournalService } from "~/services/journal.service";
import { requireUserSession } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const { authToken, sessionToken } = await requireUserSession(request);
  const formData = await request.formData();
  const name = formData.get("name") as string;

  if (!name) {
    return new Response("Name is required", { status: 400 });
  }

  try {
    await JournalService.createJournal(name, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken,
      },
    });
    return redirect("/dashboard");
  } catch (error) {
    return new Response("Failed to create journal", { status: 500 });
  }
}
