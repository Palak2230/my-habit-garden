import { useHabits } from "../../hooks/useHabits";
import { requestNotificationPermission } from "../../utils/notifications";

export const RemindersSection = () => {
  const { data, updateReminder, deleteReminder, addReminder, updateSettings } = useHabits();

  const enableNotifications = async () => {
    const permission = await requestNotificationPermission();
    updateSettings({ notificationsEnabled: permission === "granted" });
  };

  return (
    <section className="rounded-2xl border border-rose-100 bg-white/80 p-4">
      <h2 className="text-sm font-semibold">🔔 Reminders</h2>
      <p className="mt-1 text-xs text-stone-500">
        Browser notifications while this tab is open. Keep the app open or pinned for best results.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={enableNotifications}
          className={`rounded-lg px-3 py-1.5 text-sm ${
            data.settings.notificationsEnabled ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-900"
          }`}
        >
          {data.settings.notificationsEnabled ? "Notifications on" : "Enable notifications"}
        </button>
        <button
          type="button"
          onClick={() =>
            addReminder({
              label: "New reminder",
              time: "09:00",
              enabled: true,
            })
          }
          className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm"
        >
          + Add reminder
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {data.reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-stone-100 px-3 py-2"
          >
            <input
              type="checkbox"
              checked={reminder.enabled}
              onChange={(e) => updateReminder({ ...reminder, enabled: e.target.checked })}
            />
            <input
              type="text"
              value={reminder.label}
              onChange={(e) => updateReminder({ ...reminder, label: e.target.value })}
              className="min-w-[140px] flex-1 rounded border border-stone-200 px-2 py-1 text-sm"
            />
            <input
              type="time"
              value={reminder.time}
              onChange={(e) => updateReminder({ ...reminder, time: e.target.value })}
              className="rounded border border-stone-200 px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => deleteReminder(reminder.id)}
              className="text-xs text-rose-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
