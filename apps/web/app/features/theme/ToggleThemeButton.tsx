import { useTheme } from "~/components/ThemeProvider";
import { Button } from "~/components/ui/button";

export default function ToggleThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </Button>
  );
}
