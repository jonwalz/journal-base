import {
  createCookieSessionStorage,
  ActionFunctionArgs,
  json,
} from "@remix-run/node";

// Create session storage for theme
const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    secure: process.env.NODE_ENV === "production",
    secrets: ["your-secret-key"], // Replace with your actual secret
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

// Action function to handle theme changes
export async function action({ request }: ActionFunctionArgs) {
  const session = await themeStorage.getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const theme = formData.get("theme");

  if (typeof theme !== "string" || !["light", "dark"].includes(theme)) {
    return json({ error: "Invalid theme value" }, { status: 400 });
  }

  session.set("theme", theme);

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await themeStorage.commitSession(session),
      },
    }
  );
}

// Loader function to get the current theme
export async function loader({ request }: ActionFunctionArgs) {
  const session = await themeStorage.getSession(request.headers.get("Cookie"));
  const theme = session.get("theme") || "light";

  return json({ theme });
}
