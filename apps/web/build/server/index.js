var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, createCookie, createCookieSessionStorage, redirect, json as json$1 } from "@remix-run/node";
import { RemixServer, useFetcher, useLoaderData, Meta, Links, Outlet, ScrollRestoration, Scripts, json, redirect as redirect$1, useLocation, useOutletContext, Form as Form$1, Link, useActionData, useNavigation } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import { createContext, useState, useEffect, useContext, useRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { X, PanelLeft, ChevronRight, Book, Target, MessageCircle, ListTodo, LineChart, Clock, ClipboardList, Star, Check, Circle, ChevronsUpDown, Plus, BadgeCheck, CreditCard, Bell, Moon, Sun, LogOut, Calendar, Sparkles, ChevronDown, Loader2, Save } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as LabelPrimitive from "@radix-ui/react-label";
import ReactMarkdown from "react-markdown";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
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
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
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
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const styles = "/assets/tailwind-BzsmNioR.css";
const themeCookie = createCookie("theme", {
  maxAge: 3456e4
  // 400 days
});
const themeConfig = {
  defaultTheme: "light",
  cookieName: "theme",
  storageKey: "app-theme"
};
const config = {
  api: {
    timeout: 5e3,
    maxRetries: 3
    // baseUrl: process.env.API_URL || "",
  },
  theme: themeConfig,
  meta: {
    defaultTitle: "My Remix App",
    defaultDescription: "A modern web application built with Remix"
  }
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
    fetcher.submit(
      { theme: newTheme },
      { action: "/set-theme", method: "post" }
    );
  };
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value: { theme, setTheme, toggleTheme }, children });
};
const useTheme = () => useContext(ThemeContext);
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
async function setAuthTokens(request, authToken, sessionToken) {
  const session = await getSession(request);
  session.set("authToken", authToken);
  session.set("sessionToken", sessionToken);
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
        "Set-Cookie": await destroySession(request)
      }
    });
  }
  try {
    await Promise.all([
      AuthService.verifyAuthToken(authToken),
      AuthService.verifySessionToken(sessionToken)
    ]);
    return { authToken, sessionToken };
  } catch (error) {
    throw redirect(redirectTo, {
      headers: {
        "Set-Cookie": await destroySession(request)
      }
    });
  }
}
async function destroySession(request) {
  const session = await getSession(request);
  return sessionStorage.destroySession(session);
}
async function logout(request) {
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(request)
    }
  });
}
const API_BASE_URL = process.env.API_URL || "http://localhost:3030";
class ApiClient {
  static connectWebSocket(config2 = {}) {
    var _a;
    this.wsConfig = { ...this.wsConfig, ...config2 };
    if (((_a = this.wsConnection) == null ? void 0 : _a.readyState) === WebSocket.OPEN) {
      return this.wsConnection;
    }
    const wsBaseUrl = API_BASE_URL.replace(/^http/, "ws");
    const wsUrl = `${wsBaseUrl}/chat`;
    this.wsConnection = new WebSocket(wsUrl);
    this.wsConnection.onopen = () => {
      this.reconnectAttempt = 0;
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    };
    this.wsConnection.onmessage = (event) => {
      var _a2, _b;
      try {
        const data = JSON.parse(event.data);
        (_b = (_a2 = this.wsConfig).onMessage) == null ? void 0 : _b.call(_a2, data);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };
    this.wsConnection.onerror = (error) => {
      var _a2, _b;
      console.error("WebSocket error:", error);
      (_b = (_a2 = this.wsConfig).onError) == null ? void 0 : _b.call(_a2, error);
    };
    this.wsConnection.onclose = () => {
      var _a2, _b;
      (_b = (_a2 = this.wsConfig).onClose) == null ? void 0 : _b.call(_a2);
      this.handleReconnection();
    };
    return this.wsConnection;
  }
  static handleReconnection() {
    if (this.reconnectAttempt < (this.wsConfig.reconnectAttempts ?? 3) && !this.reconnectTimeout) {
      this.reconnectTimeout = setTimeout(() => {
        this.reconnectAttempt++;
        console.log(`Attempting to reconnect (${this.reconnectAttempt})`);
        this.connectWebSocket(this.wsConfig);
        this.reconnectTimeout = null;
      }, this.wsConfig.reconnectInterval);
    }
  }
  static sendWebSocketMessage(message) {
    var _a;
    if (((_a = this.wsConnection) == null ? void 0 : _a.readyState) !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected");
    }
    this.wsConnection.send(JSON.stringify(message));
  }
  static closeWebSocket() {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
      this.reconnectAttempt = 0;
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    }
  }
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
      throw new Error(`API request failed: ${response.statusText}`);
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
__publicField(ApiClient, "wsConnection", null);
__publicField(ApiClient, "wsConfig", {
  reconnectAttempts: 3,
  reconnectInterval: 3e3
});
__publicField(ApiClient, "reconnectAttempt", 0);
__publicField(ApiClient, "reconnectTimeout", null);
class JournalServiceError extends Error {
  constructor(message, originalError) {
    super(message);
    this.originalError = originalError;
    this.name = "JournalServiceError";
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
      await ApiClient.post(
        `/journals/${journalId}/entries`,
        {
          content
        },
        options
      );
    } catch (error) {
      throw new JournalServiceError(
        `Failed to create entry for journal ${journalId}`,
        error
      );
    }
  }
  static async getEntries(journalId, options = {}) {
    try {
      const response = await ApiClient.get(
        `/journals/${journalId}/entries`,
        options
      );
      return response.data;
    } catch (error) {
      throw new JournalServiceError(
        `Failed to get entries for journal ${journalId}`,
        error
      );
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
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Oswald:wght@200..700&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap"
  },
  { rel: "stylesheet", href: styles }
];
const loader$6 = async ({ request }) => {
  const theme = await themeCookie.parse(request.headers.get("Cookie"));
  const url = new URL(request.url);
  if (url.pathname.startsWith("/login") || url.pathname.startsWith("/register")) {
    return json({
      theme: theme || "light",
      journals: [],
      userInfo: {
        id: "",
        userId: "",
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
    const { authToken, sessionToken } = await requireUserSession(request);
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
      userInfo
    });
  } catch (error) {
    if (error instanceof Response && error.status === 302) {
      throw error;
    }
    await getSession(request);
    throw redirect$1("/login", {
      headers: {
        "Set-Cookie": await destroySession(request)
      }
    });
  }
};
function App() {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: data.theme, children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(ThemeProvider, { theme: data.theme, children: /* @__PURE__ */ jsx(Outlet, { context: data }) }),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App,
  links,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
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
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center text-text justify-center whitespace-nowrap rounded-base text-sm font-base ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-main dark:bg-main-700 text-black dark:text-white border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none",
        noShadow: "bg-main dark:bg-main-700 text-black dark:text-white border-2 border-border dark:border-darkBorder",
        neutral: "bg-white dark:bg-secondaryBlack dark:text-darkText border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none",
        reverse: "bg-main dark:bg-main-700 text-black dark:text-white border-2 border-border dark:border-darkBorder hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-light dark:hover:shadow-dark"
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
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-base border-2 text-text dark:text-darkText font-base selection:bg-main selection:text-black border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
const Sheet = DialogPrimitive.Root;
const SheetPortal = DialogPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-overlay font-bold data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-white dark:bg-secondaryBlack text-text dark:text-darkText p-6 transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
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
  }
);
const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(sheetVariants({ side }), className),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-white", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
SheetContent.displayName = DialogPrimitive.Content.displayName;
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-bold text-text dark:text-darkText", className),
    ...props
  }
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm font-base text-text dark:text-darkText", className),
    ...props
  }
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "animate-pulse rounded-base bg-white dark:bg-secondaryBlack border-2 border-border dark:border-darkBorder",
        className
      ),
      ...props
    }
  );
}
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-base border-2 border-border dark:border-darkBorder bg-main px-3 py-1.5 text-sm font-base text-black animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
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
const SidebarProvider = React.forwardRef(
  ({
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
    const setOpen = React.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open]
    );
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
    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );
    return /* @__PURE__ */ jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style
        },
        className: cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
          className
        ),
        ref,
        ...props,
        children
      }
    ) }) });
  }
);
SidebarProvider.displayName = "SidebarProvider";
const Sidebar = React.forwardRef(
  ({
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...props
  }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    if (collapsible === "none") {
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          ),
          ref,
          ...props,
          children
        }
      );
    }
    if (isMobile) {
      return /* @__PURE__ */ jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsx(
        SheetContent,
        {
          "data-sidebar": "sidebar",
          "data-mobile": "true",
          className: "w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
          style: {
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE
          },
          side,
          children: /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col", children })
        }
      ) });
    }
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: "group peer hidden md:block text-sidebar-foreground",
        "data-state": state,
        "data-collapsible": state === "collapsed" ? collapsible : "",
        "data-variant": variant,
        "data-side": side,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
                "group-data-[collapsible=offcanvas]:w-0",
                "group-data-[side=right]:rotate-180",
                variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
                side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
                // Adjust the padding for floating and inset variants.
                variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
                className
              ),
              ...props,
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  "data-sidebar": "sidebar",
                  className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
                  children
                }
              )
            }
          )
        ]
      }
    );
  }
);
Sidebar.displayName = "Sidebar";
const SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      ref,
      "data-sidebar": "trigger",
      variant: "default",
      size: "icon",
      className: cn("h-7 w-7", className),
      onClick: (event) => {
        onClick == null ? void 0 : onClick(event);
        toggleSidebar();
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx(PanelLeft, {}),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
});
SidebarTrigger.displayName = "SidebarTrigger";
const SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsx(
    "button",
    {
      ref,
      "data-sidebar": "rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: toggleSidebar,
      title: "Toggle Sidebar",
      className: cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      ),
      ...props
    }
  );
});
SidebarRail.displayName = "SidebarRail";
const SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "main",
    {
      ref,
      className: cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      ),
      ...props
    }
  );
});
SidebarInset.displayName = "SidebarInset";
const SidebarInput = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    Input,
    {
      ref,
      "data-sidebar": "input",
      className: cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      ),
      ...props
    }
  );
});
SidebarInput.displayName = "SidebarInput";
const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
});
SidebarHeader.displayName = "SidebarHeader";
const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "footer",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
});
SidebarFooter.displayName = "SidebarFooter";
const SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    Separator,
    {
      ref,
      "data-sidebar": "separator",
      className: cn("mx-2 w-auto bg-sidebar-border", className),
      ...props
    }
  );
});
SidebarSeparator.displayName = "SidebarSeparator";
const SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
});
SidebarContent.displayName = "SidebarContent";
const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
});
SidebarGroup.displayName = "SidebarGroup";
const SidebarGroupLabel = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-label",
      className: cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
const SidebarGroupAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
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
    }
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";
const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    "data-sidebar": "group-content",
    className: cn("w-full text-sm", className),
    ...props
  }
));
SidebarGroupContent.displayName = "SidebarGroupContent";
const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    "data-sidebar": "menu",
    className: cn("flex w-full min-w-0 flex-col gap-1", className),
    ...props
  }
));
SidebarMenu.displayName = "SidebarMenu";
const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "li",
  {
    ref,
    "data-sidebar": "menu-item",
    className: cn("group/menu-item relative", className),
    ...props
  }
));
SidebarMenuItem.displayName = "SidebarMenuItem";
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
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
  }
);
const SidebarMenuButton = React.forwardRef(
  ({
    asChild = false,
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();
    const button = /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        "data-sidebar": "menu-button",
        "data-size": size,
        "data-active": isActive,
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
        ...props
      }
    );
    if (!tooltip) {
      return button;
    }
    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip
      };
    }
    return /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
      /* @__PURE__ */ jsx(
        TooltipContent,
        {
          side: "right",
          align: "center",
          hidden: state !== "collapsed" || isMobile,
          ...tooltip
        }
      )
    ] });
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";
const SidebarMenuAction = React.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
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
    }
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";
const SidebarMenuBadge = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    "data-sidebar": "menu-badge",
    className: cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    ),
    ...props
  }
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
const SidebarMenuSkeleton = React.forwardRef(({ className, showIcon = false, ...props }, ref) => {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      "data-sidebar": "menu-skeleton",
      className: cn("rounded-md h-8 flex gap-2 px-2 items-center", className),
      ...props,
      children: [
        showIcon && /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: "size-4 rounded-md",
            "data-sidebar": "menu-skeleton-icon"
          }
        ),
        /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: "h-4 flex-1 max-w-[--skeleton-width]",
            "data-sidebar": "menu-skeleton-text",
            style: {
              "--skeleton-width": width
            }
          }
        )
      ]
    }
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
const SidebarMenuSub = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    "data-sidebar": "menu-sub",
    className: cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    ),
    ...props
  }
));
SidebarMenuSub.displayName = "SidebarMenuSub";
const SidebarMenuSubItem = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, ...props }));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
const SidebarMenuSubButton = React.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
const Breadcrumb = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("nav", { ref, "aria-label": "breadcrumb", ...props }));
Breadcrumb.displayName = "Breadcrumb";
const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ol",
  {
    ref,
    className: cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    ),
    ...props
  }
));
BreadcrumbList.displayName = "BreadcrumbList";
const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "li",
  {
    ref,
    className: cn("inline-flex items-center gap-1.5", className),
    ...props
  }
));
BreadcrumbItem.displayName = "BreadcrumbItem";
const BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      className: cn("transition-colors hover:text-foreground", className),
      ...props
    }
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";
const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "span",
  {
    ref,
    role: "link",
    "aria-disabled": "true",
    "aria-current": "page",
    className: cn("font-normal text-foreground", className),
    ...props
  }
));
BreadcrumbPage.displayName = "BreadcrumbPage";
const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "li",
  {
    role: "presentation",
    "aria-hidden": "true",
    className: cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className),
    ...props,
    children: children ?? /* @__PURE__ */ jsx(ChevronRight, {})
  }
);
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
  return /* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsxs(BreadcrumbList, { children: [
    /* @__PURE__ */ jsx(BreadcrumbItem, { className: "hidden md:block text-text dark:text-darkText", children: /* @__PURE__ */ jsx(BreadcrumbLink, { href: "#", children: journalTitle }) }),
    /* @__PURE__ */ jsx(BreadcrumbSeparator, { className: "hidden md:block text-text dark:text-darkText" }),
    /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { className: "dark:text-darkText text-text", children: getPageTitle(location.pathname) }) })
  ] }) });
}
const sidebarOptions = [
  { name: "Today's Entry", icon: Book, href: "/todays-entry" },
  { name: "Goal Tracking", icon: Target, href: "/goal-tracking" },
  { name: "Growth Chat", icon: MessageCircle, href: "/chat" },
  { name: "Action Items", icon: ListTodo, href: "/action-items" },
  { name: "Progress Dashboard", icon: LineChart, href: "/progress" },
  { name: "Milestone Tracker", icon: Clock, href: "/milestones" },
  { name: "Learning Path", icon: ClipboardList, href: "/learning-path" },
  { name: "Success Stories", icon: Star, href: "/success-stories" },
  { name: "Habit Builder", icon: Target, href: "/habit-builder" }
];
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-base border-2 border-transparent bg-main dark:bg-main-700 text-black dark:text-white px-2 py-1.5 text-sm font-base outline-none focus:border-border dark:focus:border-darkBorder",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-base border-2 border-border dark:border-darkBorder bg-main dark:bg-main-700 p-1 font-base text-black dark:text-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-base border-2 border-border dark:border-darkBorder bg-main dark:bg-main-700 p-1 font-base text-black dark:text-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-base border-2 border-transparent bg-main dark:bg-main-700 px-2 py-1.5 text-sm text-black dark:text-white font-base outline-none transition-colors focus:border-border dark:focus:border-darkBorder data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-base border-2 border-transparent py-1.5 pl-8 pr-2 text-sm font-base text-black dark:text-white outline-none transition-colors focus:border-border dark:focus:border-darkBorder data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm font-base outline-none transition-colors focus:bg-white focus:text-text data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn(
      "-mx-1 my-1 h-px bg-border dark:border-darkBorder",
      className
    ),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const DropdownMenuShortcut = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "ml-auto text-xs font-base tracking-widest opacity-100",
        className
      ),
      ...props
    }
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function JournalSelector({
  activeJournal,
  setActiveJournal,
  onCreateNew,
  journals
}) {
  const [isOpen, setIsOpen] = useState(false);
  return /* @__PURE__ */ jsx(SidebarMenuItem, { children: journals.length > 0 ? /* @__PURE__ */ jsxs(DropdownMenu, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      SidebarMenuButton,
      {
        size: "lg",
        className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
        children: [
          /* @__PURE__ */ jsx("div", { className: "grid flex-1 text-left text-sm leading-tight", children: /* @__PURE__ */ jsx("span", { className: "truncate font-semibold text-text dark:text-darkText", children: activeJournal.title }) }),
          /* @__PURE__ */ jsx(ChevronsUpDown, { className: "ml-auto text-text dark:text-darkText" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(
      DropdownMenuContent,
      {
        className: "w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-background dark:bg-secondaryBlack",
        align: "start",
        side: "bottom",
        sideOffset: 4,
        children: [
          journals.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "text-xs text-muted-foreground text-black dark:text-white", children: "Journals" }),
            journals.map((journal, index) => /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: () => setActiveJournal(journal),
                className: "gap-2 p-2 mb-2 cursor-pointer",
                children: [
                  journal.title,
                  /* @__PURE__ */ jsxs(DropdownMenuShortcut, { children: [
                    "⌘",
                    index + 1
                  ] })
                ]
              },
              journal.title
            ))
          ] }),
          /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxs(
            DropdownMenuItem,
            {
              className: "gap-2 p-2",
              onClick: () => {
                onCreateNew();
                setIsOpen(false);
              },
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex size-6 items-center justify-center rounded-md border bg-background", children: /* @__PURE__ */ jsx(Plus, { className: "size-4" }) }),
                /* @__PURE__ */ jsx("div", { className: "font-medium text-muted-foreground", children: "Create New Journal" })
              ]
            }
          )
        ]
      }
    )
  ] }) : /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "noShadow",
      className: "gap-2 p-2 w-full",
      onClick: () => {
        onCreateNew();
        setIsOpen(false);
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex size-6 items-center justify-center rounded-md border bg-background", children: /* @__PURE__ */ jsx(Plus, { className: "size-4" }) }),
        /* @__PURE__ */ jsx("div", { className: "font-medium text-muted-foreground", children: "Create New Journal" })
      ]
    }
  ) });
}
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
function useUserInfo() {
  const data = useOutletContext();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    try {
      if (!(data == null ? void 0 : data.userInfo)) {
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
const Modal = DialogPrimitive.Root;
const ModalPortal = DialogPrimitive.Portal;
const ModalOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;
const ModalContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(ModalPortal, { children: [
  /* @__PURE__ */ jsx(ModalOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-black data-[state=open]:text-white", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
ModalContent.displayName = DialogPrimitive.Content.displayName;
const ModalHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
ModalHeader.displayName = "ModalHeader";
const ModalTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;
const ModalDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-gray-500", className),
    ...props
  }
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;
function UserInfoForm({ open, onOpenChange }) {
  return /* @__PURE__ */ jsx(Modal, { open, onOpenChange, children: /* @__PURE__ */ jsxs(ModalContent, { children: [
    /* @__PURE__ */ jsxs(ModalHeader, { children: [
      /* @__PURE__ */ jsx(ModalTitle, { className: "text-text dark:text-darkText", children: "Complete Your Profile" }),
      /* @__PURE__ */ jsx(ModalDescription, { children: "Please provide your information to continue." })
    ] }),
    /* @__PURE__ */ jsxs(Form$1, { method: "post", action: "/user-info", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            htmlFor: "firstName",
            className: "text-text dark:text-darkText text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            children: "First Name"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "firstName",
            name: "firstName",
            className: "text-text dark:text-darkText flex h-10 w-full rounded-md border-2 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            htmlFor: "lastName",
            className: "text-text dark:text-darkText text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            children: "Last Name"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "lastName",
            name: "lastName",
            className: "text-text dark:text-darkText flex h-10 w-full rounded-md border-2 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            htmlFor: "timezone",
            className: "text-text dark:text-darkText text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            children: "Timezone"
          }
        ),
        /* @__PURE__ */ jsx(
          "select",
          {
            id: "timezone",
            name: "timezone",
            className: "text-text dark:text-darkText flex h-10 w-full rounded-md border-2 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            required: true,
            children: Intl.supportedValuesOf("timeZone").map((tz) => /* @__PURE__ */ jsx("option", { value: tz, children: tz }, tz))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            htmlFor: "bio",
            className: "text-text dark:text-darkText text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            children: "Bio"
          }
        ),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            id: "bio",
            name: "bio",
            className: "text-text dark:text-darkText flex min-h-[80px] w-full rounded-md border-2 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
          children: "Save Profile"
        }
      ) })
    ] })
  ] }) });
}
function UserMenu() {
  const { theme, toggleTheme } = useTheme();
  const { userInfo, isLoading, error } = useUserInfo();
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  if (error) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        UserInfoForm,
        {
          open: showUserInfoForm || !!error,
          onOpenChange: setShowUserInfoForm
        }
      ),
      /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(
        SidebarMenuButton,
        {
          size: "lg",
          onClick: () => setShowUserInfoForm(true),
          className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
          children: [
            /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8 rounded-lg", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-lg text-black dark:text-white bg-main dark:bg-main-700", children: "GU" }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
              /* @__PURE__ */ jsx("span", { className: "truncate font-semibold text-black dark:text-white", children: "Complete Profile" }),
              /* @__PURE__ */ jsx("span", { className: "truncate text-xs text-black dark:text-white", children: "Click to setup" })
            ] }),
            /* @__PURE__ */ jsx(ChevronsUpDown, { className: "ml-auto size-4 text-black dark:text-white" })
          ]
        }
      ) })
    ] });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx("div", { className: "animate-pulse bg-gray-200 dark:bg-gray-700 h-12 w-full rounded-lg" }) });
  }
  const displayName = userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "Guest";
  const initials = userInfo ? `${userInfo.firstName[0]}${userInfo.lastName[0]}` : "GU";
  return /* @__PURE__ */ jsxs(SidebarMenuItem, { children: [
    /* @__PURE__ */ jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        SidebarMenuButton,
        {
          size: "lg",
          className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
          children: [
            /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8 rounded-lg", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-lg text-black dark:text-white bg-main dark:bg-main-700", children: initials }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
              /* @__PURE__ */ jsx("span", { className: "truncate font-semibold text-black dark:text-white", children: displayName }),
              /* @__PURE__ */ jsx("span", { className: "truncate text-xs text-black dark:text-white", children: (userInfo == null ? void 0 : userInfo.timezone) || "Loading..." })
            ] }),
            /* @__PURE__ */ jsx(ChevronsUpDown, { className: "ml-auto size-4 text-black dark:text-white" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs(
        DropdownMenuContent,
        {
          className: "w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg",
          side: "bottom",
          align: "end",
          sideOffset: 4,
          children: [
            /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "p-0 font-normal", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-1 py-1.5 text-left text-sm", children: [
              /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8 rounded-lg", children: /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-lg text-black dark:text-white bg-main dark:bg-main-700", children: initials }) }),
              /* @__PURE__ */ jsxs("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
                /* @__PURE__ */ jsx("span", { className: "truncate font-semibold", children: displayName }),
                /* @__PURE__ */ jsx("span", { className: "truncate text-xs", children: (userInfo == null ? void 0 : userInfo.timezone) || "Loading..." })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxs(DropdownMenuGroup, { children: [
              /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  className: "cursor-pointer",
                  onClick: () => setShowUserInfoForm(true),
                  children: [
                    /* @__PURE__ */ jsx(BadgeCheck, { className: "mr-2" }),
                    "Edit Profile"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "cursor-pointer", children: [
                /* @__PURE__ */ jsx(CreditCard, { className: "mr-2" }),
                "Billing"
              ] }),
              /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "cursor-pointer", children: [
                /* @__PURE__ */ jsx(Bell, { className: "mr-2" }),
                "Notifications"
              ] })
            ] }),
            /* @__PURE__ */ jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: toggleTheme,
                className: "p-2 cursor-pointer",
                children: [
                  theme === "light" ? /* @__PURE__ */ jsx(Moon, { className: "mr-2" }) : /* @__PURE__ */ jsx(Sun, { className: "mr-2" }),
                  theme === "light" ? "Dark Mode" : "Light Mode"
                ]
              }
            ) }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsx(Form$1, { action: "/logout", method: "post", children: /* @__PURE__ */ jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxs("button", { className: "w-full flex gap-2 items-center cursor-pointer", children: [
              /* @__PURE__ */ jsx(LogOut, {}),
              "Log out"
            ] }) }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      UserInfoForm,
      {
        open: showUserInfoForm,
        onOpenChange: setShowUserInfoForm
      }
    )
  ] });
}
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
function AppSidebar({ children }) {
  const { journals } = useOutletContext();
  const location = useLocation();
  const [activeJournal, setActiveJournal] = useState(journals[0] ?? null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(
    journals.length === 0 ? true : false
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(SidebarProvider, { children: [
      /* @__PURE__ */ jsxs(Sidebar, { children: [
        /* @__PURE__ */ jsx(SidebarHeader, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(
          JournalSelector,
          {
            activeJournal,
            setActiveJournal,
            onCreateNew: () => setIsCreateModalOpen(true),
            journals
          }
        ) }) }),
        /* @__PURE__ */ jsx(SidebarContent, { className: "scrollbar", children: /* @__PURE__ */ jsx(SidebarGroup, { className: "p-0 border-t-4 border-border dark:border-darkNavBorder", children: /* @__PURE__ */ jsx(SidebarMenu, { className: "gap-0", children: sidebarOptions.map((items) => /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuSubButton, { asChild: true, className: "translate-x-0", children: /* @__PURE__ */ jsxs(
          Link,
          {
            className: `rounded-none h-auto block border-b-4 border-border dark:border-darkNavBorder p-4 pl-4 font-base text-text/90 dark:text-darkText/90 hover:bg-main50 dark:hover:bg-main-600 dark:hover:text-white ${location.pathname === items.href ? "bg-main50 dark:bg-main-700 dark:text-white" : ""}`,
            to: items.href,
            children: [
              React.createElement(items.icon, { size: 24 }),
              /* @__PURE__ */ jsx("span", { className: "text-lg", children: items.name })
            ]
          }
        ) }) }, items.name)) }) }) }),
        /* @__PURE__ */ jsx(SidebarFooter, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(UserMenu, {}) }) }),
        /* @__PURE__ */ jsx(SidebarRail, {})
      ] }),
      /* @__PURE__ */ jsxs(SidebarInset, { className: "bg-white dark:bg-secondaryBlack border-l-4", children: [
        /* @__PURE__ */ jsx("header", { className: "flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4", children: [
          /* @__PURE__ */ jsx(SidebarTrigger, { className: "mx-1" }),
          /* @__PURE__ */ jsx(BreadcrumbNavigation, { journalTitle: activeJournal == null ? void 0 : activeJournal.title })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-1 flex-col gap-4 pt-0 dark:bg-darkBg", children })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: isCreateModalOpen, onOpenChange: setIsCreateModalOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md bg-white dark:bg-secondaryBlack", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Create New Journal" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Enter a name for your new journal" })
      ] }),
      /* @__PURE__ */ jsxs(
        Form$1,
        {
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
          children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "name", className: "text-sm font-medium", children: "Journal Name" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "name",
                  name: "name",
                  type: "text",
                  required: true,
                  className: "w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-secondaryBlack dark:border-slate-700",
                  placeholder: "My Journal"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                className: "px-4 py-2  rounded-lg transition-colors",
                children: "Create Journal"
              }
            ) })
          ]
        }
      )
    ] }) })
  ] });
}
function MainLayout({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "bg-background dark:bg-secondaryBlack w-full", children: /* @__PURE__ */ jsx(AppSidebar, { children: /* @__PURE__ */ jsx("main", { children }) }) });
}
function SuccessStories() {
  return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsx("div", { className: "container max-w-4xl mx-auto p-6 space-y-6", children: /* @__PURE__ */ jsx("h1", { children: "Success Stories" }) }) });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SuccessStories
}, Symbol.toStringTag, { value: "Module" }));
const Form = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx("form", { ref, className: cn("space-y-6", className), ...props });
});
Form.displayName = "Form";
const FormField = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx("div", { ref, className: cn("space-y-2", className), ...props });
});
FormField.displayName = "FormField";
const FormLabel = React.forwardRef(({ className, htmlFor, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "label",
    {
      ref,
      htmlFor,
      className: cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      ),
      ...props
    }
  );
});
FormLabel.displayName = "FormLabel";
const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      className: cn("text-sm font-medium text-red-500", className),
      ...props,
      children
    }
  );
});
FormMessage.displayName = "FormMessage";
async function loader$5() {
  return json$1({});
}
async function action$7({ request }) {
  var _a, _b, _c;
  const formData = await request.formData();
  const email = (_a = formData.get("email")) == null ? void 0 : _a.toString();
  const password = (_b = formData.get("password")) == null ? void 0 : _b.toString();
  const confirmPassword = (_c = formData.get("confirmPassword")) == null ? void 0 : _c.toString();
  const errors = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  if (Object.keys(errors).length > 0) {
    return json$1({ errors }, { status: 400 });
  }
  try {
    await AuthService.signUp({ email, password });
    return redirect("/login");
  } catch (error) {
    return json$1(
      { errors: { _form: "Failed to create account. Please try again." } },
      { status: 500 }
    );
  }
}
function RegisterPage() {
  var _a, _b, _c;
  const actionData = useActionData();
  return /* @__PURE__ */ jsx("div", { className: "container flex h-screen w-screen flex-col items-center justify-center mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-2 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight dark:text-white text-text", children: "Create an account" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm dark:text-white text-text", children: "Enter your email below to create your account" })
    ] }),
    /* @__PURE__ */ jsxs(Form$1, { method: "post", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(FormField, { children: [
        /* @__PURE__ */ jsx(FormLabel, { htmlFor: "email", className: "dark:text-white text-text", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            type: "email",
            name: "email",
            placeholder: "name@example.com",
            className: "bg-white",
            required: true
          }
        ),
        ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) && /* @__PURE__ */ jsx(FormMessage, { children: actionData.errors.email })
      ] }),
      /* @__PURE__ */ jsxs(FormField, { children: [
        /* @__PURE__ */ jsx(FormLabel, { htmlFor: "password", className: "dark:text-white text-text", children: "Password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            type: "password",
            name: "password",
            className: "bg-white",
            required: true
          }
        ),
        ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.password) && /* @__PURE__ */ jsx(FormMessage, { children: actionData.errors.password })
      ] }),
      /* @__PURE__ */ jsxs(FormField, { children: [
        /* @__PURE__ */ jsx(
          FormLabel,
          {
            htmlFor: "confirmPassword",
            className: "dark:text-white text-text",
            children: "Confirm Password"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "confirmPassword",
            type: "password",
            name: "confirmPassword",
            className: "bg-white",
            required: true
          }
        ),
        ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.confirmPassword) && /* @__PURE__ */ jsx(FormMessage, { children: actionData.errors.confirmPassword })
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Sign Up" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-center text-sm dark:text-white text-text", children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/login", className: "underline hover:text-gray-800", children: "Sign in" })
    ] })
  ] }) });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  default: RegisterPage,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
function GoalTracking() {
  return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsx("div", { className: "container max-w-4xl mx-auto p-6 space-y-6", children: /* @__PURE__ */ jsx("h1", { children: "Goal Tracking" }) }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: GoalTracking
}, Symbol.toStringTag, { value: "Module" }));
function HabitBuilder() {
  return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsx("div", { className: "container max-w-4xl mx-auto p-6 space-y-6", children: /* @__PURE__ */ jsx("h1", { children: "Habit Builder" }) }) });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: HabitBuilder
}, Symbol.toStringTag, { value: "Module" }));
function LearningPath() {
  return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsx("div", { className: "container max-w-4xl mx-auto p-6 space-y-6", children: /* @__PURE__ */ jsx("h1", { children: "Learning Path" }) }) });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: LearningPath
}, Symbol.toStringTag, { value: "Module" }));
async function action$6({ request }) {
  return logout(request);
}
async function loader$4() {
  return redirect("/login");
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
function ActionItems() {
  return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsx("div", { className: "container max-w-4xl mx-auto p-6 space-y-6", children: /* @__PURE__ */ jsx("h1", { children: "Action Items" }) }) });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ActionItems
}, Symbol.toStringTag, { value: "Module" }));
async function action$5({ request }) {
  const { authToken, sessionToken } = await requireUserSession(request);
  const formData = await request.formData();
  const name = formData.get("name");
  if (!name) {
    return new Response("Name is required", { status: 400 });
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
    return new Response("Failed to create journal", { status: 500 });
  }
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5
}, Symbol.toStringTag, { value: "Module" }));
const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[80px] w-full rounded-base border-2 text-text dark:text-darkText font-base selection:bg-main selection:text-black border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-3 py-2 text-sm ring-offset-white placeholder:text-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const alertVariants = cva(
  "relative w-full rounded-base shadow-light dark:shadow-dark font-bold border-2 border-border dark:border-darkBorder p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-black",
  {
    variants: {
      variant: {
        default: "bg-main dark:bg-main-700 text-black dark:text-white",
        destructive: "bg-black text-white"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    role: "alert",
    className: cn(alertVariants({ variant }), className),
    ...props
  }
));
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  // eslint-disable-next-line jsx-a11y/heading-has-content
  /* @__PURE__ */ jsx(
    "h5",
    {
      ref,
      className: cn("mb-1 leading-none tracking-tight", className),
      ...props
    }
  )
));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm font-base [&_p]:leading-relaxed", className),
    ...props
  }
));
AlertDescription.displayName = "AlertDescription";
const loader$3 = async ({ request }) => {
  var _a;
  const { authToken, sessionToken } = await requireUserSession(request);
  const response = await JournalService.getJournals({
    headers: {
      Authorization: `Bearer ${authToken}`,
      "x-session-token": sessionToken
    }
  });
  return json$1({
    selectedJournalId: ((_a = response[0]) == null ? void 0 : _a.id) || "",
    journals: response
  });
};
async function action$4({ request }) {
  const { authToken, sessionToken } = await requireUserSession(request);
  const formData = await request.formData();
  const journalId = formData.get("journalId");
  const content = formData.get("content");
  if (!content || typeof content !== "string" || !content.trim()) {
    return json$1(
      { error: "Please write something before saving" },
      { status: 400 }
    );
  }
  try {
    await JournalService.createEntry(journalId, content, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "x-session-token": sessionToken
      }
    });
    return json$1({ success: true });
  } catch (error) {
    console.error("Failed to save entry:", error);
    return json$1(
      {
        error: error instanceof Error ? error.message : "Failed to save entry"
      },
      { status: 500 }
    );
  }
}
const TherapeuticJournalEntry = () => {
  const [showPrompt, setShowPrompt] = useState(true);
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { selectedJournalId } = useLoaderData();
  const growthPrompts = [
    "What new skill or knowledge did you work on today, and what did you learn from the experience?",
    "Describe a challenge you faced today. What opportunities for growth do you see in it?",
    "What's something you initially found difficult but are getting better at? How can you see your progress?",
    "What would you like to improve or master next? What small step can you take toward that goal?",
    "How did you push outside your comfort zone today, and what did that teach you?"
  ];
  const [selectedPrompt] = useState(
    growthPrompts[Math.floor(Math.random() * growthPrompts.length)]
    // Grab a random prompt
  );
  return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsxs("div", { className: "container max-w-4xl mx-auto p-6 space-y-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-heading dark:text-white text-text", children: "Today's Entry" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm dark:text-gray-500 text-gray-700", children: [
      /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
      /* @__PURE__ */ jsx("span", { children: (/* @__PURE__ */ new Date()).toLocaleDateString() }),
      /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 ml-2" }),
      /* @__PURE__ */ jsx("span", { children: (/* @__PURE__ */ new Date()).toLocaleTimeString() })
    ] }),
    showPrompt && /* @__PURE__ */ jsxs(Alert, { className: "p-4 rounded-lg mb-4 flex items-start gap-3", children: [
      /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 flex-shrink-0 mt-1" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-medium text-black dark:text-white mb-1", children: "Today's Prompt" }),
        /* @__PURE__ */ jsx("p", { className: "text-black dark:text-white", children: selectedPrompt })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowPrompt(false),
          className: "ml-auto text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
          children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(Form$1, { method: "post", className: "space-y-4", children: [
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "journalId", value: selectedJournalId }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          name: "content",
          className: "w-full h-64 p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 placeholder:italic",
          placeholder: "Write your thoughts here..."
        }
      ),
      (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx(Alert, { variant: "destructive", className: "mt-2", children: actionData.error }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center", children: /* @__PURE__ */ jsxs(
        Button,
        {
          type: "submit",
          variant: "noShadow",
          className: "ml-auto flex items-center gap-2 px-4 py-2 text-black dark:text-white",
          disabled: isSubmitting,
          children: [
            isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: isSubmitting ? "Saving..." : "Save Entry" })
          ]
        }
      ) })
    ] })
  ] }) });
};
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  default: TherapeuticJournalEntry,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
async function loader$2({ request }) {
  const session = await getSession(request);
  const authToken = session.get("authToken");
  const sessionToken = session.get("sessionToken");
  if (authToken && sessionToken) {
    return redirect("/");
  }
  return json$1({});
}
async function action$3({ request }) {
  var _a, _b;
  const formData = await request.formData();
  const email = (_a = formData.get("email")) == null ? void 0 : _a.toString();
  const password = (_b = formData.get("password")) == null ? void 0 : _b.toString();
  const errors = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (Object.keys(errors).length > 0 || !email || !password) {
    return json$1({ errors }, { status: 400 });
  }
  try {
    const response = await AuthService.login({
      email,
      password
    });
    const cookie = await setAuthTokens(
      request,
      response.token,
      response.sessionToken
    );
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": cookie
      }
    });
  } catch (error) {
    return json$1(
      { errors: { _form: "Invalid email or password" } },
      { status: 401 }
    );
  }
}
function LoginPage() {
  var _a, _b, _c;
  const actionData = useActionData();
  return /* @__PURE__ */ jsx("div", { className: "container flex h-screen w-screen flex-col items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-2 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight dark:text-white text-text", children: "Welcome back" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm dark:text-white text-text", children: "Enter your email to sign in to your account" })
    ] }),
    /* @__PURE__ */ jsxs(Form$1, { method: "post", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(FormField, { children: [
        /* @__PURE__ */ jsx(FormLabel, { htmlFor: "email", className: "dark:text-white text-text", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            type: "email",
            name: "email",
            placeholder: "name@example.com",
            className: "bg-white",
            required: true
          }
        ),
        ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) && /* @__PURE__ */ jsx(FormMessage, { children: actionData.errors.email })
      ] }),
      /* @__PURE__ */ jsxs(FormField, { children: [
        /* @__PURE__ */ jsx(FormLabel, { htmlFor: "password", className: "dark:text-white text-text", children: "Password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            type: "password",
            name: "password",
            className: "bg-white",
            required: true
          }
        ),
        ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.password) && /* @__PURE__ */ jsx(FormMessage, { children: actionData.errors.password })
      ] }),
      ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c._form) && /* @__PURE__ */ jsx(FormMessage, { children: actionData.errors._form }),
      /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Sign In" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-center text-sm dark:text-white text-text", children: [
      "Don't have an account?",
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/register", className: "underline hover:text-gray-800", children: "Sign up" })
    ] })
  ] }) });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: LoginPage,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
function Milestones() {
  return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsx("div", { className: "container max-w-4xl mx-auto p-6 space-y-6", children: /* @__PURE__ */ jsx("h1", { children: "Milestone Tracker" }) }) });
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Milestones
}, Symbol.toStringTag, { value: "Module" }));
function DashboardLayout() {
  return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsx(Outlet, {}) });
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DashboardLayout
}, Symbol.toStringTag, { value: "Module" }));
const action$2 = async ({ request }) => {
  const formData = await request.formData();
  const theme = formData.get("theme");
  if (typeof theme !== "string") {
    return json$1({ success: false });
  }
  return json$1(
    { success: true },
    {
      headers: {
        "Set-Cookie": await themeCookie.serialize(theme)
      }
    }
  );
};
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1({ request }) {
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
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
function Progress() {
  return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsx("div", { className: "container max-w-4xl mx-auto p-6 space-y-6", children: /* @__PURE__ */ jsx("h1", { children: "Progress" }) }) });
}
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Progress
}, Symbol.toStringTag, { value: "Module" }));
function Article() {
  return /* @__PURE__ */ jsxs("article", { className: "prose-p:text-text dark:prose-p:text-darkText mx-auto w-[700px] py-20 leading-relaxed prose-h2:mb-8 prose-headings:font-heading prose-h2:text-2xl prose-h3:mb-6 prose-h3:text-xl prose-p:leading-7 prose-p:font-base prose-code:p-[3px] prose-a:underline prose-a:font-heading prose-code:mx-1 prose-code:rounded-base prose-code:font-bold prose-code:border prose-code:text-text prose-code:text-sm prose-code:border-border dark:prose-code:border-darkBorder prose-code:bg-main prose-code:px-2 m1000:w-[500px] m750:w-4/5 m400:w-full m400:py-16 prose-h2:m400:text-xl prose-h3:m400:text-lg", children: [
    "Replace with landing page",
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "underline", children: "Go to the dashboard" }) })
  ] });
}
async function requireAuth(request) {
  const authToken = await getAuthToken(request);
  const sessionToken = await getSessionToken(request);
  if (!authToken || !sessionToken) {
    throw redirect("/login");
  }
  try {
    await Promise.all([
      AuthService.verifyAuthToken(authToken),
      AuthService.verifySessionToken(sessionToken)
    ]);
    return { authToken, sessionToken };
  } catch (error) {
    throw redirect("/login");
  }
}
async function loader({ request }) {
  requireAuth(request);
  return json$1({});
}
const meta = () => {
  return [
    { title: "Journal Up" },
    {
      name: "Journal Up",
      content: "A safe space for emotional processing and self-reflection with AI-guided support."
    }
  ];
};
function Index() {
  return /* @__PURE__ */ jsx(Article, {});
}
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function AuthLayout() {
  return /* @__PURE__ */ jsxs("div", { className: "flex", children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx("div", { className: "hidden md:flex flex flex-col w-full justify-center items-center border-2 bg-slate-600", children: /* @__PURE__ */ jsx(
      "img",
      {
        className: "w-full h-full object-cover",
        src: "/login_image.webp",
        alt: "A woman writing in a notebook"
      }
    ) })
  ] });
}
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AuthLayout
}, Symbol.toStringTag, { value: "Module" }));
const ChatClientError = void 0;
const ChatClient = void 0;
async function action({ request }) {
  const formData = await request.formData();
  const message = formData.get("message");
  console.log("Received message:", message);
  try {
    return json$1({ message: "Message sent" });
  } catch (error) {
    const errorMessage = "Failed to send message";
    return json$1({ error: errorMessage }, { status: 500 });
  }
}
function Chat() {
  const formRef = useRef(null);
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const content = formData.get("message");
    if (!content.trim()) return;
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      role: "user",
      content,
      status: "sending"
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    try {
      const response = await ChatClient.sendMessage(content);
      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages];
        const pendingMessageIndex = updatedMessages.findIndex(
          (m) => m.id === tempId
        );
        if (pendingMessageIndex !== -1) {
          updatedMessages[pendingMessageIndex] = {
            ...updatedMessages[pendingMessageIndex],
            status: void 0
          };
        }
        updatedMessages.push({
          id: response.id,
          role: "assistant",
          content: response.message
        });
        return updatedMessages;
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages];
        const pendingMessageIndex = updatedMessages.findIndex(
          (m) => m.id === tempId
        );
        if (pendingMessageIndex !== -1) {
          updatedMessages[pendingMessageIndex] = {
            ...updatedMessages[pendingMessageIndex],
            status: "error"
          };
        }
        return updatedMessages;
      });
      setError(
        err instanceof ChatClientError ? err.message : "Failed to send message"
      );
    }
    form.reset();
  };
  useEffect(() => {
    var _a;
    (_a = chatEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    let mounted = true;
    const initializeConnection = async () => {
      if (!mounted) return;
      setIsConnecting(true);
      try {
        await ChatClient.sendMessage("");
        if (mounted) {
          setIsConnecting(false);
          setError(null);
        }
      } catch (error2) {
        if (mounted) {
          console.error("Failed to initialize chat connection:", error2);
          setError("Failed to connect to chat server");
          setIsConnecting(false);
        }
      }
    };
    initializeConnection();
    return () => {
      mounted = false;
      ChatClient.cleanup();
    };
  }, []);
  return /* @__PURE__ */ jsx(MainLayout, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto space-y-4 mb-4", children: [
      error && /* @__PURE__ */ jsx("div", { className: "p-4 bg-red-100 text-red-700 rounded-base border-2 border-red-300", children: error }),
      messages.map((message) => /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "p-4 rounded-base border-2 border-border dark:border-darkBorder max-w-3xl",
            message.role === "user" ? "bg-white dark:bg-secondaryBlack ml-auto text-right" : "bg-main mr-auto",
            message.status === "sending" && "opacity-70",
            message.status === "error" && "border-red-500"
          ),
          children: /* @__PURE__ */ jsxs("div", { className: "prose dark:prose-invert max-w-none", children: [
            /* @__PURE__ */ jsx(ReactMarkdown, { children: message.content }),
            message.status === "sending" && /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 ml-2", children: "Sending..." }),
            message.status === "error" && /* @__PURE__ */ jsx("span", { className: "text-sm text-red-500 ml-2", children: "Failed to send" })
          ] })
        },
        message.id
      )),
      /* @__PURE__ */ jsx("div", { ref: chatEndRef })
    ] }),
    /* @__PURE__ */ jsxs(Form$1, { ref: formRef, onSubmit: handleSubmit, className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          name: "message",
          placeholder: "Type your message...",
          className: "flex-1",
          required: true,
          disabled: isConnecting
        }
      ),
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isConnecting, variant: "default", children: isConnecting ? "Connecting..." : "Send" })
    ] })
  ] }) });
}
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: Chat
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-WtuvgT9m.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/components-Dq8-UIqM.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-D7u4_bNo.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/components-Dq8-UIqM.js", "/assets/ThemeProvider-BQeXjIYU.js"], "css": [] }, "routes/success-stories": { "id": "routes/success-stories", "parentId": "root", "path": "success-stories", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/success-stories-HHqJVThN.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/MainLayout-DZY-cXE8.js", "/assets/input-CkwIpSKd.js", "/assets/components-Dq8-UIqM.js", "/assets/ThemeProvider-BQeXjIYU.js"], "css": [] }, "routes/_auth.register": { "id": "routes/_auth.register", "parentId": "routes/_auth", "path": "register", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.register-D6laU4Qn.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/input-CkwIpSKd.js", "/assets/form-CWucc1c7.js", "/assets/components-Dq8-UIqM.js"], "css": [] }, "routes/goal-tracking": { "id": "routes/goal-tracking", "parentId": "root", "path": "goal-tracking", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/goal-tracking-UKQzLQbR.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/MainLayout-DZY-cXE8.js", "/assets/input-CkwIpSKd.js", "/assets/components-Dq8-UIqM.js", "/assets/ThemeProvider-BQeXjIYU.js"], "css": [] }, "routes/habit-builder": { "id": "routes/habit-builder", "parentId": "root", "path": "habit-builder", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/habit-builder-CARtA7Wo.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/MainLayout-DZY-cXE8.js", "/assets/input-CkwIpSKd.js", "/assets/components-Dq8-UIqM.js", "/assets/ThemeProvider-BQeXjIYU.js"], "css": [] }, "routes/learning-path": { "id": "routes/learning-path", "parentId": "root", "path": "learning-path", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/learning-path-BQCquk0w.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/MainLayout-DZY-cXE8.js", "/assets/input-CkwIpSKd.js", "/assets/components-Dq8-UIqM.js", "/assets/ThemeProvider-BQeXjIYU.js"], "css": [] }, "routes/_auth.logout": { "id": "routes/_auth.logout", "parentId": "routes/_auth", "path": "logout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.logout-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/action-items": { "id": "routes/action-items", "parentId": "root", "path": "action-items", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/action-items-GnWjOcZa.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/MainLayout-DZY-cXE8.js", "/assets/input-CkwIpSKd.js", "/assets/components-Dq8-UIqM.js", "/assets/ThemeProvider-BQeXjIYU.js"], "css": [] }, "routes/journals.new": { "id": "routes/journals.new", "parentId": "root", "path": "journals/new", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/journals.new-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/todays-entry": { "id": "routes/todays-entry", "parentId": "root", "path": "todays-entry", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/todays-entry-Bja8HiEC.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/input-CkwIpSKd.js", "/assets/MainLayout-DZY-cXE8.js", "/assets/components-Dq8-UIqM.js", "/assets/ThemeProvider-BQeXjIYU.js"], "css": [] }, "routes/_auth.login": { "id": "routes/_auth.login", "parentId": "routes/_auth", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.login-DRtyGe_f.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/input-CkwIpSKd.js", "/assets/form-CWucc1c7.js", "/assets/components-Dq8-UIqM.js"], "css": [] }, "routes/milestones": { "id": "routes/milestones", "parentId": "root", "path": "milestones", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/milestones-AxV8of9q.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/MainLayout-DZY-cXE8.js", "/assets/input-CkwIpSKd.js", "/assets/components-Dq8-UIqM.js", "/assets/ThemeProvider-BQeXjIYU.js"], "css": [] }, "routes/dashboard": { "id": "routes/dashboard", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dashboard-RPIN49oH.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/MainLayout-DZY-cXE8.js", "/assets/input-CkwIpSKd.js", "/assets/components-Dq8-UIqM.js", "/assets/ThemeProvider-BQeXjIYU.js"], "css": [] }, "routes/set-theme": { "id": "routes/set-theme", "parentId": "root", "path": "set-theme", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/set-theme-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/user-info": { "id": "routes/user-info", "parentId": "root", "path": "user-info", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/user-info-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/progress": { "id": "routes/progress", "parentId": "root", "path": "progress", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/progress-CJJ7OMd-.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/MainLayout-DZY-cXE8.js", "/assets/input-CkwIpSKd.js", "/assets/components-Dq8-UIqM.js", "/assets/ThemeProvider-BQeXjIYU.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BLAjJmfE.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/components-Dq8-UIqM.js"], "css": [] }, "routes/_auth": { "id": "routes/_auth", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth-VUe4C6wV.js", "imports": ["/assets/index-CTt_PmtF.js"], "css": [] }, "routes/chat": { "id": "routes/chat", "parentId": "root", "path": "chat", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/chat-BPxA8ZbT.js", "imports": ["/assets/index-CTt_PmtF.js", "/assets/input-CkwIpSKd.js", "/assets/MainLayout-DZY-cXE8.js", "/assets/components-Dq8-UIqM.js", "/assets/ThemeProvider-BQeXjIYU.js"], "css": [] } }, "url": "/assets/manifest-3faefbe9.js", "version": "3faefbe9" };
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
  "routes/success-stories": {
    id: "routes/success-stories",
    parentId: "root",
    path: "success-stories",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_auth.register": {
    id: "routes/_auth.register",
    parentId: "routes/_auth",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/goal-tracking": {
    id: "routes/goal-tracking",
    parentId: "root",
    path: "goal-tracking",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/habit-builder": {
    id: "routes/habit-builder",
    parentId: "root",
    path: "habit-builder",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/learning-path": {
    id: "routes/learning-path",
    parentId: "root",
    path: "learning-path",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/_auth.logout": {
    id: "routes/_auth.logout",
    parentId: "routes/_auth",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/action-items": {
    id: "routes/action-items",
    parentId: "root",
    path: "action-items",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/journals.new": {
    id: "routes/journals.new",
    parentId: "root",
    path: "journals/new",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/todays-entry": {
    id: "routes/todays-entry",
    parentId: "root",
    path: "todays-entry",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/_auth.login": {
    id: "routes/_auth.login",
    parentId: "routes/_auth",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/milestones": {
    id: "routes/milestones",
    parentId: "root",
    path: "milestones",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/dashboard": {
    id: "routes/dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/set-theme": {
    id: "routes/set-theme",
    parentId: "root",
    path: "set-theme",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/user-info": {
    id: "routes/user-info",
    parentId: "root",
    path: "user-info",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/progress": {
    id: "routes/progress",
    parentId: "root",
    path: "progress",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route16
  },
  "routes/_auth": {
    id: "routes/_auth",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/chat": {
    id: "routes/chat",
    parentId: "root",
    path: "chat",
    index: void 0,
    caseSensitive: void 0,
    module: route18
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
