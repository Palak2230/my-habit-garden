import { useEffect } from "react";
import { useHabits } from "./useHabits";
import { scheduleReminders } from "../utils/notifications";

export const useReminders = () => {
  const { data } = useHabits();

  useEffect(() => {
    scheduleReminders(data.reminders, data.settings.notificationsEnabled);
    return () => scheduleReminders([], false);
  }, [data.reminders, data.settings.notificationsEnabled]);
};
