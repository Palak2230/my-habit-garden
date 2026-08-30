import type { HabitReminder } from "../types/tracker";

let scheduledTimers = new Map<string, number>();

export const notificationSupported = () => typeof Notification !== "undefined";

export const requestNotificationPermission = async () => {
  if (!notificationSupported()) return "denied" as NotificationPermission;
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
};

const msUntilNext = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
};

export const clearScheduledReminders = () => {
  for (const timer of scheduledTimers.values()) {
    window.clearTimeout(timer);
  }
  scheduledTimers.clear();
};

export const scheduleReminders = (reminders: HabitReminder[], enabled: boolean) => {
  clearScheduledReminders();
  if (!enabled || !notificationSupported() || Notification.permission !== "granted") return;

  for (const reminder of reminders) {
    if (!reminder.enabled) continue;
    const scheduleOne = () => {
      const delay = msUntilNext(reminder.time);
      const timer = window.setTimeout(() => {
        new Notification("My Habit Garden", {
          body: reminder.label,
          tag: reminder.id,
        });
        scheduleOne();
      }, delay);
      scheduledTimers.set(reminder.id, timer);
    };
    scheduleOne();
  }
};
