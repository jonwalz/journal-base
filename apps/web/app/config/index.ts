import type { ThemeConfig } from "~/features/theme/theme.types";

const themeConfig: ThemeConfig = {
  defaultTheme: "light",
  cookieName: "theme",
  storageKey: "app-theme",
};

export const config = {
  api: {
    timeout: 5000,
    maxRetries: 3,
    // baseUrl: process.env.API_URL || "",
  },
  theme: themeConfig,
  meta: {
    defaultTitle: "My Remix App",
    defaultDescription: "A modern web application built with Remix",
  },
} as const;

export type Config = typeof config;
