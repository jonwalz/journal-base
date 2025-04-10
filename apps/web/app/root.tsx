import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  redirect,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import type { Journal } from "~/types/journal";
import type { IUserInfo } from "./hooks/useUserInfo";

import styles from "./tailwind.css?url";
import { themeCookie } from "./utils/theme.server";
import { ThemeProvider } from "./components/ThemeProvider";
import GoalNotificationProvider from "./components/GoalNotificationProvider";
import { JournalService } from "./services/journal.service";
import {
  requireUserSession,
  getSession,
  sessionStorage,
} from "./services/session.server";
import { Theme } from "./types";
import { UserInfoService } from "./services/user-info.service";
import { getSelectedJournalId } from "./utils/journal.server";
import { Toaster } from "sonner";

export type RootLoaderData = {
  theme: Theme;
  journals: Journal[];
  userInfo: IUserInfo;
  selectedJournalId: string | null;
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Oswald:wght@200..700&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap",
  },
  { rel: "stylesheet", href: styles },
];

export const loader = async ({ request }: { request: Request }) => {
  const theme = await themeCookie.parse(request.headers.get("Cookie"));
  const url = new URL(request.url);
  const selectedJournalId = await getSelectedJournalId(request);

  // Don't require authentication for auth routes
  if (
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/register")
  ) {
    return json<RootLoaderData>({
      theme: theme || "light",
      journals: [],
      selectedJournalId: null,
      userInfo: {
        id: "",
        userId: "",
        email: "",
        firstName: "",
        lastName: "",
        timezone: "",
        bio: null,
        growthGoals: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  try {
    const { authToken, sessionToken } = await requireUserSession(request);

    const response = await JournalService.getJournals({
      headers: {
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken,
      },
    });

    const userInfo = await UserInfoService.getUserInfo(request);

    if (!userInfo) {
      console.error("User info is null or undefined");
      throw new Error("Failed to fetch user info");
    }

    return json<RootLoaderData>({
      theme: theme || "light",
      journals: response,
      selectedJournalId,
      userInfo,
    });
  } catch (error) {
    if (error instanceof Response && error.status === 302) {
      // Pass through the redirect with cookie clearing headers
      throw error;
    }
    // For other errors, clear the session and redirect
    const session = await getSession(request);
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session),
      },
    });
  }
};

export default function App() {
  const data = useLoaderData<RootLoaderData>();

  return (
    <html lang="en" className={data.theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={data.theme}>
          <Outlet context={data} />
          {/* Pass userInfo directly to GoalNotificationProvider */}
          <GoalNotificationProvider userInfo={data.userInfo} />
          <Toaster
            position="top-right"
            toastOptions={{
              classNames: {
                // Apply styles similar to Alert component's default variant
                toast:
                  "relative rounded-base shadow-light dark:shadow-dark font-bold border-2 border-border dark:border-darkBorder p-4 bg-main dark:bg-main-700 text-black dark:text-white hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none",
                // Apply styles similar to AlertTitle
                title: "font-bold mb-1 leading-none tracking-tight",
                // Apply styles similar to AlertDescription
                description:
                  "text-sm font-base [&_p]:leading-relaxed",
                // Keep original action/close button styles for now
                actionButton:
                  "bg-white dark:bg-secondaryBlack dark:text-darkText border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none",
                closeButton:
                  "bg-transparent hover:bg-transparent text-black dark:text-white",
              },
              style: {
                padding: "1rem", // Kept padding, adjust if needed based on new classes
              },
            }}
            // Apply custom styling for all toasts
            className="custom-toaster"
          />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
