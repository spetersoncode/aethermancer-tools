import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>("theme-preference", "system");

  useEffect(() => {
    // Skip on SSR
    if (typeof window === "undefined") {
      return;
    }

    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      // Determine the effective theme
      const effectiveTheme =
        theme === "system" ? (mediaQuery.matches ? "dark" : "light") : theme;

      // Apply or remove dark class
      if (effectiveTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    // Apply theme immediately
    applyTheme();

    // Listen for system theme changes when theme is "system"
    if (theme === "system") {
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  // Calculate effective theme for display purposes
  const getEffectiveTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") {
      return "light";
    }

    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    return theme;
  };

  return {
    theme,
    setTheme,
    effectiveTheme: getEffectiveTheme(),
  };
}
