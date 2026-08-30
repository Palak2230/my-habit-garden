import { useState } from "react";

const STORAGE_KEY = "my-habit-garden-collapsed-sections";

const readCollapsed = (): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed ?? {};
  } catch {
    return {};
  }
};

export const useCollapsedSections = () => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(readCollapsed);

  const toggle = (sectionId: string) => {
    setCollapsed((prev) => {
      const next = { ...prev, [sectionId]: !prev[sectionId] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isCollapsed = (sectionId: string) => Boolean(collapsed[sectionId]);

  return { isCollapsed, toggle };
};
