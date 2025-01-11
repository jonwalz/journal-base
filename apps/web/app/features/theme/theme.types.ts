export type ThemeMode = "light" | "dark";

export interface ThemeConfig {
  defaultTheme: ThemeMode;
  cookieName: string;
  storageKey: string;
}

export interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}
