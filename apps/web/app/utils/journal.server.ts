import { createCookie } from "@remix-run/node";

export const journalCookie = createCookie("selected_journal", {
  maxAge: 604_800, // one week
});

export async function getSelectedJournalId(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  return (await journalCookie.parse(cookieHeader)) || null;
}

export async function setSelectedJournalId(journalId: string) {
  return journalCookie.serialize(journalId);
}
