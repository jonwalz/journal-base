import { createContext, useContext, useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { config } from "~/config";
import { ThemeContextValue } from "~/features/theme/theme.types";
import { Theme } from "~/types";

const ThemeContext = createContext<ThemeContextValue>({
  theme: config.theme.defaultTheme,
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider = ({
  children,
  theme: initialTheme,
}: {
  children: React.ReactNode;
  theme: Theme;
}) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
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

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
