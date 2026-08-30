import { useHabits } from "./useHabits";

export const useCompletions = () => {
  const { toggleCompletion, isCompleted } = useHabits();
  return { toggleCompletion, isCompleted };
};
