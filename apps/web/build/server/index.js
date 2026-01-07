import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, createCookie, createCookieSessionStorage, redirect, json as json$1 } from "@remix-run/node";
import { RemixServer, useFetcher, Link, useLocation, useLoaderData, Meta, Links, Outlet, ScrollRestoration, Scripts, json, redirect as redirect$1, useOutletContext, Form as Form$1, useNavigate, useActionData, useNavigation, useSubmit, useSearchParams } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Toaster, toast } from "sonner";
import { Monitoring } from "react-scan/monitoring/remix";
import * as React from "react";
import { useState, useEffect, createContext, useContext, useRef, useCallback } from "react";
import { X, PanelLeft, ChevronRight, Book, Target, MessageCircle, Check, Circle, ChevronsUpDown, Plus, BadgeCheck, CreditCard, Bell, Moon, Sun, LogOut, ArrowLeft, Trash2, Loader2, Save, ChevronDown, Calendar, Clock, History, ChevronLeft } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, CAN_UNDO_COMMAND, CAN_REDO_COMMAND, UNDO_COMMAND, REDO_COMMAND, FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, $getRoot, $createParagraphNode, $createTextNode, ParagraphNode, TextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { mergeRegister } from "@lexical/utils";
import ReactMarkdown from "react-markdown";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) : handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext);
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const {
      pipe,
      abort
    } = renderToPipeableStream(/* @__PURE__ */ jsx(RemixServer, {
      context: remixContext,
      url: request.url,
      abortDelay: ABORT_DELAY
    }), {
      onAllReady() {
        shellRendered = true;
        const body = new PassThrough();
        const stream = createReadableStreamFromReadable(body);
        responseHeaders.set("Content-Type", "text/html");
        resolve(new Response(stream, {
          headers: responseHeaders,
          status: responseStatusCode
        }));
        pipe(body);
      },
      onShellError(error) {
        reject(error);
      },
      onError(error) {
        responseStatusCode = 500;
        if (shellRendered) {
          console.error(error);
        }
      }
    });
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const {
      pipe,
      abort
    } = renderToPipeableStream(/* @__PURE__ */ jsx(RemixServer, {
      context: remixContext,
      url: request.url,
      abortDelay: ABORT_DELAY
    }), {
      onShellReady() {
        shellRendered = true;
        const body = new PassThrough();
        const stream = createReadableStreamFromReadable(body);
        responseHeaders.set("Content-Type", "text/html");
        resolve(new Response(stream, {
          headers: responseHeaders,
          status: responseStatusCode
        }));
        pipe(body);
      },
      onShellError(error) {
        reject(error);
      },
      onError(error) {
        responseStatusCode = 500;
        if (shellRendered) {
          console.error(error);
        }
      }
    });
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const styles = "/assets/tailwind-Bo3B3Fcp.css";
const themeCookie = createCookie("theme", {
  maxAge: 3456e4
  // 400 days
});
const themeConfig = {
  defaultTheme: "light"
};
const config = {
  theme: themeConfig
};
const ThemeContext = createContext({
  theme: config.theme.defaultTheme,
  setTheme: () => {
  },
  toggleTheme: () => {
  }
});
const ThemeProvider = ({
  children,
  theme: initialTheme
}) => {
  const [theme, setTheme] = useState(initialTheme);
  const fetcher = useFetcher();
  useEffect(() => {
    if (theme) {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme]);
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    fetcher.submit({
      theme: newTheme
    }, {
      action: "/set-theme",
      method: "post"
    });
  };
  return /* @__PURE__ */ jsx(ThemeContext.Provider, {
    value: {
      theme,
      setTheme,
      toggleTheme
    },
    children
  });
};
try {
  ThemeProvider.displayName = "ThemeProvider";
} catch (error) {
}
const useTheme = () => useContext(ThemeContext);
function GoalNotification({
  newGoalsCount
}) {
  const [isVisible, setIsVisible] = useState(true);
  if (newGoalsCount === 0 || !isVisible) return null;
  return /* @__PURE__ */ jsx("div", {
    className: "fixed bottom-4 right-4 bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-300 rounded-md p-4 max-w-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] animate-slide-in",
    children: /* @__PURE__ */ jsxs("div", {
      className: "flex justify-between items-start gap-4",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("h3", {
          className: "font-semibold text-lg text-black dark:text-white",
          children: "New Growth Goals Available"
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-sm text-neutral-800 dark:text-neutral-200 mt-1",
          children: [newGoalsCount, " new goal", newGoalsCount > 1 ? "s" : "", " generated based on your journal entries."]
        }), /* @__PURE__ */ jsx(Link, {
          to: "/goal-tracking",
          className: "mt-3 inline-block px-3 py-1 bg-blue-500 text-white border-2 border-black dark:border-neutral-300 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] hover:bg-blue-600 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 text-sm font-medium",
          children: "View Goals"
        })]
      }), /* @__PURE__ */ jsxs("button", {
        onClick: () => setIsVisible(false),
        className: "text-black dark:text-white flex-shrink-0 p-1 border-2 border-black dark:border-neutral-300 rounded-md bg-neutral-200 dark:bg-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150",
        "aria-label": "Close notification",
        children: [/* @__PURE__ */ jsx("span", {
          className: "sr-only",
          children: "Close"
        }), /* @__PURE__ */ jsx("svg", {
          className: "h-4 w-4",
          viewBox: "0 0 20 20",
          fill: "currentColor",
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsx("path", {
            fillRule: "evenodd",
            d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
            clipRule: "evenodd"
          })
        })]
      })]
    })
  });
}
try {
  GoalNotification.displayName = "GoalNotification";
} catch (error) {
}
function GoalNotificationProvider({
  userInfo
}) {
  const [newGoalsCount, setNewGoalsCount] = useState(0);
  const location = useLocation();
  const fetcher = useFetcher();
  const lastFetchTimeRef = useRef(0);
  const isMountedRef = useRef(false);
  const fetchTimeoutRef = useRef(null);
  const shouldFetchGoals = () => {
    if (location.pathname === "/goal-tracking") {
      return false;
    }
    if (!userInfo?.userId) {
      return false;
    }
    if (fetcher.state !== "idle") {
      return false;
    }
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 1e4) {
      return false;
    }
    return true;
  };
  const fetchNewGoals = () => {
    if (shouldFetchGoals()) {
      lastFetchTimeRef.current = Date.now();
      fetcher.load(`/api/goals/new-count?userId=${userInfo.userId}&_t=${Date.now()}`);
    }
  };
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }
    if (location.pathname === "/goal-tracking") {
      setNewGoalsCount(0);
      return;
    }
    if (!userInfo?.userId) {
      return;
    }
    fetchTimeoutRef.current = setTimeout(() => {
      fetchNewGoals();
      const intervalId = setInterval(fetchNewGoals, 5 * 60 * 1e3);
      return () => clearInterval(intervalId);
    }, 2e3);
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
    };
  }, [location.pathname, userInfo?.userId]);
  useEffect(() => {
    if (fetcher.data && typeof fetcher.data === "object" && "count" in fetcher.data) {
      setNewGoalsCount(fetcher.data.count);
    }
  }, [fetcher.data]);
  return /* @__PURE__ */ jsx(GoalNotification, {
    newGoalsCount
  });
}
try {
  GoalNotificationProvider.displayName = "GoalNotificationProvider";
} catch (error) {
}
class JournalServiceError extends Error {
  constructor(message, originalError) {
    super(message);
    this.originalError = originalError;
    this.name = "JournalServiceError";
  }
}
class ApiError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
class AuthenticationError extends ApiError {
  constructor(message = "Authentication failed") {
    super(401, "AUTHENTICATION_ERROR", message);
    this.name = "AuthenticationError";
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
class AuthService {
  static async signUp(data) {
    const response = await ApiClient.post("/auth/signup", data);
    return response.data;
  }
  static async login(data) {
    const response = await ApiClient.post("/auth/login", data);
    return response.data;
  }
  // A method to verify the user's session token
  static async verifySessionToken(sessionToken) {
    const response = await ApiClient.post(
      "/auth/verify-session-token",
      {},
      { headers: { "x-session-token": sessionToken } }
    );
    return response.data;
  }
  // A method to verify the users auth token
  static async verifyAuthToken(authToken) {
    const response = await ApiClient.post(
      "/auth/verify-auth-token",
      {},
      { headers: { Authorization: authToken } }
    );
    return response.data;
  }
}
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "auth_session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    // 30 days
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production"
  }
});
async function getSession(request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}
async function setAuthTokens(request, authToken, sessionToken, userId) {
  const session = await getSession(request);
  session.set("authToken", authToken);
  session.set("sessionToken", sessionToken);
  if (userId) {
    session.set("userId", userId);
  }
  return sessionStorage.commitSession(session);
}
async function getAuthToken(request) {
  const session = await getSession(request);
  return session.get("authToken");
}
async function getSessionToken(request) {
  const session = await getSession(request);
  return session.get("sessionToken");
}
async function requireUserSession(request, redirectTo = "/login") {
  const session = await getSession(request);
  const authToken = session.get("authToken");
  const sessionToken = session.get("sessionToken");
  if (!authToken || !sessionToken) {
    throw redirect(redirectTo, {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session)
      }
    });
  }
  try {
    await Promise.all([
      AuthService.verifyAuthToken(authToken),
      AuthService.verifySessionToken(sessionToken)
    ]);
    const userId = session.get("userId");
    console.log("Current session userId:", userId);
    return { authToken, sessionToken, userId };
  } catch (error) {
    throw redirect(redirectTo, {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session)
      }
    });
  }
}
async function logout(request) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}
const API_BASE_URL = process.env.API_URL || "http://localhost:3030";
console.log("API_BASE_URL", API_BASE_URL);
class ApiClient {
  static async request(endpoint, options = {}) {
    const { data, headers: customHeaders, ...customOptions } = options;
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        ...customHeaders
      },
      credentials: "include"
    };
    const fetchOptions = {
      ...defaultOptions,
      ...customOptions
    };
    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthenticationError("Your session has expired. Please log in again.");
      }
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new ApiError(response.status, "API_ERROR", errorData.message || "An error occurred");
    }
    if (response.status === 204) {
      return {
        data: null,
        // Explicitly cast null to T for type safety
        headers: Object.fromEntries(response.headers.entries())
      };
    }
    const responseData = await response.json();
    return {
      data: responseData,
      headers: Object.fromEntries(response.headers.entries())
    };
  }
  static async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }
  static async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      data
    });
  }
  static async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      data
    });
  }
  static async delete(endpoint, options = {}) {
    await this.request(endpoint, { ...options, method: "DELETE" });
  }
  static async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      data
    });
  }
  static async addAuthHeaders(options = {}, request) {
    const session = await getSession(request);
    const authToken = session.get("authToken");
    const sessionToken = session.get("sessionToken");
    if (!authToken || !sessionToken) {
      throw new Error("No auth token or session token found");
    }
    return {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken
      }
    };
  }
  static async getProtected(endpoint, request, options) {
    const protectedOptions = await this.addAuthHeaders(options || {}, request);
    return this.request(endpoint, { ...protectedOptions, method: "GET" });
  }
  static async postProtected(endpoint, request, data, options) {
    const protectedOptions = await this.addAuthHeaders(options || {}, request);
    return this.request(endpoint, {
      ...protectedOptions,
      method: "POST",
      data
    });
  }
  static async putProtected(endpoint, request, data, options) {
    const protectedOptions = await this.addAuthHeaders(options || {}, request);
    return this.request(endpoint, {
      ...protectedOptions,
      method: "PUT",
      data
    });
  }
  static async deleteProtected(endpoint, request, options) {
    const protectedOptions = await this.addAuthHeaders(options || {}, request);
    return this.request(endpoint, { ...protectedOptions, method: "DELETE" });
  }
}
class JournalService {
  static async getJournals(options = {}) {
    try {
      const response = await ApiClient.get("/journals", options);
      return response.data;
    } catch (error) {
      throw new JournalServiceError("Failed to fetch journals", error);
    }
  }
  static async getJournalById(id) {
    try {
      const response = await ApiClient.get(`/journals/${id}`);
      return response.data;
    } catch (error) {
      throw new JournalServiceError(
        `Failed to fetch journal with id ${id}`,
        error
      );
    }
  }
  static async createJournal(name, options = {}) {
    try {
      const response = await ApiClient.post(
        "/journals",
        { title: name },
        options
      );
      return response.data;
    } catch (error) {
      throw new JournalServiceError("Failed to create journal", error);
    }
  }
  static async updateJournal(id, input) {
    try {
      const response = await ApiClient.put(`/journals/${id}`, input);
      return response.data;
    } catch (error) {
      throw new JournalServiceError(
        `Failed to update journal with id ${id}`,
        error
      );
    }
  }
  static async deleteJournal(id) {
    try {
      await ApiClient.delete(`/journals/${id}`);
    } catch (error) {
      throw new JournalServiceError(
        `Failed to delete journal with id ${id}`,
        error
      );
    }
  }
  static async createEntry(journalId, content, options = {}) {
    try {
      const response = await ApiClient.post(
        `/journals/${journalId}/entries`,
        {
          content
        },
        options
      );
      return response.data;
    } catch (error) {
      throw new JournalServiceError("Failed to create journal entry", error);
    }
  }
  static async updateEntry(journalId, entryId, content, options = {}) {
    try {
      const response = await ApiClient.put(
        `/journals/${journalId}/entries/${entryId}`,
        { content },
        options
      );
      return response.data;
    } catch (error) {
      throw new JournalServiceError("Failed to update journal entry", error);
    }
  }
  static async getEntries(journalId, options = {}) {
    try {
      const response = await ApiClient.get(`/journals/${journalId}/entries`, options);
      return response.data;
    } catch (error) {
      throw new JournalServiceError("Failed to fetch journal entries", error);
    }
  }
}
class UserInfoServiceError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "UserInfoServiceError";
  }
}
class UserInfoService {
  static async getUserInfo(request) {
    try {
      const response = await ApiClient.getProtected(
        "/user-info",
        request
      );
      const userInfo = response.data;
      userInfo.createdAt = new Date(userInfo.createdAt);
      userInfo.updatedAt = new Date(userInfo.updatedAt);
      return userInfo;
    } catch (error) {
      throw new UserInfoServiceError("Failed to fetch user info", error);
    }
  }
  static async updateUserInfo(request, data) {
    try {
      const response = await ApiClient.postProtected(
        "/user-info",
        request,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          timezone: data.timezone,
          bio: data.bio
        }
      );
      const userInfo = response.data.data;
      userInfo.createdAt = new Date(userInfo.createdAt);
      userInfo.updatedAt = new Date(userInfo.updatedAt);
      return userInfo;
    } catch (error) {
      throw new UserInfoServiceError("Failed to update user info", error);
    }
  }
}
const journalCookie = createCookie("selected_journal", {
  maxAge: 604800
  // one week
});
async function getSelectedJournalId(request) {
  const cookieHeader = request.headers.get("Cookie");
  return await journalCookie.parse(cookieHeader) || null;
}
async function setSelectedJournalId(journalId) {
  return journalCookie.serialize(journalId);
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Oswald:wght@200..700&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap"
}, {
  rel: "stylesheet",
  href: styles
}];
const loader$b = async ({
  request
}) => {
  const theme = await themeCookie.parse(request.headers.get("Cookie"));
  const url = new URL(request.url);
  const selectedJournalId = await getSelectedJournalId(request);
  if (url.pathname.startsWith("/login") || url.pathname.startsWith("/register")) {
    return json({
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
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
  }
  try {
    const {
      authToken,
      sessionToken
    } = await requireUserSession(request);
    const response = await JournalService.getJournals({
      headers: {
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken
      }
    });
    const userInfo = await UserInfoService.getUserInfo(request);
    if (!userInfo) {
      console.error("User info is null or undefined");
      throw new Error("Failed to fetch user info");
    }
    return json({
      theme: theme || "light",
      journals: response,
      selectedJournalId,
      userInfo
    });
  } catch (error) {
    if (error instanceof Response && error.status === 302) {
      throw error;
    }
    const session = await getSession(request);
    throw redirect$1("/login", {
      headers: {
        "Set-Cookie": await sessionStorage.destroySession(session)
      }
    });
  }
};
function App() {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    className: data.theme,
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {}), /* @__PURE__ */ jsx("script", {
        src: "https://unpkg.com/react-scan/dist/install-hook.global.js"
      })]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx(Monitoring, {
        apiKey: "KJ9tSQilGp8tfDytYNJDY3YPKZTt4SA5",
        url: "https://monitoring.react-scan.com/api/v1/ingest"
      }), /* @__PURE__ */ jsxs(ThemeProvider, {
        theme: data.theme,
        children: [/* @__PURE__ */ jsx(Outlet, {
          context: data
        }), /* @__PURE__ */ jsx(GoalNotificationProvider, {
          userInfo: data.userInfo
        }), /* @__PURE__ */ jsx(Toaster, {
          position: "top-right",
          toastOptions: {
            classNames: {
              // Apply styles similar to Alert component's default variant
              toast: "relative rounded-base shadow-light dark:shadow-dark font-bold border-2 border-border dark:border-darkBorder p-4 bg-main dark:bg-main-700 text-black dark:text-white hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none",
              // Apply styles similar to AlertTitle
              title: "font-bold mb-1 leading-none tracking-tight",
              // Apply styles similar to AlertDescription
              description: "text-sm font-base [&_p]:leading-relaxed",
              // Keep original action/close button styles for now
              actionButton: "bg-white dark:bg-secondaryBlack dark:text-darkText border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none",
              closeButton: "bg-transparent hover:bg-transparent text-black dark:text-white"
            },
            style: {
              padding: "1rem"
              // Kept padding, adjust if needed based on new classes
            }
          },
          className: "custom-toaster"
        })]
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
try {
  App.displayName = "App";
} catch (error) {
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App,
  links,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
let GoalServiceError$1 = class GoalServiceError extends Error {
  constructor(message, originalError) {
    super(message);
    this.originalError = originalError;
    this.name = "GoalServiceError";
  }
};
let GoalService$1 = class GoalService {
  static async getGoals(filters, options = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        if (filters.status && filters.status !== "all") {
          queryParams.append("status", filters.status);
        }
        if (filters.dateRange && filters.dateRange !== "all") {
          queryParams.append("dateRange", filters.dateRange);
        }
        if (filters.metricType && filters.metricType !== "all") {
          queryParams.append("metricType", filters.metricType);
        }
      }
      const response = await ApiClient.get(`/goals?${queryParams}`, options);
      return response.data.goals || [];
    } catch (error) {
      throw new GoalServiceError$1("Failed to fetch goals", error);
    }
  }
  static async acceptGoal(goalId, options = {}) {
    try {
      console.log(`Sending acceptGoal request for goal ID: ${goalId}`);
      const response = await ApiClient.post(`/api/goals/${goalId}/accept`, {}, options);
      console.log("Response data:", response.data);
      if (!response.data.goal) {
        console.error("Response missing goal data:", response.data);
        throw new Error("Response missing goal data");
      }
      return response.data.goal;
    } catch (error) {
      console.error("Error in acceptGoal:", error);
      throw new GoalServiceError$1(
        `Failed to accept goal with id ${goalId}`,
        error
      );
    }
  }
  static async completeGoal(goalId, options = {}) {
    try {
      console.log(`Sending completeGoal request for goal ID: ${goalId}`);
      const response = await ApiClient.post(`/api/goals/${goalId}/complete`, {}, options);
      console.log("Response data:", response.data);
      if (!response.data.goal) {
        console.error("Response missing goal data:", response.data);
        throw new Error("Response missing goal data");
      }
      return response.data.goal;
    } catch (error) {
      console.error("Error in completeGoal:", error);
      throw new GoalServiceError$1(
        `Failed to complete goal with id ${goalId}`,
        error
      );
    }
  }
  static async deleteGoal(goalId, options = {}) {
    try {
      console.log(`Sending deleteGoal request for goal ID: ${goalId}`);
      await ApiClient.delete(`/api/goals/${goalId}`, options);
      console.log("Goal deleted successfully");
    } catch (error) {
      console.error("Error in deleteGoal:", error);
      throw new GoalServiceError$1(
        `Failed to delete goal with id ${goalId}`,
        error
      );
    }
  }
  static async getNewGoalsCount(userId, options = {}) {
    try {
      if (!userId) {
        return 0;
      }
      const response = await ApiClient.get(`/api/goals/new-count?userId=${userId}`, options);
      return response.data.count || 0;
    } catch (error) {
      console.error("Failed to get new goals count:", error);
      return 0;
    }
  }
  static async generateGoals(entryId, options = {}) {
    try {
      const response = await ApiClient.post("/api/goals/generate", { entryId }, options);
      return response.data.goals || [];
    } catch (error) {
      throw new GoalServiceError$1(
        `Failed to generate goals for entry ${entryId}`,
        error
      );
    }
  }
  static async getGoalAnalytics(userId, options = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("userId", userId);
      const response = await ApiClient.get(`/api/goals/analytics?${queryParams}`, options);
      return response.data;
    } catch (error) {
      throw new GoalServiceError$1("Failed to fetch goal analytics", error);
    }
  }
};
const loader$a = async ({ request }) => {
  const { authToken, sessionToken } = await requireUserSession(request);
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  if (!userId) {
    return json$1({ error: "User ID is required" }, { status: 400 });
  }
  try {
    const count = await GoalService$1.getNewGoalsCount(
      userId,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "x-session-token": sessionToken
        }
      }
    );
    return json$1({ count }, {
      headers: {
        "Cache-Control": "max-age=60, s-maxage=60"
        // Cache for 60 seconds
      }
    });
  } catch (error) {
    console.error("Failed to get new goals count:", error);
    return json$1({ error: "Failed to get new goals count" }, { status: 500 });
  }
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva("inline-flex items-center text-text justify-center whitespace-nowrap rounded-base text-sm font-base ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      default: "bg-main dark:bg-main-700 text-black dark:text-white border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none",
      noShadow: "bg-main dark:bg-main-700 text-black dark:text-white border-2 border-border dark:border-darkBorder",
      neutral: "bg-white dark:bg-secondaryBlack dark:text-darkText border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none",
      reverse: "bg-main dark:bg-main-700 text-black dark:text-white border-2 border-border dark:border-darkBorder hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-light dark:hover:shadow-dark",
      destructive: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800/50 shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none"
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
      icon: "h-10 w-10"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
const Button = React.forwardRef(({
  className,
  variant,
  size,
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(Comp, {
    className: cn(buttonVariants({
      variant,
      size,
      className
    })),
    ref,
    ...props
  });
});
Button.displayName = "Button";
const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalPortal = DialogPrimitive.Portal;
const ModalClose = DialogPrimitive.Close;
const ModalOverlay = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Overlay, {
  ref,
  className: cn("fixed inset-0 z-50 bg-black/60 dark:bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
  ...props
}));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;
const ModalContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => /* @__PURE__ */ jsxs(ModalPortal, {
  children: [/* @__PURE__ */ jsx(ModalOverlay, {}), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
    ref,
    className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border-2 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack p-6 shadow-light dark:shadow-dark duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-base", className),
    ...props,
    children: [children, /* @__PURE__ */ jsxs(DialogPrimitive.Close, {
      className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white dark:ring-offset-secondaryBlack transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-main focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:data-[state=open]:bg-darkBorder dark:data-[state=open]:text-neutral-400",
      children: [/* @__PURE__ */ jsx(X, {
        className: "h-4 w-4"
      }), /* @__PURE__ */ jsx("span", {
        className: "sr-only",
        children: "Close"
      })]
    })]
  })]
}));
ModalContent.displayName = DialogPrimitive.Content.displayName;
const ModalHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx("div", {
  className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
  ...props
});
ModalHeader.displayName = "ModalHeader";
const ModalFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx("div", {
  className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
  ...props
});
ModalFooter.displayName = "ModalFooter";
const ModalTitle = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Title, {
  ref,
  className: cn("text-lg font-semibold leading-none tracking-tight text-black dark:text-white", className),
  ...props
}));
ModalTitle.displayName = DialogPrimitive.Title.displayName;
const ModalDescription = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Description, {
  ref,
  className: cn("text-sm text-neutral-600 dark:text-darkText", className),
  ...props
}));
ModalDescription.displayName = DialogPrimitive.Description.displayName;
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(void 0);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
const Input = React.forwardRef(({
  className,
  type,
  ...props
}, ref) => {
  return /* @__PURE__ */ jsx("input", {
    type,
    className: cn("flex h-10 w-full rounded-base border-2 text-text dark:text-darkText font-base selection:bg-main selection:text-black border-border dark:border-[#404040] bg-white dark:bg-secondaryBlack px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
    ref,
    ...props
  });
});
Input.displayName = "Input";
const Separator = React.forwardRef(({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}, ref) => /* @__PURE__ */ jsx(SeparatorPrimitive.Root, {
  ref,
  decorative,
  orientation,
  className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
  ...props
}));
Separator.displayName = SeparatorPrimitive.Root.displayName;
const Sheet = DialogPrimitive.Root;
const SheetPortal = DialogPrimitive.Portal;
const SheetOverlay = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Overlay, {
  className: cn("fixed inset-0 z-50 bg-overlay font-bold data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
  ...props,
  ref
}));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;
const sheetVariants = cva("fixed z-50 gap-4 bg-white dark:bg-secondaryBlack text-text dark:text-darkText p-6 transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500", {
  variants: {
    side: {
      top: "inset-x-0 top-0 border-b-2 border-b-black data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
      bottom: "inset-x-0 bottom-0 border-t-2 border-t-black data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      left: "inset-y-0 left-0 h-full w-3/4 border-r-2 border-r-black data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
      right: "inset-y-0 right-0 h-full w-3/4 border-l-2 border-l-black data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
    }
  },
  defaultVariants: {
    side: "right"
  }
});
const SheetContent = React.forwardRef(({
  side = "right",
  className,
  children,
  ...props
}, ref) => /* @__PURE__ */ jsxs(SheetPortal, {
  children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
    ref,
    className: cn(sheetVariants({
      side
    }), className),
    ...props,
    children: [children, /* @__PURE__ */ jsxs(DialogPrimitive.Close, {
      className: "absolute right-4 top-4 rounded-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-white",
      children: [/* @__PURE__ */ jsx(X, {
        className: "h-4 w-4"
      }), /* @__PURE__ */ jsx("span", {
        className: "sr-only",
        children: "Close"
      })]
    })]
  })]
}));
SheetContent.displayName = DialogPrimitive.Content.displayName;
const SheetTitle = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Title, {
  ref,
  className: cn("text-lg font-bold text-text dark:text-darkText", className),
  ...props
}));
SheetTitle.displayName = DialogPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Description, {
  ref,
  className: cn("text-sm font-base text-text dark:text-darkText", className),
  ...props
}));
SheetDescription.displayName = DialogPrimitive.Description.displayName;
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx("div", {
    className: cn("animate-pulse rounded-base bg-white dark:bg-secondaryBlack border-2 border-border dark:border-darkBorder", className),
    ...props
  });
}
try {
  Skeleton.displayName = "Skeleton";
} catch (error) {
}
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({
  className,
  sideOffset = 4,
  ...props
}, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Content, {
  ref,
  sideOffset,
  className: cn("z-50 overflow-hidden rounded-base border-2 border-border dark:border-darkBorder bg-main px-3 py-1.5 text-sm font-base text-black animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
  ...props
}));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
const SidebarProvider = React.forwardRef(({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}, ref) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback((value) => {
    const openState = typeof value === "function" ? value(open) : value;
    if (setOpenProp) {
      setOpenProp(openState);
    } else {
      _setOpen(openState);
    }
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  }, [setOpenProp, open]);
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen, setOpenMobile]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo(() => ({
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar
  }), [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]);
  return /* @__PURE__ */ jsx(SidebarContext.Provider, {
    value: contextValue,
    children: /* @__PURE__ */ jsx(TooltipProvider, {
      delayDuration: 0,
      children: /* @__PURE__ */ jsx("div", {
        style: {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style
        },
        className: cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className),
        ref,
        ...props,
        children
      })
    })
  });
});
SidebarProvider.displayName = "SidebarProvider";
const Sidebar = React.forwardRef(({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}, ref) => {
  const {
    isMobile,
    state,
    openMobile,
    setOpenMobile
  } = useSidebar();
  if (collapsible === "none") {
    return /* @__PURE__ */ jsx("div", {
      className: cn("flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground", className),
      ref,
      ...props,
      children
    });
  }
  if (isMobile) {
    return /* @__PURE__ */ jsx(Sheet, {
      open: openMobile,
      onOpenChange: setOpenMobile,
      ...props,
      children: /* @__PURE__ */ jsx(SheetContent, {
        "data-sidebar": "sidebar",
        "data-mobile": "true",
        className: cn("w-[--sidebar-width] bg-background p-0 [&>button]:hidden", className),
        style: {
          "--sidebar-width": SIDEBAR_WIDTH_MOBILE
        },
        side,
        onOpenAutoFocus: (e) => e.preventDefault(),
        children: /* @__PURE__ */ jsx("div", {
          className: "flex h-full w-full flex-col",
          children
        })
      })
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    ref,
    className: "group peer hidden md:block text-sidebar-foreground",
    "data-state": state,
    "data-collapsible": state === "collapsed" ? collapsible : "",
    "data-variant": variant,
    "data-side": side,
    children: [/* @__PURE__ */ jsx("div", {
      className: cn("duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]")
    }), /* @__PURE__ */ jsx("div", {
      className: cn(
        "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
        side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
        // Adjust the padding for floating and inset variants.
        variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx("div", {
        "data-sidebar": "sidebar",
        className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
        children
      })
    })]
  });
});
Sidebar.displayName = "Sidebar";
const SidebarTrigger = React.forwardRef(({
  className,
  onClick,
  ...props
}, ref) => {
  const {
    toggleSidebar
  } = useSidebar();
  return /* @__PURE__ */ jsxs(Button, {
    ref,
    "data-sidebar": "trigger",
    variant: "default",
    size: "icon",
    className: cn("h-7 w-7", className),
    onClick: (event) => {
      onClick?.(event);
      toggleSidebar();
    },
    ...props,
    children: [/* @__PURE__ */ jsx(PanelLeft, {}), /* @__PURE__ */ jsx("span", {
      className: "sr-only",
      children: "Toggle Sidebar"
    })]
  });
});
SidebarTrigger.displayName = "SidebarTrigger";
const SidebarRail = React.forwardRef(({
  className,
  ...props
}, ref) => {
  const {
    toggleSidebar
  } = useSidebar();
  return /* @__PURE__ */ jsx("button", {
    ref,
    "data-sidebar": "rail",
    "aria-label": "Toggle Sidebar",
    tabIndex: -1,
    onClick: toggleSidebar,
    title: "Toggle Sidebar",
    className: cn("absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex", "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className),
    ...props
  });
});
SidebarRail.displayName = "SidebarRail";
const SidebarInset = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /* @__PURE__ */ jsx("main", {
    ref,
    className: cn("relative flex min-h-svh flex-1 flex-col bg-background", "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow", className),
    ...props
  });
});
SidebarInset.displayName = "SidebarInset";
const SidebarInput = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /* @__PURE__ */ jsx(Input, {
    ref,
    "data-sidebar": "input",
    className: cn("h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", className),
    ...props
  });
});
SidebarInput.displayName = "SidebarInput";
const SidebarHeader = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /* @__PURE__ */ jsx("div", {
    ref,
    "data-sidebar": "header",
    className: cn("flex flex-col gap-2 p-2", className),
    ...props
  });
});
SidebarHeader.displayName = "SidebarHeader";
const SidebarFooter = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /* @__PURE__ */ jsx("div", {
    ref,
    "data-sidebar": "footer",
    className: cn("flex flex-col gap-2 p-2", className),
    ...props
  });
});
SidebarFooter.displayName = "SidebarFooter";
const SidebarSeparator = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /* @__PURE__ */ jsx(Separator, {
    ref,
    "data-sidebar": "separator",
    className: cn("mx-2 w-auto bg-sidebar-border", className),
    ...props
  });
});
SidebarSeparator.displayName = "SidebarSeparator";
const SidebarContent = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /* @__PURE__ */ jsx("div", {
    ref,
    "data-sidebar": "content",
    className: cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
    ...props
  });
});
SidebarContent.displayName = "SidebarContent";
const SidebarGroup = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /* @__PURE__ */ jsx("div", {
    ref,
    "data-sidebar": "group",
    className: cn("relative flex w-full min-w-0 flex-col p-2", className),
    ...props
  });
});
SidebarGroup.displayName = "SidebarGroup";
const SidebarGroupLabel = React.forwardRef(({
  className,
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "div";
  return /* @__PURE__ */ jsx(Comp, {
    ref,
    "data-sidebar": "group-label",
    className: cn("duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
    ...props
  });
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
const SidebarGroupAction = React.forwardRef(({
  className,
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(Comp, {
    ref,
    "data-sidebar": "group-action",
    className: cn(
      "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
      // Increases the hit area of the button on mobile.
      "after:absolute after:-inset-2 after:md:hidden",
      "group-data-[collapsible=icon]:hidden",
      className
    ),
    ...props
  });
});
SidebarGroupAction.displayName = "SidebarGroupAction";
const SidebarGroupContent = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx("div", {
  ref,
  "data-sidebar": "group-content",
  className: cn("w-full text-sm", className),
  ...props
}));
SidebarGroupContent.displayName = "SidebarGroupContent";
const SidebarMenu = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx("ul", {
  ref,
  "data-sidebar": "menu",
  className: cn("flex w-full min-w-0 flex-col gap-1", className),
  ...props
}));
SidebarMenu.displayName = "SidebarMenu";
const SidebarMenuItem = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx("li", {
  ref,
  "data-sidebar": "menu-item",
  className: cn("group/menu-item relative", className),
  ...props
}));
SidebarMenuItem.displayName = "SidebarMenuItem";
const sidebarMenuButtonVariants = cva("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
  variants: {
    variant: {
      default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
    },
    size: {
      default: "h-8 text-sm",
      sm: "h-7 text-xs",
      lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
const SidebarMenuButton = React.forwardRef(({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  const {
    isMobile,
    state
  } = useSidebar();
  const button = /* @__PURE__ */ jsx(Comp, {
    ref,
    "data-sidebar": "menu-button",
    "data-size": size,
    "data-active": isActive,
    className: cn(sidebarMenuButtonVariants({
      variant,
      size
    }), className),
    ...props
  });
  if (!tooltip) {
    return button;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return /* @__PURE__ */ jsxs(Tooltip, {
    children: [/* @__PURE__ */ jsx(TooltipTrigger, {
      asChild: true,
      children: button
    }), /* @__PURE__ */ jsx(TooltipContent, {
      side: "right",
      align: "center",
      hidden: state !== "collapsed" || isMobile,
      ...tooltip
    })]
  });
});
SidebarMenuButton.displayName = "SidebarMenuButton";
const SidebarMenuAction = React.forwardRef(({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(Comp, {
    ref,
    "data-sidebar": "menu-action",
    className: cn(
      "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
      // Increases the hit area of the button on mobile.
      "after:absolute after:-inset-2 after:md:hidden",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
      className
    ),
    ...props
  });
});
SidebarMenuAction.displayName = "SidebarMenuAction";
const SidebarMenuBadge = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx("div", {
  ref,
  "data-sidebar": "menu-badge",
  className: cn("absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none", "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", className),
  ...props
}));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
const SidebarMenuSkeleton = React.forwardRef(({
  className,
  showIcon = false,
  ...props
}, ref) => {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);
  return /* @__PURE__ */ jsxs("div", {
    ref,
    "data-sidebar": "menu-skeleton",
    className: cn("rounded-md h-8 flex gap-2 px-2 items-center", className),
    ...props,
    children: [showIcon && /* @__PURE__ */ jsx(Skeleton, {
      className: "size-4 rounded-md",
      "data-sidebar": "menu-skeleton-icon"
    }), /* @__PURE__ */ jsx(Skeleton, {
      className: "h-4 flex-1 max-w-[--skeleton-width]",
      "data-sidebar": "menu-skeleton-text",
      style: {
        "--skeleton-width": width
      }
    })]
  });
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
const SidebarMenuSub = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx("ul", {
  ref,
  "data-sidebar": "menu-sub",
  className: cn("mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className),
  ...props
}));
SidebarMenuSub.displayName = "SidebarMenuSub";
const SidebarMenuSubItem = React.forwardRef(({
  ...props
}, ref) => /* @__PURE__ */ jsx("li", {
  ref,
  ...props
}));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
const SidebarMenuSubButton = React.forwardRef(({
  asChild = false,
  size = "md",
  isActive,
  className,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(Comp, {
    ref,
    "data-sidebar": "menu-sub-button",
    "data-size": size,
    "data-active": isActive,
    className: cn("flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground", "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground", size === "sm" && "text-xs", size === "md" && "text-sm", "group-data-[collapsible=icon]:hidden", className),
    ...props
  });
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
const Breadcrumb = React.forwardRef(({
  ...props
}, ref) => /* @__PURE__ */ jsx("nav", {
  ref,
  "aria-label": "breadcrumb",
  ...props
}));
Breadcrumb.displayName = "Breadcrumb";
const BreadcrumbList = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx("ol", {
  ref,
  className: cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5", className),
  ...props
}));
BreadcrumbList.displayName = "BreadcrumbList";
const BreadcrumbItem = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx("li", {
  ref,
  className: cn("inline-flex items-center gap-1.5", className),
  ...props
}));
BreadcrumbItem.displayName = "BreadcrumbItem";
const BreadcrumbLink = React.forwardRef(({
  asChild,
  className,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(Comp, {
    ref,
    className: cn("transition-colors hover:text-foreground", className),
    ...props
  });
});
BreadcrumbLink.displayName = "BreadcrumbLink";
const BreadcrumbPage = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx("span", {
  ref,
  role: "link",
  "aria-disabled": "true",
  "aria-current": "page",
  className: cn("font-normal text-foreground", className),
  ...props
}));
BreadcrumbPage.displayName = "BreadcrumbPage";
const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => /* @__PURE__ */ jsx("li", {
  role: "presentation",
  "aria-hidden": "true",
  className: cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className),
  ...props,
  children: children ?? /* @__PURE__ */ jsx(ChevronRight, {})
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
function BreadcrumbNavigation({
  journalTitle
}) {
  const location = useLocation();
  const getPageTitle = (pathname) => {
    const path = pathname.replace(/^\/|\/$/g, "");
    if (!path) return "Home";
    return path.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };
  return /* @__PURE__ */ jsx(Breadcrumb, {
    children: /* @__PURE__ */ jsxs(BreadcrumbList, {
      children: [/* @__PURE__ */ jsx(BreadcrumbItem, {
        className: "hidden md:block text-text dark:text-darkText",
        children: /* @__PURE__ */ jsx(BreadcrumbLink, {
          href: "#",
          children: journalTitle
        })
      }), /* @__PURE__ */ jsx(BreadcrumbSeparator, {
        className: "hidden md:block text-text dark:text-darkText"
      }), /* @__PURE__ */ jsx(BreadcrumbItem, {
        children: /* @__PURE__ */ jsx(BreadcrumbPage, {
          className: "dark:text-darkText text-text",
          children: getPageTitle(location.pathname)
        })
      })]
    })
  });
}
try {
  BreadcrumbNavigation.displayName = "BreadcrumbNavigation";
} catch (error) {
}
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Overlay, {
  ref,
  className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
  ...props
}));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => /* @__PURE__ */ jsxs(DialogPortal, {
  children: [/* @__PURE__ */ jsx(DialogOverlay, {}), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
    ref,
    className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className),
    ...props,
    children: [children, /* @__PURE__ */ jsxs(DialogPrimitive.Close, {
      className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
      children: [/* @__PURE__ */ jsx(X, {
        className: "h-4 w-4"
      }), /* @__PURE__ */ jsx("span", {
        className: "sr-only",
        children: "Close"
      })]
    })]
  })]
}));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx("div", {
  className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
  ...props
});
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Title, {
  ref,
  className: cn("text-lg font-semibold leading-none tracking-tight", className),
  ...props
}));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Description, {
  ref,
  className: cn("text-sm text-muted-foreground", className),
  ...props
}));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, {
  ref,
  className: cn(labelVariants(), className),
  ...props
}));
Label.displayName = LabelPrimitive.Root.displayName;
const sidebarOptions = [
  { name: "Journal", icon: Book, href: "/journal/new" },
  // Updated href
  { name: "Goal Tracking", icon: Target, href: "/goal-tracking" },
  { name: "Growth Chat", icon: MessageCircle, href: "/chat" }
  // { name: "Action Items", icon: ListTodo, href: "/action-items" },
  // { name: "Progress Dashboard", icon: LineChart, href: "/progress" },
  // { name: "Milestone Tracker", icon: Clock, href: "/milestones" },
  // { name: "Learning Path", icon: ClipboardList, href: "/learning-path" },
  // { name: "Success Stories", icon: Star, href: "/success-stories" },
  // { name: "Habit Builder", icon: Target, href: "/habit-builder" },
];
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuSubTrigger = React.forwardRef(({
  className,
  inset,
  children,
  ...props
}, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.SubTrigger, {
  ref,
  className: cn("flex cursor-default select-none items-center rounded-base border-2 border-transparent bg-main dark:bg-main-700 text-black dark:text-white px-2 py-1.5 text-sm font-base outline-none focus:border-border dark:focus:border-darkBorder", inset && "pl-8", className),
  ...props,
  children: [children, /* @__PURE__ */ jsx(ChevronRight, {
    className: "ml-auto h-4 w-4"
  })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.SubContent, {
  ref,
  className: cn("z-50 min-w-[8rem] overflow-hidden rounded-base border-2 border-border dark:border-darkBorder bg-main dark:bg-main-700 p-1 font-base text-black dark:text-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
  ...props
}));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({
  className,
  sideOffset = 4,
  ...props
}, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, {
  children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
    ref,
    sideOffset,
    className: cn("z-50 min-w-[8rem] overflow-hidden rounded-base border-2 border-border dark:border-darkBorder bg-main dark:bg-main-700 p-1 font-base text-black dark:text-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
    ...props
  })
}));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({
  className,
  inset,
  ...props
}, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
  ref,
  className: cn("relative flex cursor-default select-none items-center rounded-base border-2 border-transparent bg-main dark:bg-main-700 px-2 py-1.5 text-sm text-black dark:text-white font-base outline-none transition-colors focus:border-border dark:focus:border-darkBorder data-[disabled]:pointer-events-none data-[disabled]:opacity-50", inset && "pl-8", className),
  ...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({
  className,
  children,
  checked,
  ...props
}, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.CheckboxItem, {
  ref,
  className: cn("relative flex cursor-default select-none items-center rounded-base border-2 border-transparent py-1.5 pl-8 pr-2 text-sm font-base text-black dark:text-white outline-none transition-colors focus:border-border dark:focus:border-darkBorder data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
  checked,
  ...props,
  children: [/* @__PURE__ */ jsx("span", {
    className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
    children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, {
      children: /* @__PURE__ */ jsx(Check, {
        className: "h-4 w-4"
      })
    })
  }), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.RadioItem, {
  ref,
  className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm font-base outline-none transition-colors focus:bg-white focus:text-text data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
  ...props,
  children: [/* @__PURE__ */ jsx("span", {
    className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
    children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, {
      children: /* @__PURE__ */ jsx(Circle, {
        className: "h-2 w-2 fill-current"
      })
    })
  }), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({
  className,
  inset,
  ...props
}, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
  ref,
  className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
  ...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
  ref,
  className: cn("-mx-1 my-1 h-px bg-border dark:border-darkBorder", className),
  ...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const DropdownMenuShortcut = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx("span", {
    className: cn("ml-auto text-xs font-base tracking-widest opacity-100", className),
    ...props
  });
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function JournalSelector({
  activeJournal,
  setActiveJournal,
  onCreateNew,
  journals
}) {
  const [isOpen, setIsOpen] = useState(false);
  return /* @__PURE__ */ jsx(SidebarMenuItem, {
    children: journals.length > 0 ? /* @__PURE__ */ jsxs(DropdownMenu, {
      open: isOpen,
      onOpenChange: setIsOpen,
      children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
        asChild: true,
        children: /* @__PURE__ */ jsxs(SidebarMenuButton, {
          size: "lg",
          className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
          children: [/* @__PURE__ */ jsx("div", {
            className: "grid flex-1 text-left text-sm leading-tight",
            children: /* @__PURE__ */ jsx("span", {
              className: "truncate font-semibold text-text dark:text-darkText",
              children: activeJournal.title
            })
          }), /* @__PURE__ */ jsx(ChevronsUpDown, {
            className: "ml-auto text-text dark:text-darkText"
          })]
        })
      }), /* @__PURE__ */ jsxs(DropdownMenuContent, {
        className: "w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-background dark:bg-secondaryBlack",
        align: "start",
        side: "bottom",
        sideOffset: 4,
        children: [journals.length > 0 && /* @__PURE__ */ jsxs(Fragment, {
          children: [/* @__PURE__ */ jsx(DropdownMenuLabel, {
            className: "text-xs text-muted-foreground text-black dark:text-white",
            children: "Journals"
          }), journals.map((journal, index) => /* @__PURE__ */ jsxs(DropdownMenuItem, {
            onClick: () => setActiveJournal(journal),
            className: "gap-2 p-2 mb-2 cursor-pointer",
            children: [journal.title, /* @__PURE__ */ jsxs(DropdownMenuShortcut, {
              children: ["⌘", index + 1]
            })]
          }, journal.title))]
        }), /* @__PURE__ */ jsx(DropdownMenuSeparator, {}), /* @__PURE__ */ jsxs(DropdownMenuItem, {
          className: "gap-2 p-2",
          onClick: () => {
            onCreateNew();
            setIsOpen(false);
          },
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex size-6 items-center justify-center rounded-md border",
            children: /* @__PURE__ */ jsx(Plus, {
              className: "size-4"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "font-medium text-muted-foreground",
            children: "Create New Journal"
          })]
        })]
      })]
    }) : /* @__PURE__ */ jsxs(Button, {
      variant: "noShadow",
      className: "gap-2 p-2 w-full",
      onClick: () => {
        onCreateNew();
        setIsOpen(false);
      },
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex size-6 items-center justify-center rounded-md border bg-background",
        children: /* @__PURE__ */ jsx(Plus, {
          className: "size-4"
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "font-medium text-muted-foreground",
        children: "Create New Journal"
      })]
    })
  });
}
try {
  JournalSelector.displayName = "JournalSelector";
} catch (error) {
}
const Avatar = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Root, {
  ref,
  className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
  ...props
}));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Image, {
  ref,
  className: cn("aspect-square h-full w-full", className),
  ...props
}));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Fallback, {
  ref,
  className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
  ...props
}));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
function useUserInfo() {
  const data = useOutletContext();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    try {
      if (!data?.userInfo) {
        console.error("No user info in context data");
        setError(new Error("No user info available"));
        return;
      }
      const processedUserInfo = {
        ...data.userInfo,
        createdAt: new Date(data.userInfo.createdAt),
        updatedAt: new Date(data.userInfo.updatedAt)
      };
      setUserInfo(processedUserInfo);
      setError(null);
    } catch (err) {
      console.error("Error processing user info:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to process user info")
      );
    } finally {
      setIsLoading(false);
    }
  }, [data]);
  return { userInfo, isLoading, error };
}
function UserInfoForm({
  open,
  onOpenChange
}) {
  return /* @__PURE__ */ jsx(Modal, {
    open,
    onOpenChange,
    children: /* @__PURE__ */ jsxs(ModalContent, {
      children: [/* @__PURE__ */ jsxs(ModalHeader, {
        children: [/* @__PURE__ */ jsx(ModalTitle, {
          className: "text-text dark:text-darkText",
          children: "Complete Your Profile"
        }), /* @__PURE__ */ jsx(ModalDescription, {
          children: "Please provide your information to continue."
        })]
      }), /* @__PURE__ */ jsxs(Form$1, {
        method: "post",
        action: "/user-info",
        className: "space-y-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "space-y-2",
          children: [/* @__PURE__ */ jsx("label", {
            htmlFor: "firstName",
            className: "text-text dark:text-darkText text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            children: "First Name"
          }), /* @__PURE__ */ jsx("input", {
            id: "firstName",
            name: "firstName",
            className: "text-text dark:text-darkText flex h-10 w-full rounded-md border-2 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            required: true
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-2",
          children: [/* @__PURE__ */ jsx("label", {
            htmlFor: "lastName",
            className: "text-text dark:text-darkText text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            children: "Last Name"
          }), /* @__PURE__ */ jsx("input", {
            id: "lastName",
            name: "lastName",
            className: "text-text dark:text-darkText flex h-10 w-full rounded-md border-2 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            required: true
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-2",
          children: [/* @__PURE__ */ jsx("label", {
            htmlFor: "timezone",
            className: "text-text dark:text-darkText text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            children: "Timezone"
          }), /* @__PURE__ */ jsx("select", {
            id: "timezone",
            name: "timezone",
            className: "text-text dark:text-darkText flex h-10 w-full rounded-md border-2 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            required: true,
            children: Intl.supportedValuesOf("timeZone").map((tz) => /* @__PURE__ */ jsx("option", {
              value: tz,
              children: tz
            }, tz))
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-2",
          children: [/* @__PURE__ */ jsx("label", {
            htmlFor: "bio",
            className: "text-text dark:text-darkText text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            children: "Bio"
          }), /* @__PURE__ */ jsx("textarea", {
            id: "bio",
            name: "bio",
            className: "text-text dark:text-darkText flex min-h-[80px] w-full rounded-md border-2 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex justify-end",
          children: /* @__PURE__ */ jsx("button", {
            type: "submit",
            className: "inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
            children: "Save Profile"
          })
        })]
      })]
    })
  });
}
try {
  UserInfoForm.displayName = "UserInfoForm";
} catch (error) {
}
function UserMenu() {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const {
    userInfo,
    isLoading,
    error
  } = useUserInfo();
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  if (error) {
    return /* @__PURE__ */ jsxs(Fragment, {
      children: [/* @__PURE__ */ jsx(UserInfoForm, {
        open: showUserInfoForm || !!error,
        onOpenChange: setShowUserInfoForm
      }), /* @__PURE__ */ jsx(SidebarMenuItem, {
        children: /* @__PURE__ */ jsxs(SidebarMenuButton, {
          size: "lg",
          onClick: () => setShowUserInfoForm(true),
          className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
          children: [/* @__PURE__ */ jsx(Avatar, {
            className: "h-8 w-8 rounded-lg",
            children: /* @__PURE__ */ jsx(AvatarFallback, {
              className: "rounded-lg text-black dark:text-white bg-main dark:bg-main-700",
              children: "GU"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "grid flex-1 text-left text-sm leading-tight",
            children: [/* @__PURE__ */ jsx("span", {
              className: "truncate font-semibold text-black dark:text-white",
              children: "Complete Profile"
            }), /* @__PURE__ */ jsx("span", {
              className: "truncate text-xs text-black dark:text-white",
              children: "Click to setup"
            })]
          }), /* @__PURE__ */ jsx(ChevronsUpDown, {
            className: "ml-auto size-4 text-black dark:text-white"
          })]
        })
      })]
    });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsx(SidebarMenuItem, {
      children: /* @__PURE__ */ jsx("div", {
        className: "animate-pulse bg-gray-200 dark:bg-gray-700 h-12 w-full rounded-lg"
      })
    });
  }
  const displayName = userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "Guest";
  const initials = userInfo ? `${userInfo.firstName[0]}${userInfo.lastName[0]}` : "GU";
  return /* @__PURE__ */ jsxs(SidebarMenuItem, {
    children: [/* @__PURE__ */ jsxs(DropdownMenu, {
      children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
        asChild: true,
        children: /* @__PURE__ */ jsxs(SidebarMenuButton, {
          size: "lg",
          className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
          children: [/* @__PURE__ */ jsx(Avatar, {
            className: "h-8 w-8 rounded-lg",
            children: /* @__PURE__ */ jsx(AvatarFallback, {
              className: "rounded-lg text-black dark:text-white bg-main dark:bg-main-700",
              children: initials
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "grid flex-1 text-left text-sm leading-tight",
            children: [/* @__PURE__ */ jsx("span", {
              className: "truncate font-semibold text-black dark:text-white",
              children: displayName
            }), /* @__PURE__ */ jsx("span", {
              className: "truncate text-xs text-black dark:text-white",
              children: userInfo?.email || "Loading..."
            })]
          }), /* @__PURE__ */ jsx(ChevronsUpDown, {
            className: "ml-auto size-4 text-black dark:text-white"
          })]
        })
      }), /* @__PURE__ */ jsxs(DropdownMenuContent, {
        className: "w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg",
        side: "bottom",
        align: "end",
        sideOffset: 4,
        children: [/* @__PURE__ */ jsx(DropdownMenuLabel, {
          className: "p-0 font-normal",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2 px-1 py-1.5 text-left text-sm",
            children: [/* @__PURE__ */ jsx(Avatar, {
              className: "h-8 w-8 rounded-lg",
              children: /* @__PURE__ */ jsx(AvatarFallback, {
                className: "rounded-lg text-black dark:text-white bg-main dark:bg-main-700",
                children: initials
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "grid flex-1 text-left text-sm leading-tight",
              children: [/* @__PURE__ */ jsx("span", {
                className: "truncate font-semibold",
                children: displayName
              }), /* @__PURE__ */ jsx("span", {
                className: "truncate text-xs",
                children: userInfo?.email || "Loading..."
              })]
            })]
          })
        }), /* @__PURE__ */ jsx(DropdownMenuSeparator, {}), /* @__PURE__ */ jsxs(DropdownMenuGroup, {
          children: [/* @__PURE__ */ jsxs(DropdownMenuItem, {
            className: "cursor-pointer",
            onClick: () => setShowUserInfoForm(true),
            children: [/* @__PURE__ */ jsx(BadgeCheck, {
              className: "mr-2"
            }), "Edit Profile"]
          }), /* @__PURE__ */ jsxs(DropdownMenuItem, {
            className: "cursor-pointer",
            children: [/* @__PURE__ */ jsx(CreditCard, {
              className: "mr-2"
            }), "Billing"]
          }), /* @__PURE__ */ jsxs(DropdownMenuItem, {
            className: "cursor-pointer",
            children: [/* @__PURE__ */ jsx(Bell, {
              className: "mr-2"
            }), "Notifications"]
          })]
        }), /* @__PURE__ */ jsx(DropdownMenuGroup, {
          children: /* @__PURE__ */ jsxs(DropdownMenuItem, {
            onClick: toggleTheme,
            className: "p-2 cursor-pointer",
            children: [theme === "light" ? /* @__PURE__ */ jsx(Moon, {
              className: "mr-2"
            }) : /* @__PURE__ */ jsx(Sun, {
              className: "mr-2"
            }), theme === "light" ? "Dark Mode" : "Light Mode"]
          })
        }), /* @__PURE__ */ jsx(DropdownMenuSeparator, {}), /* @__PURE__ */ jsx(Form$1, {
          action: "/logout",
          method: "post",
          children: /* @__PURE__ */ jsx(DropdownMenuItem, {
            asChild: true,
            children: /* @__PURE__ */ jsxs("button", {
              className: "w-full flex gap-2 items-center cursor-pointer",
              children: [/* @__PURE__ */ jsx(LogOut, {}), "Log out"]
            })
          })
        })]
      })]
    }), /* @__PURE__ */ jsx(UserInfoForm, {
      open: showUserInfoForm,
      onOpenChange: setShowUserInfoForm
    })]
  });
}
try {
  UserMenu.displayName = "UserMenu";
} catch (error) {
}
function AppSidebar({
  children
}) {
  const {
    journals,
    selectedJournalId
  } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const searchParams = new URLSearchParams(location.search);
  const journalIdFromUrl = searchParams.get("journalId");
  const lastJournalIdRef = useRef(null);
  const [activeJournal, setActiveJournal] = useState(journals.find((j) => j.id === journalIdFromUrl) || // URL has priority
  journals.find((j) => j.id === selectedJournalId) || // Then cookie
  journals[0] || // Then first journal
  null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(journals.length === 0 ? true : false);
  useEffect(() => {
    if (!activeJournal || activeJournal.id === lastJournalIdRef.current) return;
    const formData = new FormData();
    formData.set("journalId", activeJournal.id);
    formData.set("_action", "setJournal");
    fetcher.submit(formData, {
      method: "post",
      action: "/set-journal"
    });
    if (lastJournalIdRef.current !== null) {
      navigate("/journal/new");
    }
    lastJournalIdRef.current = activeJournal.id;
  }, [activeJournal, navigate, fetcher]);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsxs(SidebarProvider, {
      children: [/* @__PURE__ */ jsxs(Sidebar, {
        children: [/* @__PURE__ */ jsx(SidebarHeader, {
          children: /* @__PURE__ */ jsx(SidebarMenu, {
            children: /* @__PURE__ */ jsx(JournalSelector, {
              activeJournal,
              setActiveJournal,
              onCreateNew: () => setIsCreateModalOpen(true),
              journals
            })
          })
        }), /* @__PURE__ */ jsx(SidebarContent, {
          className: "scrollbar",
          children: /* @__PURE__ */ jsx(SidebarGroup, {
            className: "p-0 border-t-4 border-border dark:border-darkNavBorder",
            children: /* @__PURE__ */ jsx(SidebarMenu, {
              className: "gap-0",
              children: sidebarOptions.map((items) => /* @__PURE__ */ jsx(SidebarMenuItem, {
                children: /* @__PURE__ */ jsx(SidebarMenuSubButton, {
                  asChild: true,
                  className: "translate-x-0",
                  children: /* @__PURE__ */ jsxs(Link, {
                    className: `rounded-none h-auto block border-b-4 border-border dark:border-darkNavBorder p-4 pl-4 font-base text-text/90 dark:text-darkText/90 hover:bg-main-100 dark:hover:bg-main-600 dark:hover:text-white ${location.pathname === items.href ? "bg-main50 dark:bg-main-700 dark:text-white" : ""}`,
                    to: items.href,
                    children: [React.createElement(items.icon, {
                      size: 24
                    }), /* @__PURE__ */ jsx("span", {
                      className: "text-lg",
                      children: items.name
                    })]
                  })
                })
              }, items.name))
            })
          })
        }), /* @__PURE__ */ jsx(SidebarFooter, {
          children: /* @__PURE__ */ jsx(SidebarMenu, {
            children: /* @__PURE__ */ jsx(UserMenu, {})
          })
        }), /* @__PURE__ */ jsx(SidebarRail, {})]
      }), /* @__PURE__ */ jsxs(SidebarInset, {
        className: "bg-white dark:bg-secondaryBlack border-l-4",
        children: [/* @__PURE__ */ jsx("header", {
          className: "flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2 px-4",
            children: [/* @__PURE__ */ jsx(SidebarTrigger, {
              className: "mx-1"
            }), /* @__PURE__ */ jsx(BreadcrumbNavigation, {
              journalTitle: activeJournal?.title
            })]
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "flex flex-1 flex-col gap-4 pt-0 dark:bg-darkBg",
          children
        })]
      })]
    }), /* @__PURE__ */ jsx(Dialog, {
      open: isCreateModalOpen,
      onOpenChange: setIsCreateModalOpen,
      children: /* @__PURE__ */ jsxs(DialogContent, {
        className: "sm:max-w-md bg-white dark:bg-secondaryBlack",
        children: [/* @__PURE__ */ jsx(DialogHeader, {
          children: /* @__PURE__ */ jsx(DialogTitle, {
            className: "text-slate-900 dark:text-white",
            children: "Create New Journal"
          })
        }), /* @__PURE__ */ jsxs(Form$1, {
          method: "post",
          action: "/journals/new",
          onSubmit: (e) => {
            const form = e.currentTarget;
            const name = new FormData(form).get("name");
            if (!name) {
              e.preventDefault();
            } else {
              setIsCreateModalOpen(false);
            }
          },
          className: "space-y-4",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "space-y-2",
            children: [/* @__PURE__ */ jsx(Label, {
              htmlFor: "name",
              className: "text-sm font-medium text-slate-900 dark:text-white",
              children: "Journal Name"
            }), /* @__PURE__ */ jsx(Input, {
              id: "name",
              name: "name",
              type: "text",
              required: true,
              className: "w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400",
              placeholder: "My Journal"
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex justify-end",
            children: /* @__PURE__ */ jsx(Button, {
              type: "submit",
              className: "px-4 py-2  rounded-lg transition-colors",
              children: "Create Journal"
            })
          })]
        })]
      })
    })]
  });
}
try {
  AppSidebar.displayName = "AppSidebar";
} catch (error) {
}
function MainLayout({
  children
}) {
  return /* @__PURE__ */ jsx("div", {
    className: "bg-background dark:bg-secondaryBlack w-full",
    children: /* @__PURE__ */ jsx(AppSidebar, {
      children: /* @__PURE__ */ jsx("main", {
        children
      })
    })
  });
}
try {
  MainLayout.displayName = "MainLayout";
} catch (error) {
}
const updateEntry = async (request, journalId, entryId, payload) => {
  if (!payload.content) {
    throw new Error("Content is required");
  }
  try {
    await ApiClient.putProtected(
      `/journals/${journalId}/entries/${entryId}`,
      request,
      payload
    );
  } catch (error) {
    console.error("Error updating entry:", error);
    const errorMessage = error instanceof ApiError ? error.message : "Failed to update entry. Please try again.";
    throw new Error(errorMessage);
  }
};
const deleteEntry = async (request, journalId, entryId) => {
  if (!entryId) {
    throw new Error("Entry ID is required for deletion");
  }
  try {
    await ApiClient.deleteProtected(
      `/journals/${journalId}/entries/${entryId}`,
      request
    );
  } catch (error) {
    console.error("Error deleting entry:", error);
    const errorMessage = error instanceof ApiError ? error.message : "Failed to delete entry. Please try again.";
    throw new Error(errorMessage);
  }
};
const formatClasses = {
  bold: "font-bold",
  italic: "italic",
  underline: "underline",
  strikethrough: "line-through",
  code: "bg-gray-100 dark:bg-gray-700 px-1 py-0.5 font-mono text-[94%]",
  link: "text-blue-600 dark:text-blue-400 no-underline"
};
const headingClasses = {
  h1: "text-2xl text-gray-900 dark:text-white font-normal mb-3",
  h2: "text-base text-gray-600 dark:text-gray-300 font-bold mt-2.5 uppercase"
};
const listClasses = {
  ol: "pl-4 m-0",
  ul: "pl-4 m-0",
  li: "my-2 mx-8",
  nestedLi: "list-none"
};
const quoteClasses = "ml-5 text-gray-600 dark:text-gray-300 border-l-4 border-gray-300 dark:border-gray-600 pl-4";
const ExampleTheme = {
  code: formatClasses.code,
  heading: {
    h1: headingClasses.h1,
    h2: headingClasses.h2
  },
  image: "",
  link: formatClasses.link,
  list: {
    listitem: listClasses.li,
    nested: {
      listitem: listClasses.nestedLi
    },
    ol: listClasses.ol,
    ul: listClasses.ul
  },
  ltr: "ltr",
  paragraph: "text-base text-gray-900 dark:text-white",
  placeholder: "text-gray-400 dark:text-gray-500",
  quote: quoteClasses,
  rtl: "rtl",
  text: {
    bold: formatClasses.bold,
    code: formatClasses.code,
    hashtag: "text-blue-500 dark:text-blue-400",
    italic: formatClasses.italic,
    overflowed: "opacity-50",
    strikethrough: formatClasses.strikethrough,
    underline: formatClasses.underline,
    underlineStrikethrough: `${formatClasses.underline} ${formatClasses.strikethrough}`
  }
};
const LowPriority = 1;
function Divider() {
  return /* @__PURE__ */ jsx("div", {
    className: "mx-2 h-4 w-px bg-gray-200 dark:bg-gray-700"
  });
}
try {
  Divider.displayName = "Divider";
} catch (error) {
}
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);
  useEffect(() => {
    return mergeRegister(editor.registerUpdateListener(({
      editorState
    }) => {
      editorState.read(() => {
        $updateToolbar();
      });
    }), editor.registerCommand(SELECTION_CHANGE_COMMAND, (_payload, _newEditor) => {
      $updateToolbar();
      return false;
    }, LowPriority), editor.registerCommand(CAN_UNDO_COMMAND, (payload) => {
      setCanUndo(payload);
      return false;
    }, LowPriority), editor.registerCommand(CAN_REDO_COMMAND, (payload) => {
      setCanRedo(payload);
      return false;
    }, LowPriority));
  }, [editor, $updateToolbar]);
  return /* @__PURE__ */ jsxs("div", {
    className: "flex items-center p-2 border-b border-gray-200 dark:border-gray-700",
    ref: toolbarRef,
    children: [/* @__PURE__ */ jsx("button", {
      type: "button",
      disabled: !canUndo,
      onClick: () => {
        editor.dispatchCommand(UNDO_COMMAND, void 0);
      },
      className: `p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 ${!canUndo ? "cursor-not-allowed" : ""}`,
      "aria-label": "Undo",
      children: /* @__PURE__ */ jsxs("svg", {
        className: "w-4 h-4 text-gray-600 dark:text-gray-300",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        children: [/* @__PURE__ */ jsx("path", {
          d: "M9 14l-4-4 4-4",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }), /* @__PURE__ */ jsx("path", {
          d: "M5 10h11a4 4 0 0 1 0 8h-1",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        })]
      })
    }), /* @__PURE__ */ jsx("button", {
      type: "button",
      disabled: !canRedo,
      onClick: () => {
        editor.dispatchCommand(REDO_COMMAND, void 0);
      },
      className: `p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 ${!canRedo ? "cursor-not-allowed" : ""}`,
      "aria-label": "Redo",
      children: /* @__PURE__ */ jsxs("svg", {
        className: "w-4 h-4 text-gray-600 dark:text-gray-300",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        children: [/* @__PURE__ */ jsx("path", {
          d: "M15 14l4-4-4-4",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }), /* @__PURE__ */ jsx("path", {
          d: "M19 10H8a4 4 0 0 0 0 8h1",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        })]
      })
    }), /* @__PURE__ */ jsx(Divider, {}), /* @__PURE__ */ jsx("button", {
      type: "button",
      onClick: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
      },
      className: `p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isBold ? "bg-gray-200 dark:bg-gray-600" : ""}`,
      "aria-label": "Format Bold",
      children: /* @__PURE__ */ jsxs("svg", {
        className: "w-4 h-4 text-gray-600 dark:text-gray-300",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        children: [/* @__PURE__ */ jsx("path", {
          d: "M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"
        }), /* @__PURE__ */ jsx("path", {
          d: "M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"
        })]
      })
    }), /* @__PURE__ */ jsx("button", {
      type: "button",
      onClick: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
      },
      className: `p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isItalic ? "bg-gray-200 dark:bg-gray-600" : ""}`,
      "aria-label": "Format Italics",
      children: /* @__PURE__ */ jsxs("svg", {
        className: "w-4 h-4 text-gray-600 dark:text-gray-300",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        children: [/* @__PURE__ */ jsx("line", {
          x1: "19",
          y1: "4",
          x2: "10",
          y2: "4",
          strokeWidth: "2",
          strokeLinecap: "round"
        }), /* @__PURE__ */ jsx("line", {
          x1: "14",
          y1: "20",
          x2: "5",
          y2: "20",
          strokeWidth: "2",
          strokeLinecap: "round"
        }), /* @__PURE__ */ jsx("line", {
          x1: "15",
          y1: "4",
          x2: "9",
          y2: "20",
          strokeWidth: "2"
        })]
      })
    }), /* @__PURE__ */ jsx("button", {
      type: "button",
      onClick: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
      },
      className: `p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isUnderline ? "bg-gray-200 dark:bg-gray-600" : ""}`,
      "aria-label": "Format Underline",
      children: /* @__PURE__ */ jsxs("svg", {
        className: "w-4 h-4 text-gray-600 dark:text-gray-300",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        children: [/* @__PURE__ */ jsx("path", {
          d: "M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }), /* @__PURE__ */ jsx("line", {
          x1: "4",
          y1: "21",
          x2: "20",
          y2: "21",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        })]
      })
    }), /* @__PURE__ */ jsx("button", {
      type: "button",
      onClick: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
      },
      className: `p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isStrikethrough ? "bg-gray-200 dark:bg-gray-600" : ""}`,
      "aria-label": "Format Strikethrough",
      children: /* @__PURE__ */ jsxs("svg", {
        className: "w-4 h-4 text-gray-600 dark:text-gray-300",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        children: [/* @__PURE__ */ jsx("line", {
          x1: "5",
          y1: "12",
          x2: "19",
          y2: "12",
          strokeWidth: "2",
          strokeLinecap: "round"
        }), /* @__PURE__ */ jsx("path", {
          d: "M16 6C16 6 14.5 4 12 4C9.5 4 7 6 7 8C7 10 9 11 12 11",
          strokeWidth: "2",
          strokeLinecap: "round"
        }), /* @__PURE__ */ jsx("path", {
          d: "M8 18C8 18 9.5 20 12 20C14.5 20 17 18 17 16C17 14 15 13 12 13",
          strokeWidth: "2",
          strokeLinecap: "round"
        })]
      })
    }), /* @__PURE__ */ jsx(Divider, {}), /* @__PURE__ */ jsx("button", {
      type: "button",
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
      },
      className: "p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
      "aria-label": "Left Align",
      children: /* @__PURE__ */ jsxs("svg", {
        className: "w-4 h-4 text-gray-600 dark:text-gray-300",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        children: [/* @__PURE__ */ jsx("line", {
          x1: "3",
          y1: "6",
          x2: "21",
          y2: "6",
          strokeWidth: "2",
          strokeLinecap: "round"
        }), /* @__PURE__ */ jsx("line", {
          x1: "3",
          y1: "12",
          x2: "15",
          y2: "12",
          strokeWidth: "2",
          strokeLinecap: "round"
        }), /* @__PURE__ */ jsx("line", {
          x1: "3",
          y1: "18",
          x2: "18",
          y2: "18",
          strokeWidth: "2",
          strokeLinecap: "round"
        })]
      })
    }), /* @__PURE__ */ jsx("button", {
      type: "button",
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
      },
      className: "p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
      "aria-label": "Center Align",
      children: /* @__PURE__ */ jsxs("svg", {
        className: "w-4 h-4 text-gray-600 dark:text-gray-300",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        children: [/* @__PURE__ */ jsx("line", {
          x1: "3",
          y1: "6",
          x2: "21",
          y2: "6",
          strokeWidth: "2",
          strokeLinecap: "round"
        }), /* @__PURE__ */ jsx("line", {
          x1: "6",
          y1: "12",
          x2: "18",
          y2: "12",
          strokeWidth: "2",
          strokeLinecap: "round"
        }), /* @__PURE__ */ jsx("line", {
          x1: "4",
          y1: "18",
          x2: "20",
          y2: "18",
          strokeWidth: "2",
          strokeLinecap: "round"
        })]
      })
    }), /* @__PURE__ */ jsx("button", {
      type: "button",
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
      },
      className: "p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
      "aria-label": "Right Align",
      children: /* @__PURE__ */ jsxs("svg", {
        className: "w-4 h-4 text-gray-600 dark:text-gray-300",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        children: [/* @__PURE__ */ jsx("line", {
          x1: "3",
          y1: "6",
          x2: "21",
          y2: "6",
          strokeWidth: "2",
          strokeLinecap: "round"
        }), /* @__PURE__ */ jsx("line", {
          x1: "9",
          y1: "12",
          x2: "21",
          y2: "12",
          strokeWidth: "2",
          strokeLinecap: "round"
        }), /* @__PURE__ */ jsx("line", {
          x1: "6",
          y1: "18",
          x2: "21",
          y2: "18",
          strokeWidth: "2",
          strokeLinecap: "round"
        })]
      })
    }), /* @__PURE__ */ jsx("button", {
      type: "button",
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
      },
      className: "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
      "aria-label": "Justify Align",
      children: /* @__PURE__ */ jsxs("svg", {
        className: "w-4 h-4 text-gray-600 dark:text-gray-300",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        children: [/* @__PURE__ */ jsx("line", {
          x1: "3",
          y1: "6",
          x2: "21",
          y2: "6",
          strokeWidth: "2",
          strokeLinecap: "round"
        }), /* @__PURE__ */ jsx("line", {
          x1: "3",
          y1: "12",
          x2: "21",
          y2: "12",
          strokeWidth: "2",
          strokeLinecap: "round"
        }), /* @__PURE__ */ jsx("line", {
          x1: "3",
          y1: "18",
          x2: "21",
          y2: "18",
          strokeWidth: "2",
          strokeLinecap: "round"
        })]
      })
    })]
  });
}
try {
  ToolbarPlugin.displayName = "ToolbarPlugin";
} catch (error) {
}
function InitialContentPlugin({
  initialContent
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    const currentText = editor.getEditorState().read(() => $getRoot().getTextContent());
    if (initialContent !== currentText) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraphNode = $createParagraphNode();
        const textNode = $createTextNode(initialContent || "");
        paragraphNode.append(textNode);
        root.append(paragraphNode);
      });
    }
  }, [editor, initialContent]);
  return null;
}
try {
  InitialContentPlugin.displayName = "InitialContentPlugin";
} catch (error) {
}
function Editor({
  onChange,
  initialContent
}) {
  const handleEditorChange = useCallback((editorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const text = root.getTextContent();
      console.log("Extracted text:", text);
      onChange(text);
    });
  }, [onChange]);
  const initialConfig = {
    namespace: "ControlledEditor",
    onError: (error) => {
      console.error(error);
    },
    nodes: [
      // Re-enabled all nodes
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      LinkNode,
      CodeNode,
      AutoLinkNode,
      ParagraphNode,
      TextNode
    ],
    theme: ExampleTheme,
    // Apply custom theme
    editorState: null
    // Set initial state to null; the InitialContentPlugin will populate it.
  };
  return /* @__PURE__ */ jsx(LexicalComposer, {
    initialConfig,
    children: /* @__PURE__ */ jsxs("div", {
      className: "relative bg-white dark:bg-secondaryBlack rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
      children: [/* @__PURE__ */ jsx(ToolbarPlugin, {}), " ", /* @__PURE__ */ jsxs("div", {
        className: "relative min-h-[150px] bg-white dark:bg-secondaryBlack",
        children: [/* @__PURE__ */ jsx(RichTextPlugin, {
          contentEditable: /* @__PURE__ */ jsx(ContentEditable, {
            className: "min-h-[150px] resize-none text-[15px] relative tab-[1] outline-none p-[15px_10px] caret-gray-600 dark:caret-white"
          }),
          ErrorBoundary: LexicalErrorBoundary
        }), /* @__PURE__ */ jsx(HistoryPlugin, {}), " ", /* @__PURE__ */ jsx(OnChangePlugin, {
          onChange: handleEditorChange
        }), " ", /* @__PURE__ */ jsx(InitialContentPlugin, {
          initialContent
        }), " "]
      })]
    })
  });
}
try {
  Editor.displayName = "Editor";
} catch (error) {
}
const loader$9 = async ({
  request,
  params
}) => {
  await requireUserSession(request);
  const entryId = params.id;
  const journalId = await getSelectedJournalId(request);
  if (!journalId) {
    throw redirect("/select-journal");
  }
  if (!entryId) {
    throw new Response("Entry ID not found", {
      status: 404
    });
  }
  console.log(`Loader: Attempting to fetch entry ${entryId} for journal ${journalId}`);
  try {
    const response = await ApiClient.getProtected(`/journals/${journalId}/entries/${entryId}`, request);
    if (!response?.data) {
      throw new Response("Entry data not found in response", {
        status: 404
      });
    }
    const entry2 = response.data;
    if (!entry2) {
      throw new Response("Entry not found", {
        status: 404
      });
    }
    return json$1({
      entry: entry2
    });
  } catch (e) {
    console.error("Failed to load entry:", e);
    if (e instanceof ApiError && e.statusCode === 404) {
      throw new Response("Entry not found", {
        status: 404
      });
    }
    const errorMessage = e instanceof Error ? e.message : "Failed to load entry. Please try again.";
    throw new Response(errorMessage, {
      status: 500
    });
  }
};
const action$a = async ({
  request,
  params
}) => {
  const journalId = await getSelectedJournalId(request);
  const entryId = params.id;
  if (!entryId) {
    return json$1({
      success: false,
      error: "Entry ID is required for this action"
    });
  }
  if (!journalId) {
    return json$1({
      success: false,
      error: "No journal selected"
    });
  }
  try {
    const formData = await request.formData();
    const content = formData.get("content");
    const _action = formData.get("_action");
    if (_action === "delete") {
      await deleteEntry(request, journalId, entryId);
      return redirect("/journal/new");
    } else {
      await updateEntry(request, journalId, entryId, {
        content
      });
      return json$1({
        success: true,
        message: "Entry saved successfully!"
      });
    }
  } catch (error) {
    console.error("Error processing action:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
    return json$1({
      success: false,
      error: errorMessage
    });
  }
};
function EditJournalEntry() {
  const {
    entry: entry2
  } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [content, setContent] = useState(entry2.content ?? "");
  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.message || "Entry saved successfully!");
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    submit(formData, {
      method: "post"
    });
  };
  const handleConfirmDelete = () => {
    const formData = new FormData();
    formData.set("_action", "delete");
    formData.set("entryId", entry2.id);
    submit(formData, {
      method: "post",
      replace: true
    });
  };
  const isSubmitting = navigation.state === "submitting";
  const isDeleting = navigation.formData?.get("_action") === "delete" && isSubmitting;
  const isSaving = navigation.formData?.get("_action") !== "delete" && isSubmitting;
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx(MainLayout, {
      children: /* @__PURE__ */ jsx("div", {
        className: "flex h-full relative animate-fade-in",
        children: /* @__PURE__ */ jsx("div", {
          className: "flex-1 flex justify-center",
          children: /* @__PURE__ */ jsx("div", {
            className: "w-full max-w-3xl p-4 md:p-8",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col h-full",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex items-center mb-4",
                children: /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/* @__PURE__ */ jsx(Link, {
                    to: "/journal/new",
                    className: "hover:opacity-80 text-gray-900 dark:text-white",
                    children: /* @__PURE__ */ jsx(ArrowLeft, {
                      className: "w-5 h-5"
                    })
                  }), /* @__PURE__ */ jsxs("h1", {
                    className: "text-xl font-semibold text-gray-900 dark:text-white",
                    children: ["Edit Entry -", " ", new Date(entry2.createdAt).toLocaleDateString()]
                  })]
                })
              }), /* @__PURE__ */ jsxs(Form$1, {
                method: "post",
                onSubmit: handleSubmit,
                className: "flex-1 flex flex-col",
                children: [/* @__PURE__ */ jsx("input", {
                  type: "hidden",
                  name: "entryId",
                  value: entry2.id
                }), /* @__PURE__ */ jsx("div", {
                  className: "flex-1 bg-neutral-50 dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-4 min-h-[200px]",
                  children: /* @__PURE__ */ jsx(Editor, {
                    onChange: setContent,
                    initialContent: content
                  })
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between mt-4",
                  children: [/* @__PURE__ */ jsxs(Modal, {
                    children: [/* @__PURE__ */ jsx(ModalTrigger, {
                      asChild: true,
                      children: /* @__PURE__ */ jsxs(Button, {
                        variant: "destructive",
                        type: "button",
                        disabled: isSubmitting,
                        className: "flex items-center gap-2",
                        children: [/* @__PURE__ */ jsx(Trash2, {
                          className: "w-4 h-4"
                        }), "Delete"]
                      })
                    }), /* @__PURE__ */ jsxs(ModalContent, {
                      children: [/* @__PURE__ */ jsxs(ModalHeader, {
                        children: [/* @__PURE__ */ jsx(ModalTitle, {
                          children: "Confirm Deletion"
                        }), /* @__PURE__ */ jsx(ModalDescription, {
                          children: "Are you sure you want to delete this journal entry? This action cannot be undone."
                        })]
                      }), /* @__PURE__ */ jsxs(ModalFooter, {
                        children: [/* @__PURE__ */ jsx(ModalClose, {
                          asChild: true,
                          children: /* @__PURE__ */ jsx(Button, {
                            variant: "neutral",
                            disabled: isDeleting,
                            children: "Cancel"
                          })
                        }), /* @__PURE__ */ jsxs(Button, {
                          variant: "destructive",
                          onClick: handleConfirmDelete,
                          disabled: isDeleting,
                          className: "flex items-center gap-2",
                          children: [isDeleting ? /* @__PURE__ */ jsx(Loader2, {
                            className: "w-4 h-4 animate-spin"
                          }) : /* @__PURE__ */ jsx(Trash2, {
                            className: "w-4 h-4"
                          }), "Confirm Delete"]
                        })]
                      })]
                    })]
                  }), /* @__PURE__ */ jsx(Link, {
                    to: "/journal/new",
                    children: /* @__PURE__ */ jsx(Button, {
                      variant: "neutral",
                      type: "button",
                      disabled: isSubmitting,
                      children: "Cancel"
                    })
                  }), /* @__PURE__ */ jsxs(Button, {
                    type: "submit",
                    disabled: isSubmitting,
                    className: "flex items-center gap-2",
                    children: [isSaving ? /* @__PURE__ */ jsx(Loader2, {
                      className: "w-4 h-4 animate-spin"
                    }) : /* @__PURE__ */ jsx(Save, {
                      className: "w-4 h-4"
                    }), "Save Changes"]
                  })]
                })]
              })]
            })
          })
        })
      })
    })
  });
}
try {
  EditJournalEntry.displayName = "EditJournalEntry";
} catch (error) {
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$a,
  default: EditJournalEntry,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
function SuccessStories() {
  return /* @__PURE__ */ jsx(MainLayout, {
    children: /* @__PURE__ */ jsx("div", {
      className: "container max-w-4xl mx-auto p-6 space-y-6",
      children: /* @__PURE__ */ jsx("h1", {
        children: "Success Stories"
      })
    })
  });
}
try {
  SuccessStories.displayName = "SuccessStories";
} catch (error) {
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SuccessStories
}, Symbol.toStringTag, { value: "Module" }));
const Form = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /* @__PURE__ */ jsx("form", {
    ref,
    className: cn("space-y-6", className),
    ...props
  });
});
Form.displayName = "Form";
const FormField = React.forwardRef(({
  className,
  ...props
}, ref) => {
  return /* @__PURE__ */ jsx("div", {
    ref,
    className: cn("space-y-2", className),
    ...props
  });
});
FormField.displayName = "FormField";
const FormLabel = React.forwardRef(({
  className,
  htmlFor,
  ...props
}, ref) => {
  return /* @__PURE__ */ jsx("label", {
    ref,
    htmlFor,
    className: cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
    ...props
  });
});
FormLabel.displayName = "FormLabel";
const FormMessage = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return /* @__PURE__ */ jsx("p", {
    ref,
    className: cn("text-sm font-medium text-red-500", className),
    ...props,
    children
  });
});
FormMessage.displayName = "FormMessage";
async function loader$8() {
  return json$1({});
}
async function action$9({
  request
}) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const errors = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  if (Object.keys(errors).length > 0) {
    return json$1({
      errors
    }, {
      status: 400
    });
  }
  try {
    await AuthService.signUp({
      email,
      password
    });
    return redirect("/login");
  } catch (error) {
    return json$1({
      errors: {
        _form: "Failed to create account. Please try again."
      }
    }, {
      status: 500
    });
  }
}
function RegisterPage() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return /* @__PURE__ */ jsx("div", {
    className: "container flex h-screen w-screen flex-col items-center justify-center mx-auto",
    children: /* @__PURE__ */ jsxs("div", {
      className: "mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex flex-col space-y-2 text-center",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-2xl font-semibold tracking-tight dark:text-white text-text",
          children: "Create an account"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm dark:text-white text-text",
          children: "Enter your email below to create your account"
        })]
      }), /* @__PURE__ */ jsxs(Form$1, {
        method: "post",
        className: "space-y-4",
        children: [/* @__PURE__ */ jsxs(FormField, {
          children: [/* @__PURE__ */ jsx(FormLabel, {
            htmlFor: "email",
            className: "dark:text-white text-text",
            children: "Email"
          }), /* @__PURE__ */ jsx(Input, {
            id: "email",
            type: "email",
            name: "email",
            placeholder: "name@example.com",
            className: "bg-white",
            required: true
          }), actionData?.errors?.email && /* @__PURE__ */ jsx(FormMessage, {
            children: actionData.errors.email
          })]
        }), /* @__PURE__ */ jsxs(FormField, {
          children: [/* @__PURE__ */ jsx(FormLabel, {
            htmlFor: "password",
            className: "dark:text-white text-text",
            children: "Password"
          }), /* @__PURE__ */ jsx(Input, {
            id: "password",
            type: "password",
            name: "password",
            className: "bg-white",
            required: true
          }), actionData?.errors?.password && /* @__PURE__ */ jsx(FormMessage, {
            children: actionData.errors.password
          })]
        }), /* @__PURE__ */ jsxs(FormField, {
          children: [/* @__PURE__ */ jsx(FormLabel, {
            htmlFor: "confirmPassword",
            className: "dark:text-white text-text",
            children: "Confirm Password"
          }), /* @__PURE__ */ jsx(Input, {
            id: "confirmPassword",
            type: "password",
            name: "confirmPassword",
            className: "bg-white",
            required: true
          }), actionData?.errors?.confirmPassword && /* @__PURE__ */ jsx(FormMessage, {
            children: actionData.errors.confirmPassword
          })]
        }), /* @__PURE__ */ jsx(Button, {
          type: "submit",
          className: "w-full",
          disabled: isSubmitting,
          children: isSubmitting ? "Creating account..." : "Sign Up"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "text-center text-sm dark:text-white text-text",
        children: ["Already have an account?", " ", /* @__PURE__ */ jsx(Link, {
          to: "/login",
          className: "underline hover:text-gray-800",
          children: "Sign in"
        })]
      })]
    })
  });
}
try {
  RegisterPage.displayName = "RegisterPage";
} catch (error) {
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9,
  default: RegisterPage,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
const Card = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx("div", {
  ref,
  className: cn("rounded-base shadow-light dark:shadow-dark border-2 border-border dark:border-darkBorder bg-main text-black", className),
  ...props
}));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx("div", {
  ref,
  className: cn("flex flex-col space-y-1.5 p-6", className),
  ...props
}));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({
  className,
  ...props
}, ref) => (
  // eslint-disable-next-line jsx-a11y/heading-has-content
  /* @__PURE__ */ jsx("h3", {
    ref,
    className: cn("text-xl leading-none font-heading tracking-tight", className),
    ...props
  })
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx("p", {
  ref,
  className: cn("text-sm text-black font-base !mt-3", className),
  ...props
}));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx("div", {
  ref,
  className: cn("p-6 pt-0", className),
  ...props
}));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({
  className,
  ...props
}, ref) => /* @__PURE__ */ jsx("div", {
  ref,
  className: cn("flex items-center p-6 pt-0", className),
  ...props
}));
CardFooter.displayName = "CardFooter";
function GoalCard({
  goal
}) {
  const getStatusBadge = () => {
    if (goal.deletedAt) return /* @__PURE__ */ jsx("span", {
      className: "bg-red-100 dark:bg-red-900/70 text-red-800 dark:text-white px-2 py-1 rounded-base text-xs font-medium border-2 border-red-800 dark:border-red-400",
      children: "Deleted"
    });
    if (goal.completedAt) return /* @__PURE__ */ jsx("span", {
      className: "bg-green-100 dark:bg-green-900/70 text-green-800 dark:text-white px-2 py-1 rounded-base text-xs font-medium border-2 border-green-800 dark:border-green-400",
      children: "Completed"
    });
    if (goal.acceptedAt) return /* @__PURE__ */ jsx("span", {
      className: "bg-blue-100 dark:bg-blue-900/70 text-blue-800 dark:text-white px-2 py-1 rounded-base text-xs font-medium border-2 border-blue-800 dark:border-blue-400",
      children: "Accepted"
    });
    return /* @__PURE__ */ jsx("span", {
      className: "bg-yellow-100 dark:bg-yellow-900/70 text-yellow-800 dark:text-white px-2 py-1 rounded-base text-xs font-medium border-2 border-yellow-800 dark:border-yellow-400",
      children: "Suggested"
    });
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  return /* @__PURE__ */ jsx(Card, {
    className: "goal-card bg-white dark:bg-gray-800 border-2 dark:border-gray-700",
    children: /* @__PURE__ */ jsx(CardContent, {
      className: "p-4",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex justify-between items-start",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center space-x-2 mb-1 mt-2",
            children: [getStatusBadge(), goal.relatedMetricType && /* @__PURE__ */ jsx("span", {
              className: "bg-main-100 dark:bg-main-900/70 text-black dark:text-white px-2 py-1 rounded-base text-xs font-medium border-2 border-border dark:border-main-600",
              children: goal.relatedMetricType
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-lg font-medium mt-2 text-black dark:text-white",
            children: goal.content
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-2 text-sm text-black/70 dark:text-white/90",
            children: [/* @__PURE__ */ jsxs("p", {
              children: ["Suggested: ", formatDate(goal.suggestedAt)]
            }), goal.targetDate && /* @__PURE__ */ jsxs("p", {
              children: ["Target completion: ", formatDate(goal.targetDate)]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex space-x-2",
          children: [!goal.acceptedAt && !goal.completedAt && !goal.deletedAt && /* @__PURE__ */ jsxs(Form$1, {
            method: "post",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "goalId",
              value: goal.id
            }), /* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "_action",
              value: "acceptGoal"
            }), /* @__PURE__ */ jsx(Button, {
              type: "submit",
              size: "sm",
              variant: "default",
              className: "bg-blue-600 hover:bg-blue-700 text-white font-medium",
              children: "Accept"
            })]
          }), goal.acceptedAt && !goal.completedAt && !goal.deletedAt && /* @__PURE__ */ jsxs(Form$1, {
            method: "post",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "goalId",
              value: goal.id
            }), /* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "_action",
              value: "completeGoal"
            }), /* @__PURE__ */ jsx(Button, {
              type: "submit",
              size: "sm",
              variant: "default",
              className: "bg-green-600 hover:bg-green-700 text-white font-medium border-none",
              children: "Complete"
            })]
          }), !goal.deletedAt && /* @__PURE__ */ jsxs(Form$1, {
            method: "post",
            children: [/* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "goalId",
              value: goal.id
            }), /* @__PURE__ */ jsx("input", {
              type: "hidden",
              name: "_action",
              value: "deleteGoal"
            }), /* @__PURE__ */ jsx(Button, {
              type: "submit",
              size: "sm",
              variant: "default",
              className: "bg-red-600 hover:bg-red-700 text-white font-medium border-none",
              children: "Delete"
            })]
          })]
        })]
      })
    })
  });
}
try {
  GoalCard.displayName = "GoalCard";
} catch (error) {
}
function GoalList({
  goals
}) {
  if (goals.length === 0) {
    return /* @__PURE__ */ jsx("div", {
      className: "text-center py-8 bg-gray-50 rounded-lg animate-fade-in",
      children: /* @__PURE__ */ jsx("p", {
        className: "text-gray-500",
        children: "No goals found matching your filters."
      })
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "space-y-4",
    children: goals.map((goal) => /* @__PURE__ */ jsx("div", {
      className: "goal-list-item",
      children: /* @__PURE__ */ jsx(GoalCard, {
        goal
      })
    }, goal.id))
  });
}
try {
  GoalList.displayName = "GoalList";
} catch (error) {
}
function FilterDropdown({
  label,
  value,
  options,
  onChange
}) {
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsx("label", {
      className: "block text-sm font-medium text-black dark:text-white mb-1",
      children: label
    }), /* @__PURE__ */ jsxs(DropdownMenu, {
      children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
        asChild: true,
        children: /* @__PURE__ */ jsxs(Button, {
          variant: "default",
          className: "w-full justify-between",
          children: [/* @__PURE__ */ jsx("span", {
            children: options.find((opt) => opt.value === value)?.label
          }), /* @__PURE__ */ jsx(ChevronDown, {
            className: "ml-auto h-4 w-4"
          })]
        })
      }), /* @__PURE__ */ jsx(DropdownMenuContent, {
        className: "w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-background dark:bg-secondaryBlack",
        align: "start",
        side: "bottom",
        sideOffset: 4,
        children: options.map((option) => /* @__PURE__ */ jsx(DropdownMenuItem, {
          onClick: () => onChange(option.value),
          className: "gap-2 p-2 mb-2 cursor-pointer",
          children: option.label
        }, option.value))
      })]
    })]
  });
}
try {
  FilterDropdown.displayName = "FilterDropdown";
} catch (error) {
}
function GoalFilters({
  filters,
  setFilters
}) {
  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };
  const statusOptions = [{
    value: "all",
    label: "All Statuses"
  }, {
    value: "suggested",
    label: "Suggested"
  }, {
    value: "accepted",
    label: "Accepted"
  }, {
    value: "completed",
    label: "Completed"
  }, {
    value: "deleted",
    label: "Deleted"
  }];
  const dateRangeOptions = [{
    value: "all",
    label: "All Time"
  }, {
    value: "today",
    label: "Today"
  }, {
    value: "week",
    label: "This Week"
  }, {
    value: "month",
    label: "This Month"
  }];
  const metricOptions = [{
    value: "all",
    label: "All Metrics"
  }, {
    value: "resilience",
    label: "Resilience"
  }, {
    value: "effort",
    label: "Effort"
  }, {
    value: "challenge",
    label: "Challenge"
  }, {
    value: "feedback",
    label: "Feedback"
  }, {
    value: "learning",
    label: "Learning"
  }];
  return /* @__PURE__ */ jsx("div", {
    className: "rounded-base border-2 border-border dark:border-gray-700 bg-white dark:bg-gray-800 p-4 animate-fade-in",
    children: /* @__PURE__ */ jsxs("div", {
      className: "grid grid-cols-1 md:grid-cols-3 gap-4",
      children: [/* @__PURE__ */ jsx(FilterDropdown, {
        label: "Status",
        value: filters.status,
        options: statusOptions,
        onChange: (value) => handleFilterChange("status", value)
      }), /* @__PURE__ */ jsx(FilterDropdown, {
        label: "Date Range",
        value: filters.dateRange,
        options: dateRangeOptions,
        onChange: (value) => handleFilterChange("dateRange", value)
      }), /* @__PURE__ */ jsx(FilterDropdown, {
        label: "Growth Metric",
        value: filters.metricType,
        options: metricOptions,
        onChange: (value) => handleFilterChange("metricType", value)
      })]
    })
  });
}
try {
  GoalFilters.displayName = "GoalFilters";
} catch (error) {
}
function GoalStats({
  goals
}) {
  const totalGoals = goals.length;
  const acceptedGoals = goals.filter((g) => g.acceptedAt && !g.deletedAt).length;
  const completedGoals = goals.filter((g) => g.completedAt).length;
  const completionRate = totalGoals > 0 ? Math.round(completedGoals / totalGoals * 100) : 0;
  return /* @__PURE__ */ jsxs("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-4",
    children: [/* @__PURE__ */ jsx(Card, {
      className: "animate-fade-in bg-white dark:bg-gray-800 border-2 dark:border-gray-700",
      children: /* @__PURE__ */ jsxs(CardContent, {
        className: "p-4",
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-sm text-black/70 dark:text-white/90 font-medium",
          children: "Total Goals"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-2xl font-bold text-black dark:text-white",
          children: totalGoals
        })]
      })
    }), /* @__PURE__ */ jsx(Card, {
      className: "animate-fade-in bg-white dark:bg-gray-800 border-2 dark:border-gray-700",
      style: {
        animationDelay: "0.1s"
      },
      children: /* @__PURE__ */ jsxs(CardContent, {
        className: "p-4",
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-sm text-black/70 dark:text-white/90 font-medium",
          children: "Accepted"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-2xl font-bold text-black dark:text-white",
          children: acceptedGoals
        })]
      })
    }), /* @__PURE__ */ jsx(Card, {
      className: "animate-fade-in bg-white dark:bg-gray-800 border-2 dark:border-gray-700",
      style: {
        animationDelay: "0.2s"
      },
      children: /* @__PURE__ */ jsxs(CardContent, {
        className: "p-4",
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-sm text-black/70 dark:text-white/90 font-medium",
          children: "Completed"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-2xl font-bold text-black dark:text-white",
          children: completedGoals
        })]
      })
    }), /* @__PURE__ */ jsx(Card, {
      className: "animate-fade-in bg-white dark:bg-gray-800 border-2 dark:border-gray-700",
      style: {
        animationDelay: "0.3s"
      },
      children: /* @__PURE__ */ jsxs(CardContent, {
        className: "p-4",
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-sm text-black/70 dark:text-white/90 font-medium",
          children: "Completion Rate"
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-2xl font-bold text-black dark:text-white",
          children: [completionRate, "%"]
        })]
      })
    })]
  });
}
try {
  GoalStats.displayName = "GoalStats";
} catch (error) {
}
function GoalDashboard({
  initialGoals = [],
  actionData
}) {
  const [goals, setGoals] = useState(initialGoals);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    metricType: "all"
  });
  useEffect(() => {
    if (actionData?.goal) {
      setGoals((prevGoals) => prevGoals.map((goal) => goal.id === actionData.goal?.id ? actionData.goal : goal));
    }
  }, [actionData]);
  useEffect(() => {
    setIsLoading(true);
    const filteredGoals = initialGoals.filter((goal) => {
      if (filters.status !== "all") {
        if (filters.status === "suggested" && (goal.acceptedAt || goal.completedAt || goal.deletedAt)) {
          return false;
        }
        if (filters.status === "accepted" && (!goal.acceptedAt || goal.completedAt || goal.deletedAt)) {
          return false;
        }
        if (filters.status === "completed" && (!goal.completedAt || goal.deletedAt)) {
          return false;
        }
        if (filters.status === "deleted" && !goal.deletedAt) {
          return false;
        }
      }
      if (filters.metricType !== "all" && goal.relatedMetricType !== filters.metricType) {
        return false;
      }
      if (filters.dateRange !== "all") {
        const now = /* @__PURE__ */ new Date();
        const goalDate = new Date(goal.suggestedAt);
        if (filters.dateRange === "today") {
          return goalDate.toDateString() === now.toDateString();
        }
        if (filters.dateRange === "week") {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return goalDate >= weekAgo;
        }
        if (filters.dateRange === "month") {
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          return goalDate >= monthAgo;
        }
      }
      return true;
    });
    setGoals(filteredGoals);
    setIsLoading(false);
  }, [filters, initialGoals]);
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6 animate-fade-in",
    children: [/* @__PURE__ */ jsx("div", {
      className: "flex justify-between items-center mb-6",
      children: /* @__PURE__ */ jsx("h2", {
        className: "text-2xl font-heading text-black dark:text-white",
        children: "Your Growth Goals"
      })
    }), /* @__PURE__ */ jsx(GoalStats, {
      goals
    }), /* @__PURE__ */ jsx(GoalFilters, {
      filters,
      setFilters
    }), isLoading ? /* @__PURE__ */ jsx("div", {
      className: "flex justify-center py-8 rounded-base border-2 border-border dark:border-darkBorder bg-main-50 dark:bg-main-900/20 animate-pulse",
      children: /* @__PURE__ */ jsx("p", {
        className: "text-black dark:text-white",
        children: "Loading goals..."
      })
    }) : /* @__PURE__ */ jsx(GoalList, {
      goals
    })]
  });
}
try {
  GoalDashboard.displayName = "GoalDashboard";
} catch (error) {
}
class GoalServiceError2 extends Error {
  constructor(message, originalError) {
    super(message);
    this.originalError = originalError;
    this.name = "GoalServiceError";
  }
}
class GoalService2 {
  static async getGoals(filters, options = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        if (filters.userId) {
          queryParams.append("userId", filters.userId);
        }
        if (filters.status && filters.status !== "all") {
          queryParams.append("status", filters.status);
        }
        if (filters.dateRange && filters.dateRange !== "all") {
          queryParams.append("dateRange", filters.dateRange);
        }
        if (filters.metricType && filters.metricType !== "all") {
          queryParams.append("metricType", filters.metricType);
        }
      }
      const response = await ApiClient.get(`/api/goals?${queryParams}`, options);
      return response.data.goals;
    } catch (error) {
      throw new GoalServiceError2("Failed to fetch goals", error);
    }
  }
  static async acceptGoal(goalId, options = {}) {
    try {
      const response = await ApiClient.post(`/api/goals/${goalId}/accept`, {}, options);
      return response.data.goal;
    } catch (error) {
      throw new GoalServiceError2(`Failed to accept goal with id ${goalId}`, error);
    }
  }
  static async completeGoal(goalId, options = {}) {
    try {
      const response = await ApiClient.post(`/api/goals/${goalId}/complete`, {}, options);
      return response.data.goal;
    } catch (error) {
      throw new GoalServiceError2(`Failed to complete goal with id ${goalId}`, error);
    }
  }
  static async deleteGoal(goalId, options = {}) {
    try {
      await ApiClient.delete(`/api/goals/${goalId}`, options);
    } catch (error) {
      throw new GoalServiceError2(`Failed to delete goal with id ${goalId}`, error);
    }
  }
  static async getNewGoalsCount(userId, options = {}) {
    try {
      if (!userId) {
        return 0;
      }
      const queryParams = new URLSearchParams();
      queryParams.append("userId", userId);
      const response = await ApiClient.get(`/api/goals/new-count?${queryParams}`, options);
      return response.data.count || 0;
    } catch (error) {
      console.error("Failed to get new goals count:", error);
      return 0;
    }
  }
  static async generateGoals(entryId, options = {}) {
    try {
      const response = await ApiClient.post("/api/goals/generate", { entryId }, options);
      return response.data.goals || [];
    } catch (error) {
      throw new GoalServiceError2(`Failed to generate goals for entry ${entryId}`, error);
    }
  }
  static async getGoalAnalytics(userId, dateRange, options = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("userId", userId);
      if (dateRange) {
        queryParams.append("startDate", dateRange.startDate);
        queryParams.append("endDate", dateRange.endDate);
      }
      const response = await ApiClient.get(`/api/goals/analytics?${queryParams}`, options);
      return response.data.analytics;
    } catch (error) {
      throw new GoalServiceError2("Failed to fetch goal analytics", error);
    }
  }
}
const loader$7 = async ({
  request
}) => {
  try {
    console.log("Goal tracking loader: Starting to fetch user session");
    const {
      authToken,
      sessionToken,
      userId
    } = await requireUserSession(request);
    console.log("Goal tracking loader: User session retrieved", {
      hasAuthToken: !!authToken,
      hasSessionToken: !!sessionToken,
      hasUserId: !!userId
    });
    const session = await getSession(request);
    const userIdFromSession = userId || session.get("userId");
    console.log("User ID for API call:", userIdFromSession);
    if (!userIdFromSession) {
      console.error("No user ID found in session");
      return json$1({
        goals: [],
        error: "User ID not found"
      });
    }
    const goals = await GoalService2.getGoals({
      userId: userIdFromSession
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken
      }
    });
    return json$1({
      goals
    });
  } catch (error) {
    console.error("Error loading goals:", error);
    console.log("Error type:", typeof error);
    console.log("Error properties:", Object.keys(error || {}));
    console.log("Error stringified:", JSON.stringify(error, null, 2));
    if (error && error.originalError) {
      const originalError = error.originalError;
      console.log("Original error:", originalError);
      console.log("Original error message:", originalError.message);
      if (originalError.message && originalError.message.includes('relation "goals" does not exist')) {
        console.log("Detected database relation error - goals table does not exist");
        return json$1({
          goals: [],
          error: "The goals feature is not yet available. Please check back later."
        });
      }
    }
    return json$1({
      goals: [],
      error: "Failed to load goals. Please try again later."
    });
  }
};
async function action$8({
  request
}) {
  const formData = await request.formData();
  const _action = formData.get("_action");
  const goalId = formData.get("goalId");
  if (!goalId) {
    return json$1({
      error: "Goal ID is required"
    }, {
      status: 400
    });
  }
  try {
    const {
      userId
    } = await requireUserSession(request);
    const session = await getSession(request);
    const userIdFromSession = userId || session.get("userId");
    console.log("User ID for API call (action):", userIdFromSession);
    if (!userIdFromSession) {
      console.error("No user ID found in session");
      return json$1({
        error: "User ID not found"
      }, {
        status: 400
      });
    }
    switch (_action) {
      case "acceptGoal":
        console.log("Processing acceptGoal action with ID:", goalId);
        try {
          const {
            authToken,
            sessionToken
          } = await requireUserSession(request);
          const updatedGoal = await GoalService2.acceptGoal(goalId, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "x-session-token": sessionToken
            }
          });
          console.log("Goal accepted successfully:", updatedGoal);
          return json$1({
            goal: updatedGoal,
            success: true
          }, {
            headers: {
              "Content-Type": "application/json"
            }
          });
        } catch (error) {
          console.error("Error accepting goal:", error);
          return json$1({
            error: "Failed to accept goal"
          }, {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          });
        }
      case "completeGoal":
        console.log("Processing completeGoal action with ID:", goalId);
        try {
          const {
            authToken,
            sessionToken
          } = await requireUserSession(request);
          const updatedGoal = await GoalService2.completeGoal(goalId, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "x-session-token": sessionToken
            }
          });
          console.log("Goal completed successfully:", updatedGoal);
          return json$1({
            goal: updatedGoal,
            success: true
          }, {
            headers: {
              "Content-Type": "application/json"
            }
          });
        } catch (error) {
          console.error("Error completing goal:", error);
          return json$1({
            error: "Failed to complete goal"
          }, {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          });
        }
      case "deleteGoal":
        console.log("Processing deleteGoal action with ID:", goalId);
        try {
          const {
            authToken,
            sessionToken
          } = await requireUserSession(request);
          await GoalService2.deleteGoal(goalId, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "x-session-token": sessionToken
            }
          });
          console.log("Goal deleted successfully:", goalId);
          return json$1({
            success: true,
            goalId
          }, {
            headers: {
              "Content-Type": "application/json"
            },
            status: 200
            // Explicitly set 200 status code
          });
        } catch (error) {
          console.error("Error deleting goal:", error);
          return json$1({
            error: "Failed to delete goal",
            success: false
          }, {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          });
        }
      default:
        return json$1({
          error: "Invalid action"
        }, {
          status: 400
        });
    }
  } catch (error) {
    console.error(`Error performing ${_action}:`, error);
    return json$1({
      error: `Failed to perform ${_action}`,
      success: false
    }, {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
function GoalTracking() {
  const {
    goals,
    error
  } = useLoaderData();
  const actionData = useActionData();
  return /* @__PURE__ */ jsx(MainLayout, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "container max-w-4xl mx-auto p-4 pt-2 space-y-3",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-bold mb-1",
        children: "Goal Tracking"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-gray-600",
        children: "Track your personalized growth goals generated from your journal entries."
      }), error && /* @__PURE__ */ jsx("div", {
        className: "bg-amber-50 border-l-4 border-amber-400 p-4 mb-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex",
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex-shrink-0",
            children: /* @__PURE__ */ jsx("svg", {
              className: "h-5 w-5 text-amber-400",
              viewBox: "0 0 20 20",
              fill: "currentColor",
              children: /* @__PURE__ */ jsx("path", {
                fillRule: "evenodd",
                d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
                clipRule: "evenodd"
              })
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "ml-3",
            children: /* @__PURE__ */ jsx("p", {
              className: "text-sm text-amber-700",
              children: error
            })
          })]
        })
      }), /* @__PURE__ */ jsx(GoalDashboard, {
        initialGoals: goals,
        actionData
      })]
    })
  });
}
try {
  GoalTracking.displayName = "GoalTracking";
} catch (error) {
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  default: GoalTracking,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
function HabitBuilder() {
  return /* @__PURE__ */ jsx(MainLayout, {
    children: /* @__PURE__ */ jsx("div", {
      className: "container max-w-4xl mx-auto p-6 space-y-6",
      children: /* @__PURE__ */ jsx("h1", {
        children: "Habit Builder"
      })
    })
  });
}
try {
  HabitBuilder.displayName = "HabitBuilder";
} catch (error) {
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: HabitBuilder
}, Symbol.toStringTag, { value: "Module" }));
function LearningPath() {
  return /* @__PURE__ */ jsx(MainLayout, {
    children: /* @__PURE__ */ jsx("div", {
      className: "container max-w-4xl mx-auto p-6 space-y-6",
      children: /* @__PURE__ */ jsx("h1", {
        children: "Learning Path"
      })
    })
  });
}
try {
  LearningPath.displayName = "LearningPath";
} catch (error) {
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: LearningPath
}, Symbol.toStringTag, { value: "Module" }));
async function action$7({
  request
}) {
  return logout(request);
}
async function loader$6() {
  return redirect("/login");
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
function ActionItems() {
  return /* @__PURE__ */ jsx(MainLayout, {
    children: /* @__PURE__ */ jsx("div", {
      className: "container max-w-4xl mx-auto p-6 space-y-6",
      children: /* @__PURE__ */ jsx("h1", {
        children: "Action Items"
      })
    })
  });
}
try {
  ActionItems.displayName = "ActionItems";
} catch (error) {
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ActionItems
}, Symbol.toStringTag, { value: "Module" }));
async function action$6({
  request
}) {
  const {
    authToken,
    sessionToken
  } = await requireUserSession(request);
  const formData = await request.formData();
  const name = formData.get("name");
  if (!name) {
    return new Response("Name is required", {
      status: 400
    });
  }
  try {
    await JournalService.createJournal(name, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken
      }
    });
    return redirect("/dashboard");
  } catch (error) {
    return new Response("Failed to create journal", {
      status: 500
    });
  }
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6
}, Symbol.toStringTag, { value: "Module" }));
async function loader$5({
  request
}) {
  const session = await getSession(request);
  const authToken = session.get("authToken");
  const sessionToken = session.get("sessionToken");
  if (authToken && sessionToken) {
    return redirect("/");
  }
  return json$1({});
}
async function action$5({
  request
}) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const errors = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (Object.keys(errors).length > 0 || !email || !password) {
    return json$1({
      errors
    }, {
      status: 400
    });
  }
  try {
    const response = await AuthService.login({
      email,
      password
    });
    const cookie = await setAuthTokens(request, response.token, response.sessionToken, response.user.id);
    return redirect("/journal/new", {
      headers: {
        "Set-Cookie": cookie
      }
    });
  } catch (error) {
    return json$1({
      errors: {
        _form: "Invalid email or password"
      }
    }, {
      status: 401
    });
  }
}
function LoginPage() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isSubmitting = navigation.state === "submitting";
  const errorMessage = searchParams.get("error");
  return /* @__PURE__ */ jsx("div", {
    className: "container flex h-screen w-screen flex-col items-center justify-center",
    children: /* @__PURE__ */ jsxs("div", {
      className: "mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex flex-col space-y-2 text-center",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-2xl font-semibold tracking-tight text-text dark:text-darkText",
          children: "Welcome back"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-text dark:text-darkText",
          children: "Enter your email to sign in to your account"
        })]
      }), errorMessage && /* @__PURE__ */ jsx("div", {
        className: "rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/10 dark:text-red-400",
        children: errorMessage
      }), /* @__PURE__ */ jsxs(Form$1, {
        method: "post",
        className: "space-y-4",
        children: [/* @__PURE__ */ jsxs(FormField, {
          children: [/* @__PURE__ */ jsx(FormLabel, {
            htmlFor: "email",
            className: "text-text dark:text-darkText",
            children: "Email"
          }), /* @__PURE__ */ jsx(Input, {
            id: "email",
            type: "email",
            name: "email",
            placeholder: "name@example.com",
            className: "bg-white dark:bg-secondaryBlack text-text dark:text-darkText border-2 border-border dark:border-darkBorder",
            required: true
          }), actionData?.errors?.email && /* @__PURE__ */ jsx(FormMessage, {
            children: actionData.errors.email
          })]
        }), /* @__PURE__ */ jsxs(FormField, {
          children: [/* @__PURE__ */ jsx(FormLabel, {
            htmlFor: "password",
            className: "text-text dark:text-darkText",
            children: "Password"
          }), /* @__PURE__ */ jsx(Input, {
            id: "password",
            type: "password",
            name: "password",
            className: "bg-white dark:bg-secondaryBlack text-text dark:text-darkText border-2 border-border dark:border-darkBorder",
            required: true
          }), actionData?.errors?.password && /* @__PURE__ */ jsx(FormMessage, {
            children: actionData.errors.password
          })]
        }), actionData?.errors?._form && /* @__PURE__ */ jsx(FormMessage, {
          children: actionData.errors._form
        }), /* @__PURE__ */ jsx(Button, {
          type: "submit",
          className: "w-full",
          disabled: isSubmitting,
          children: isSubmitting ? "Signing in..." : "Sign in"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "text-center text-sm text-text dark:text-darkText",
        children: ["Don't have an account?", " ", /* @__PURE__ */ jsx(Link, {
          to: "/register",
          className: "underline hover:text-gray-800 dark:hover:text-gray-200",
          children: "Sign up"
        })]
      })]
    })
  });
}
try {
  LoginPage.displayName = "LoginPage";
} catch (error) {
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  default: LoginPage,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const loader$4 = async ({
  request
}) => {
  const {
    authToken,
    sessionToken
  } = await requireUserSession(request);
  const journals = await JournalService.getJournals({
    headers: {
      Authorization: `Bearer ${authToken}`,
      "x-session-token": sessionToken
    }
  });
  const selectedJournalId = await getSelectedJournalId(request);
  let entries = [];
  if (selectedJournalId) {
    entries = await JournalService.getEntries(selectedJournalId, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken
      }
    });
  }
  return json$1({
    journals,
    entries,
    selectedJournalId
  });
};
async function action$4({
  request
}) {
  const {
    authToken,
    sessionToken
  } = await requireUserSession(request);
  const formData = await request.formData();
  const journalId = formData.get("journalId");
  const content = formData.get("content");
  console.log("Content: ", content);
  if (!content || typeof content !== "string" || !content.trim()) {
    return json$1({
      error: "Please write something before saving"
    }, {
      status: 400
    });
  }
  if (!journalId) {
    return json$1({
      error: "Please select a journal before saving"
    }, {
      status: 400
    });
  }
  try {
    await JournalService.createEntry(journalId, content, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken
      }
    });
    return json$1({
      success: true
    });
  } catch (error) {
    console.error("Failed to save entry:", error);
    return json$1({
      error: error instanceof Error ? error.message : "Failed to save entry"
    }, {
      status: 500
    });
  }
}
const meta$1 = () => {
  return [{
    title: "Today's Journal Entry"
  }, {
    name: "description",
    content: "Record your thoughts, feelings, and experiences for today"
  }];
};
function ErrorBoundary() {
  return /* @__PURE__ */ jsxs("div", {
    className: "p-4 text-red-500 bg-red-50 rounded-lg",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-xl font-bold",
      children: "Something went wrong"
    }), /* @__PURE__ */ jsx("p", {
      children: "There was an error loading or saving your journal entry. Please try again later."
    })]
  });
}
try {
  ErrorBoundary.displayName = "ErrorBoundary";
} catch (error) {
}
const TherapeuticJournalEntry = () => {
  const [content, setContent] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();
  const {
    selectedJournalId
  } = useOutletContext();
  const {
    entries
  } = useLoaderData();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  useEffect(() => {
    if (fetcher.state === "idle" && "success" in (fetcher.data || {})) {
      setShowSuccess(true);
      setIsMounted(true);
      setContent("");
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3e3);
      return () => clearTimeout(timer);
    }
  }, [fetcher.state, fetcher.data]);
  useEffect(() => {
    let unmountTimer;
    if (!showSuccess && isMounted) {
      unmountTimer = window.setTimeout(() => {
        setIsMounted(false);
      }, 500);
    }
    return () => {
      if (unmountTimer) window.clearTimeout(unmountTimer);
    };
  }, [showSuccess, isMounted]);
  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
  return /* @__PURE__ */ jsxs(MainLayout, {
    children: [/* @__PURE__ */ jsxs("div", {
      className: "container max-w-4xl mx-auto p-4 pt-2 space-y-3 animate-fade-in",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-bold mb-1",
        children: "Today's Journal Entry"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-gray-600 dark:text-gray-400",
        children: "Record your thoughts, feelings, and experiences for today."
      }), /* @__PURE__ */ jsxs(fetcher.Form, {
        method: "post",
        className: "flex-1 flex flex-col",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "grid grid-cols-2 md:grid-cols-2 gap-4 mb-6",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "animate-fade-in bg-white dark:bg-gray-800 border-2 dark:border-gray-700 rounded-lg p-4",
            children: [/* @__PURE__ */ jsx("p", {
              className: "text-sm text-black/70 dark:text-white/90 font-medium",
              children: "Date"
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-1.5 text-xl font-bold text-black dark:text-white",
              children: [/* @__PURE__ */ jsx(Calendar, {
                className: "w-4 h-4 text-blue-600 dark:text-blue-400"
              }), /* @__PURE__ */ jsx("span", {
                children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "animate-fade-in bg-white dark:bg-gray-800 border-2 dark:border-gray-700 rounded-lg p-4",
            style: {
              animationDelay: "0.1s"
            },
            children: [/* @__PURE__ */ jsx("p", {
              className: "text-sm text-black/70 dark:text-white/90 font-medium",
              children: "Time"
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-1.5 text-xl font-bold text-black dark:text-white",
              children: [/* @__PURE__ */ jsx(Clock, {
                className: "w-4 h-4 text-blue-600 dark:text-blue-400"
              }), /* @__PURE__ */ jsx("span", {
                children: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              })]
            })]
          })]
        }), /* @__PURE__ */ jsx("input", {
          type: "hidden",
          name: "journalId",
          value: selectedJournalId || ""
        }), /* @__PURE__ */ jsx("input", {
          type: "hidden",
          name: "content",
          value: content
        }), /* @__PURE__ */ jsx("div", {
          className: "flex-1 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden",
          children: /* @__PURE__ */ jsx(Editor, {
            onChange: setContent,
            initialContent: content
          })
        }), isMounted && /* @__PURE__ */ jsxs("div", {
          className: `bg-green-100 dark:bg-green-900/70 border-2 border-green-600 dark:border-green-400 p-4 rounded-base shadow-md mt-4 mb-4 flex items-center gap-3 ${showSuccess ? "animate-in fade-in" : "animate-out fade-out duration-500"}`,
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex-shrink-0",
            children: /* @__PURE__ */ jsx("svg", {
              className: "h-5 w-5 text-green-700 dark:text-green-300",
              viewBox: "0 0 20 20",
              fill: "currentColor",
              children: /* @__PURE__ */ jsx("path", {
                fillRule: "evenodd",
                d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                clipRule: "evenodd"
              })
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "ml-3",
            children: /* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium text-green-800 dark:text-green-200",
              children: "Journal entry saved successfully!"
            })
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex justify-end mt-6",
          children: /* @__PURE__ */ jsxs(Button, {
            type: "submit",
            variant: "default",
            className: "px-8 py-2 text-base bg-green-600 hover:bg-green-700 text-white font-medium",
            disabled: isSubmitting || !content?.trim(),
            "aria-label": "Save journal entry",
            "aria-busy": isSubmitting,
            children: [isSubmitting ? /* @__PURE__ */ jsx(Loader2, {
              className: "w-5 h-5 animate-spin mr-2",
              "aria-hidden": "true"
            }) : /* @__PURE__ */ jsx(Save, {
              className: "w-5 h-5 mr-2",
              "aria-hidden": "true"
            }), "Save Entry"]
          })
        })]
      })]
    }), !isSidebarOpen && /* @__PURE__ */ jsx("button", {
      onClick: () => setIsSidebarOpen(true),
      className: "fixed right-4 top-20 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105 z-20",
      "aria-label": "Show entry history",
      children: /* @__PURE__ */ jsx(History, {
        className: "w-5 h-5"
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: `fixed top-0 right-0 h-screen z-50 transition-all duration-300 bg-white dark:bg-gray-800 border-l dark:border-gray-700 shadow-lg ${isSidebarOpen ? "w-80 md:w-96" : "w-0 overflow-hidden"}`,
      style: {
        marginTop: "60px"
      },
      children: [/* @__PURE__ */ jsx("button", {
        onClick: () => setIsSidebarOpen(!isSidebarOpen),
        className: "absolute -left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors",
        "aria-label": isSidebarOpen ? "Collapse sidebar" : "Expand sidebar",
        children: isSidebarOpen ? /* @__PURE__ */ jsx(ChevronRight, {
          className: "w-4 h-4 text-black dark:text-white"
        }) : /* @__PURE__ */ jsx(ChevronLeft, {
          className: "w-4 h-4 text-black dark:text-white"
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "p-4 text-black dark:text-white",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between mb-6",
          children: [/* @__PURE__ */ jsxs("h2", {
            className: "text-2xl font-heading text-black dark:text-white flex items-center",
            children: [/* @__PURE__ */ jsx(History, {
              className: "w-5 h-5 mr-2"
            }), "Recent Entries"]
          }), /* @__PURE__ */ jsxs("div", {
            className: "text-sm bg-main-100 dark:bg-main-900/70 text-black dark:text-white px-2 py-1 rounded-base font-medium border-2 border-border dark:border-main-600",
            children: [sortedEntries.length, " ", sortedEntries.length === 1 ? "entry" : "entries"]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "overflow-y-auto max-h-[calc(100vh-12rem)] pr-2",
          children: sortedEntries.length === 0 ? /* @__PURE__ */ jsxs("div", {
            className: "text-center py-8 text-black/70 dark:text-white/70",
            children: [/* @__PURE__ */ jsx("div", {
              className: "mb-2",
              children: "No entries yet"
            }), /* @__PURE__ */ jsx("div", {
              className: "text-sm",
              children: "Start journaling to see your entries here"
            })]
          }) : sortedEntries.map((entry2) => {
            const entryDate = new Date(entry2.createdAt);
            const today = /* @__PURE__ */ new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            let dateDisplay;
            if (entryDate.toDateString() === today.toDateString()) {
              dateDisplay = "Today";
            } else if (entryDate.toDateString() === yesterday.toDateString()) {
              dateDisplay = "Yesterday";
            } else {
              dateDisplay = entryDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              });
            }
            const previewText = entry2.content.replace(/<[^>]*>/g, "");
            return /* @__PURE__ */ jsxs("div", {
              role: "button",
              tabIndex: 0,
              onClick: () => navigate(`/journal/edit/${entry2.id}`),
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/journal/edit/${entry2.id}`);
                }
              },
              className: "cursor-pointer bg-white dark:bg-gray-800 rounded-lg p-2.5 hover:bg-accent/10 border-2 border-gray-200 dark:border-gray-700 mb-2 transition-colors goal-list-item",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex justify-between items-start mb-1",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "text-sm font-medium flex items-center",
                  children: [/* @__PURE__ */ jsx(Calendar, {
                    className: "w-3 h-3 mr-1 text-primary"
                  }), dateDisplay, /* @__PURE__ */ jsx("span", {
                    className: "mx-1 text-black/50 dark:text-white/50",
                    children: "·"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "text-xs text-black/70 dark:text-white/70",
                    children: entryDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  })]
                }), /* @__PURE__ */ jsx(ChevronRight, {
                  className: "w-3 h-3 text-black/60 dark:text-white/60"
                })]
              }), /* @__PURE__ */ jsx("div", {
                className: "text-xs line-clamp-2 text-black/70 dark:text-white/70",
                children: previewText || "<Empty entry>"
              })]
            }, entry2.id);
          })
        })]
      })]
    })]
  });
};
try {
  TherapeuticJournalEntry.displayName = "TherapeuticJournalEntry";
} catch (error) {
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  action: action$4,
  default: TherapeuticJournalEntry,
  loader: loader$4,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const loader$3 = async () => {
  return json$1({ success: true });
};
const action$3 = async ({ request }) => {
  const formData = await request.formData();
  const journalId = formData.get("journalId");
  const action2 = formData.get("_action");
  if (action2 !== "setJournal" || !journalId || typeof journalId !== "string") {
    return json$1({ success: false }, { status: 400 });
  }
  return json$1(
    { success: true },
    {
      headers: {
        "Set-Cookie": await setSelectedJournalId(journalId)
      }
    }
  );
};
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
function Milestones() {
  return /* @__PURE__ */ jsx(MainLayout, {
    children: /* @__PURE__ */ jsx("div", {
      className: "container max-w-4xl mx-auto p-6 space-y-6",
      children: /* @__PURE__ */ jsx("h1", {
        children: "Milestone Tracker"
      })
    })
  });
}
try {
  Milestones.displayName = "Milestones";
} catch (error) {
}
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Milestones
}, Symbol.toStringTag, { value: "Module" }));
function DashboardLayout() {
  return /* @__PURE__ */ jsx(MainLayout, {
    children: /* @__PURE__ */ jsx(Outlet, {})
  });
}
try {
  DashboardLayout.displayName = "DashboardLayout";
} catch (error) {
}
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DashboardLayout
}, Symbol.toStringTag, { value: "Module" }));
const action$2 = async ({
  request
}) => {
  const formData = await request.formData();
  const theme = formData.get("theme");
  if (typeof theme !== "string") {
    return json$1({
      success: false
    });
  }
  return json$1({
    success: true
  }, {
    headers: {
      "Set-Cookie": await themeCookie.serialize(theme)
    }
  });
};
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2
}, Symbol.toStringTag, { value: "Module" }));
async function loader$2({ request }) {
  try {
    const userInfo = await UserInfoService.getUserInfo(request);
    return json$1(
      { userInfo },
      {
        headers: {
          "Cache-Control": "private, max-age=60"
        }
      }
    );
  } catch (error) {
    console.error("Error in user-info loader:", error);
    if (error instanceof UserInfoServiceError) {
      throw json$1({ error: error.message }, { status: 500 });
    }
    throw json$1({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
async function action$1({ request }) {
  if (request.method !== "POST") {
    return json$1({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const formData = await request.formData();
    const userInfo = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      timezone: formData.get("timezone"),
      bio: formData.get("bio")
    };
    await UserInfoService.updateUserInfo(request, userInfo);
    return json$1({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating user info:", error);
    if (error instanceof UserInfoServiceError) {
      return json$1({ error: error.message }, { status: 500 });
    }
    return json$1({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
function Progress() {
  return /* @__PURE__ */ jsx(MainLayout, {
    children: /* @__PURE__ */ jsx("div", {
      className: "container max-w-4xl mx-auto p-6 space-y-6",
      children: /* @__PURE__ */ jsx("h1", {
        children: "Progress"
      })
    })
  });
}
try {
  Progress.displayName = "Progress";
} catch (error) {
}
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Progress
}, Symbol.toStringTag, { value: "Module" }));
async function requireAuth(request) {
  const authToken = await getAuthToken(request);
  const sessionToken = await getSessionToken(request);
  if (!authToken || !sessionToken) {
    throw redirect("/login?error=Please log in to continue");
  }
  try {
    await Promise.all([
      AuthService.verifyAuthToken(authToken),
      AuthService.verifySessionToken(sessionToken)
    ]);
    return { authToken, sessionToken };
  } catch (error) {
    const message = error instanceof AuthenticationError ? error.message : "Your session has expired. Please log in again.";
    throw redirect(`/login?error=${encodeURIComponent(message)}`);
  }
}
function Article() {
  return /* @__PURE__ */ jsxs("article", {
    className: "prose-p:text-text dark:prose-p:text-darkText mx-auto w-[700px] py-20 leading-relaxed prose-h2:mb-8 prose-headings:font-heading prose-h2:text-2xl prose-h3:mb-6 prose-h3:text-xl prose-p:leading-7 prose-p:font-base prose-code:p-[3px] prose-a:underline prose-a:font-heading prose-code:mx-1 prose-code:rounded-base prose-code:font-bold prose-code:border prose-code:text-text prose-code:text-sm prose-code:border-border dark:prose-code:border-darkBorder prose-code:bg-main prose-code:px-2 m1000:w-[500px] m750:w-4/5 m400:w-full m400:py-16 prose-h2:m400:text-xl prose-h3:m400:text-lg",
    children: ["Replace with landing page", /* @__PURE__ */ jsx("p", {
      children: /* @__PURE__ */ jsx(Link, {
        to: "/dashboard",
        className: "underline",
        children: "Go to the dashboard"
      })
    })]
  });
}
try {
  Article.displayName = "Article";
} catch (error) {
}
async function loader$1({
  request
}) {
  requireAuth(request);
  return json$1({});
}
const meta = () => {
  return [{
    title: "Journal Up"
  }, {
    name: "Journal Up",
    content: "A safe space for emotional processing and self-reflection with AI-guided support."
  }];
};
function Index() {
  return /* @__PURE__ */ jsx(Article, {});
}
try {
  Index.displayName = "Index";
} catch (error) {
}
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader: loader$1,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function AuthLayout() {
  return /* @__PURE__ */ jsxs("div", {
    className: "flex",
    children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx("div", {
      className: "hidden md:flex flex flex-col w-full justify-center items-center border-2 bg-slate-600",
      children: /* @__PURE__ */ jsx("img", {
        className: "w-full h-full object-cover",
        src: "/login_image.webp",
        alt: "A woman writing in a notebook"
      })
    })]
  });
}
try {
  AuthLayout.displayName = "AuthLayout";
} catch (error) {
}
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AuthLayout
}, Symbol.toStringTag, { value: "Module" }));
const ChatClientError = void 0;
const ChatClient = void 0;
const loader = async ({
  request
}) => {
  await requireUserSession(request);
  return null;
};
async function action({
  request
}) {
  const formData = await request.formData();
  const message = formData.get("message");
  console.log("Received message:", message);
  try {
    return json$1({
      message: "Message sent"
    });
  } catch (error) {
    const errorMessage = "Failed to send message";
    return json$1({
      error: errorMessage
    }, {
      status: 500
    });
  }
}
function Chat() {
  const formRef = useRef(null);
  const chatEndRef = useRef(null);
  const assistantMessageIdRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const {
    userInfo
  } = useUserInfo();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const content = formData.get("message");
    if (!content.trim()) return;
    const tempId = `temp-${Date.now()}`;
    const newMessage = {
      id: tempId,
      role: "user",
      content,
      status: "sending"
    };
    setMessages((prev) => [...prev, newMessage]);
    try {
      if (!userInfo) {
        throw new Error("User must be logged in to send messages");
      }
      const messageHistory = [...messages.map((m) => ({
        role: m.role,
        content: m.content
      })), {
        role: "user",
        content
      }];
      const assistantMessageId = window.crypto.randomUUID();
      assistantMessageIdRef.current = assistantMessageId;
      setMessages((currentMessages) => [...currentMessages, {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        status: "streaming",
        isPartial: true
      }]);
      const response = await ChatClient.sendMessage(messageHistory, userInfo.id);
      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages];
        const streamingMessageIndex = updatedMessages.findIndex((m) => m.id === assistantMessageId);
        if (streamingMessageIndex !== -1) {
          updatedMessages[streamingMessageIndex] = {
            ...updatedMessages[streamingMessageIndex],
            content: response.message,
            status: void 0,
            isPartial: false
          };
        }
        return updatedMessages;
      });
      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages];
        const pendingMessageIndex = updatedMessages.findIndex((m) => m.id === tempId);
        if (pendingMessageIndex !== -1) {
          updatedMessages[pendingMessageIndex] = {
            ...updatedMessages[pendingMessageIndex],
            status: void 0
          };
        }
        return updatedMessages;
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages];
        const pendingMessageIndex = updatedMessages.findIndex((m) => m.id === tempId);
        if (pendingMessageIndex !== -1) {
          updatedMessages[pendingMessageIndex] = {
            ...updatedMessages[pendingMessageIndex],
            status: "error"
          };
        }
        return updatedMessages;
      });
      setError(err instanceof ChatClientError ? err.message : "Failed to send message");
    }
    form.reset();
  };
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);
  useEffect(() => {
    let mounted = true;
    let reconnectTimeout;
    const initializeConnection = async () => {
      if (!mounted) return;
      if (!userInfo) {
        console.error("User information is not available.");
        return;
      }
      setIsConnecting(true);
      try {
        await ChatClient.sendMessage([], userInfo.id);
        if (mounted) {
          setIsConnecting(false);
          setError(null);
        }
      } catch (error2) {
        if (mounted) {
          console.error("Failed to initialize chat connection:", error2);
          setError("Failed to connect to chat server");
          setIsConnecting(false);
          reconnectTimeout = setTimeout(() => {
            if (mounted) {
              initializeConnection();
            }
          }, 5e3);
        }
      }
    };
    if (userInfo) {
      initializeConnection();
    }
    ChatClient.onStreamMessage((chunk) => {
      if (assistantMessageIdRef.current) {
        setMessages((currentMessages) => {
          const updatedMessages = [...currentMessages];
          const streamingMessageIndex = updatedMessages.findIndex((m) => m.id === assistantMessageIdRef.current);
          if (streamingMessageIndex !== -1) {
            updatedMessages[streamingMessageIndex] = {
              ...updatedMessages[streamingMessageIndex],
              content: updatedMessages[streamingMessageIndex].content + chunk,
              status: "receiving"
            };
          }
          return updatedMessages;
        });
      }
    });
    return () => {
      mounted = false;
      clearTimeout(reconnectTimeout);
      console.log("Chat component unmounting, cleaning up WebSocket connection");
      ChatClient.cleanup();
    };
  }, []);
  return /* @__PURE__ */ jsx(MainLayout, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto p-4",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex-1 overflow-y-auto space-y-4 mb-4",
        children: [error && /* @__PURE__ */ jsx("div", {
          className: "p-4 bg-red-100 text-red-700 rounded-base border-2 border-red-300",
          children: error
        }), messages.map((message) => /* @__PURE__ */ jsx("div", {
          className: cn("p-4 rounded-base border-2 border-border dark:border-darkBorder max-w-3xl", message.role === "user" ? "bg-white dark:bg-secondaryBlack ml-auto text-right" : "bg-main dark:bg-[#1e1e2d] mr-auto", message.status === "sending" && "opacity-70", message.status === "streaming" && "animate-pulse", message.status === "error" && "border-red-500"),
          children: /* @__PURE__ */ jsxs("div", {
            className: "prose dark:prose-invert max-w-none",
            children: [/* @__PURE__ */ jsx(ReactMarkdown, {
              children: message.content || " "
            }), message.status === "sending" && /* @__PURE__ */ jsx("span", {
              className: "text-sm text-gray-500 ml-2",
              children: "Sending..."
            }), message.status === "streaming" && /* @__PURE__ */ jsx("span", {
              className: "text-sm text-gray-500 ml-2",
              children: "Thinking..."
            }), message.status === "receiving" && /* @__PURE__ */ jsx("span", {
              className: "text-sm text-gray-500 ml-2",
              children: "▋"
            }), message.status === "error" && /* @__PURE__ */ jsx("span", {
              className: "text-sm text-red-500 ml-2",
              children: "Failed to send"
            })]
          })
        }, message.id)), /* @__PURE__ */ jsx("div", {
          ref: chatEndRef
        })]
      }), /* @__PURE__ */ jsxs(Form$1, {
        ref: formRef,
        onSubmit: handleSubmit,
        className: "flex gap-2",
        children: [/* @__PURE__ */ jsx(Input, {
          name: "message",
          placeholder: "Type your message...",
          className: "flex-1",
          required: true,
          disabled: isConnecting
        }), /* @__PURE__ */ jsx(Button, {
          type: "submit",
          disabled: isConnecting,
          variant: "default",
          children: isConnecting ? "Connecting..." : "Send"
        })]
      })]
    })
  });
}
try {
  Chat.displayName = "Chat";
} catch (error) {
}
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: Chat,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DteMDDIW.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/components-BHPXvVDC.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-CjDLOugG.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/components-BHPXvVDC.js", "/assets/index-CEyfX9sc.js", "/assets/ThemeProvider-CzisW-yi.js"], "css": [] }, "routes/api.goals.new-count": { "id": "routes/api.goals.new-count", "parentId": "root", "path": "api/goals/new-count", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.goals.new-count-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/journal.edit.$id": { "id": "routes/journal.edit.$id", "parentId": "root", "path": "journal/edit/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/journal.edit._id-DS5VeKHq.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/index-CEyfX9sc.js", "/assets/input-BDpRxrzF.js", "/assets/MainLayout-CXyh_vTo.js", "/assets/RichTextEditor-D8ptRzsE.js", "/assets/components-BHPXvVDC.js", "/assets/ThemeProvider-CzisW-yi.js"], "css": [] }, "routes/success-stories": { "id": "routes/success-stories", "parentId": "root", "path": "success-stories", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/success-stories-Bjh-wMGe.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/MainLayout-CXyh_vTo.js", "/assets/input-BDpRxrzF.js", "/assets/components-BHPXvVDC.js", "/assets/ThemeProvider-CzisW-yi.js"], "css": [] }, "routes/_auth.register": { "id": "routes/_auth.register", "parentId": "routes/_auth", "path": "register", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.register-C2nhJ43-.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/input-BDpRxrzF.js", "/assets/form-C5V-ndoN.js", "/assets/components-BHPXvVDC.js"], "css": [] }, "routes/goal-tracking": { "id": "routes/goal-tracking", "parentId": "root", "path": "goal-tracking", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/goal-tracking-BE-_nRUC.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/MainLayout-CXyh_vTo.js", "/assets/input-BDpRxrzF.js", "/assets/components-BHPXvVDC.js", "/assets/ThemeProvider-CzisW-yi.js"], "css": ["/assets/goal-animations-BOyywt_q.css"] }, "routes/habit-builder": { "id": "routes/habit-builder", "parentId": "root", "path": "habit-builder", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/habit-builder-BCRWqp2y.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/MainLayout-CXyh_vTo.js", "/assets/input-BDpRxrzF.js", "/assets/components-BHPXvVDC.js", "/assets/ThemeProvider-CzisW-yi.js"], "css": [] }, "routes/learning-path": { "id": "routes/learning-path", "parentId": "root", "path": "learning-path", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/learning-path-CCHdTOuU.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/MainLayout-CXyh_vTo.js", "/assets/input-BDpRxrzF.js", "/assets/components-BHPXvVDC.js", "/assets/ThemeProvider-CzisW-yi.js"], "css": [] }, "routes/_auth.logout": { "id": "routes/_auth.logout", "parentId": "routes/_auth", "path": "logout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.logout-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/action-items": { "id": "routes/action-items", "parentId": "root", "path": "action-items", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/action-items-CG3aVTWv.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/MainLayout-CXyh_vTo.js", "/assets/input-BDpRxrzF.js", "/assets/components-BHPXvVDC.js", "/assets/ThemeProvider-CzisW-yi.js"], "css": [] }, "routes/journals.new": { "id": "routes/journals.new", "parentId": "root", "path": "journals/new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/journals.new-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_auth.login": { "id": "routes/_auth.login", "parentId": "routes/_auth", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.login-CY_6SrZq.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/input-BDpRxrzF.js", "/assets/form-C5V-ndoN.js", "/assets/components-BHPXvVDC.js"], "css": [] }, "routes/journal.new": { "id": "routes/journal.new", "parentId": "root", "path": "journal/new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/journal.new-DyPOrFNx.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/input-BDpRxrzF.js", "/assets/MainLayout-CXyh_vTo.js", "/assets/RichTextEditor-D8ptRzsE.js", "/assets/components-BHPXvVDC.js", "/assets/ThemeProvider-CzisW-yi.js"], "css": ["/assets/goal-animations-BOyywt_q.css"] }, "routes/set-journal": { "id": "routes/set-journal", "parentId": "root", "path": "set-journal", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/set-journal-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/milestones": { "id": "routes/milestones", "parentId": "root", "path": "milestones", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/milestones-CkfROe41.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/MainLayout-CXyh_vTo.js", "/assets/input-BDpRxrzF.js", "/assets/components-BHPXvVDC.js", "/assets/ThemeProvider-CzisW-yi.js"], "css": [] }, "routes/dashboard": { "id": "routes/dashboard", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dashboard-DqdVUVtD.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/MainLayout-CXyh_vTo.js", "/assets/input-BDpRxrzF.js", "/assets/components-BHPXvVDC.js", "/assets/ThemeProvider-CzisW-yi.js"], "css": [] }, "routes/set-theme": { "id": "routes/set-theme", "parentId": "root", "path": "set-theme", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/set-theme-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/user-info": { "id": "routes/user-info", "parentId": "root", "path": "user-info", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/user-info-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/progress": { "id": "routes/progress", "parentId": "root", "path": "progress", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/progress-DFjU2JGl.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/MainLayout-CXyh_vTo.js", "/assets/input-BDpRxrzF.js", "/assets/components-BHPXvVDC.js", "/assets/ThemeProvider-CzisW-yi.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BCzOkY8j.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/components-BHPXvVDC.js"], "css": [] }, "routes/_auth": { "id": "routes/_auth", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth-w4ofP1T9.js", "imports": ["/assets/index-CNlnXVzn.js"], "css": [] }, "routes/chat": { "id": "routes/chat", "parentId": "root", "path": "chat", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/chat-DTWOelId.js", "imports": ["/assets/index-CNlnXVzn.js", "/assets/input-BDpRxrzF.js", "/assets/MainLayout-CXyh_vTo.js", "/assets/components-BHPXvVDC.js", "/assets/ThemeProvider-CzisW-yi.js"], "css": [] } }, "url": "/assets/manifest-c76c3731.js", "version": "c76c3731" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/api.goals.new-count": {
    id: "routes/api.goals.new-count",
    parentId: "root",
    path: "api/goals/new-count",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/journal.edit.$id": {
    id: "routes/journal.edit.$id",
    parentId: "root",
    path: "journal/edit/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/success-stories": {
    id: "routes/success-stories",
    parentId: "root",
    path: "success-stories",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/_auth.register": {
    id: "routes/_auth.register",
    parentId: "routes/_auth",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/goal-tracking": {
    id: "routes/goal-tracking",
    parentId: "root",
    path: "goal-tracking",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/habit-builder": {
    id: "routes/habit-builder",
    parentId: "root",
    path: "habit-builder",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/learning-path": {
    id: "routes/learning-path",
    parentId: "root",
    path: "learning-path",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/_auth.logout": {
    id: "routes/_auth.logout",
    parentId: "routes/_auth",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/action-items": {
    id: "routes/action-items",
    parentId: "root",
    path: "action-items",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/journals.new": {
    id: "routes/journals.new",
    parentId: "root",
    path: "journals/new",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/_auth.login": {
    id: "routes/_auth.login",
    parentId: "routes/_auth",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/journal.new": {
    id: "routes/journal.new",
    parentId: "root",
    path: "journal/new",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/set-journal": {
    id: "routes/set-journal",
    parentId: "root",
    path: "set-journal",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/milestones": {
    id: "routes/milestones",
    parentId: "root",
    path: "milestones",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/dashboard": {
    id: "routes/dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/set-theme": {
    id: "routes/set-theme",
    parentId: "root",
    path: "set-theme",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/user-info": {
    id: "routes/user-info",
    parentId: "root",
    path: "user-info",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/progress": {
    id: "routes/progress",
    parentId: "root",
    path: "progress",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route19
  },
  "routes/_auth": {
    id: "routes/_auth",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/chat": {
    id: "routes/chat",
    parentId: "root",
    path: "chat",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
