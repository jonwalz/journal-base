import { json } from "@remix-run/node";
import { themeCookie } from "~/utils/theme.server";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const theme = formData.get("theme");

  if (typeof theme !== "string") {
    return json({ success: false });
  }

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await themeCookie.serialize(theme),
      },
    }
  );
};
