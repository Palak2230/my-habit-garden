export const dailySectionPass = (
  habitIds: string[],
  dayKey: string,
  completed: (habitId: string, dateKey: string) => boolean,
) => {
  if (!habitIds.length) return { done: 0, total: 0, percent: 0, passed: false };
  const done = habitIds.filter((id) => completed(id, dayKey)).length;
  const total = habitIds.length;
  return {
    done,
    total,
    percent: Math.round((done / total) * 100),
    passed: done === total,
  };
};

export const weeklySectionPass = (
  habitIds: string[],
  dayKeys: string[],
  completed: (habitId: string, dateKey: string) => boolean,
) => {
  if (!habitIds.length || !dayKeys.length) return { done: 0, total: 0, percent: 0, passedDays: 0 };
  let done = 0;
  let passedDays = 0;
  const total = habitIds.length * dayKeys.length;
  for (const dayKey of dayKeys) {
    const day = dailySectionPass(habitIds, dayKey, completed);
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
