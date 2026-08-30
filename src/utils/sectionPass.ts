import type { AppSettings } from "../types/tracker";

export const clampThreshold = (value: number) => Math.max(50, Math.min(100, value));

export const resolvePassThreshold = (settings: AppSettings, sectionKey: string) => {
  const custom = settings.sectionPassThresholds?.[sectionKey];
  if (typeof custom === "number") return clampThreshold(custom);
  const categoryFallback = settings.sectionPassThresholds?.[sectionKey.split(":")[0]];
  if (typeof categoryFallback === "number") return clampThreshold(categoryFallback);
  return clampThreshold(settings.sectionPassThreshold);
};

export const dailySectionPass = (
  habitIds: string[],
  dayKey: string,
  completed: (habitId: string, dateKey: string) => boolean,
  passThreshold = 100,
  excused = false,
) => {
  if (excused) return { done: habitIds.length, total: habitIds.length, percent: 100, passed: true };
  if (!habitIds.length) return { done: 0, total: 0, percent: 0, passed: false };
  const done = habitIds.filter((id) => completed(id, dayKey)).length;
  const total = habitIds.length;
  const percent = Math.round((done / total) * 100);
  const threshold = clampThreshold(passThreshold);
  return {
    done,
    total,
    percent,
    passed: percent >= threshold,
  };
};

export const weeklySectionPass = (
  habitIds: string[],
  dayKeys: string[],
  completed: (habitId: string, dateKey: string) => boolean,
  passThreshold = 100,
  isExcusedDay?: (dayKey: string) => boolean,
) => {
  if (!habitIds.length || !dayKeys.length) return { done: 0, total: 0, percent: 0, passedDays: 0 };
  let done = 0;
  let passedDays = 0;
  const total = habitIds.length * dayKeys.length;
  const threshold = clampThreshold(passThreshold);
  for (const dayKey of dayKeys) {
    const day = dailySectionPass(
      habitIds,
      dayKey,
      completed,
      threshold,
      isExcusedDay?.(dayKey),
    );
    done += day.done;
    if (day.passed) passedDays += 1;
  }
  return {
    done,
    total,
    percent: Math.round((done / total) * 100),
    passedDays,
  };
};

export const dayPassColorClass = (percent: number, passThreshold = 100) => {
  const threshold = clampThreshold(passThreshold);
  if (percent >= threshold) return "border-emerald-200 bg-emerald-50";
  if (percent >= Math.max(threshold - 25, 0)) return "border-rose-100 bg-rose-50";
  if (percent >= Math.max(threshold - 50, 0)) return "border-amber-100 bg-amber-50";
  if (percent > 0) return "border-orange-100 bg-orange-50";
  return "border-stone-100 bg-stone-50";
};
