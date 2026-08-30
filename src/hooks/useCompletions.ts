import { useHabits } from "./useHabits";

export const useCompletions = () => {
  const {
    toggleCompletion,
    setCompletion,
    getCompletion,
    isCompleted,
    isSkipped,
    setDayStatus,
    getDayStatusForKey,
    isExcusedDayKey,
  } = useHabits();
  return {
    toggleCompletion,
    setCompletion,
    getCompletion,
    isCompleted,
    isSkipped,
    setDayStatus,
    getDayStatusForKey,
    isExcusedDayKey,
  };
};
