import { useEffect } from "react";
import type { AppSettings } from "../types/tracker";

export const useTheme = (settings: AppSettings) => {
  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = settings.theme === "dark" || (settings.theme === "system" && prefersDark);
    root.style.colorScheme = dark ? "dark" : "light";
    root.style.setProperty("background", dark ? "#221f24" : "#fbf6f1");
    root.style.setProperty("color", dark ? "#f4eaf0" : "#5c4e53");
  }, [settings.theme]);
};
