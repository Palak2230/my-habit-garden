import type { ChangeEvent } from "react";
import { useHabits } from "../../hooks/useHabits";
import { ALL_TRACKERS, TRACKER_META } from "../../types/tracker";
import { PassThresholdInput } from "../habits/PassThresholdInput";
import { RemindersSection } from "./RemindersSection";
import { clampThreshold } from "../../utils/sectionPass";

const SECTION_LABELS: Record<string, string> = {
  skincare: "🧴 Skincare",
  beforesleep: "🌌 Before Sleep Routine",
  bodycare: "🫧 Bodycare",
  haircare: "💆 Hair Care",
  productivity: "📚 Productivity",
  health: "💪 Health",
  fitness: "🏃 Fitness",
  supplements: "💊 Supplements",
};

export const Settings = () => {
  const { data, updateSettings, exportData, importData, resetAll } = useHabits();
  const settings = data.settings;

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      const result = importData(text);
      alert(result.message);
    });
  };

  const setSectionThreshold = (sectionKey: string, value: number) => {
    updateSettings({
      sectionPassThresholds: {
        ...settings.sectionPassThresholds,
        [sectionKey]: clampThreshold(value),
      },
    });
  };

  const sectionKeys = data.categories.map((category) => category.id);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-rose-900">⚙️ Settings</h1>

      <section className="rounded-2xl border border-rose-100 bg-white/80 p-4">
        <h2 className="text-sm font-semibold">👤 Profile</h2>
        <input
          className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2"
          value={settings.displayName}
          onChange={(e) => updateSettings({ displayName: e.target.value })}
          placeholder="Your name"
        />
      </section>

      <section className="rounded-2xl border border-rose-100 bg-white/80 p-4">
        <h2 className="text-sm font-semibold">🎯 Habit Tracker</h2>
        <p className="mt-1 text-xs text-stone-500">Default pass % used when a section has no custom value.</p>
        <div className="mt-3">
          <PassThresholdInput
            value={settings.sectionPassThreshold}
            onChange={(value) => updateSettings({ sectionPassThreshold: value })}
          />
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">Per-section pass %</h3>
          {sectionKeys.map((sectionKey) => (
            <div
              key={sectionKey}
              className="flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2"
            >
              <span className="text-sm text-stone-700">{SECTION_LABELS[sectionKey] ?? sectionKey}</span>
              <PassThresholdInput
                compact
                value={settings.sectionPassThresholds[sectionKey] ?? settings.sectionPassThreshold}
                onChange={(value) => setSectionThreshold(sectionKey, value)}
              />
            </div>
          ))}
        </div>
      </section>

      <RemindersSection />

      <section className="rounded-2xl border border-rose-100 bg-white/80 p-4">
        <h2 className="text-sm font-semibold">😊 Wellness Trackers</h2>
        <p className="mt-1 text-xs text-stone-500">Choose which trackers appear on the Mood page.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_TRACKERS.map((tracker) => {
            const active = settings.enabledTrackers.includes(tracker);
            return (
              <button
                key={tracker}
                type="button"
                onClick={() => {
                  const next = active
                    ? settings.enabledTrackers.filter((item) => item !== tracker)
                    : [...settings.enabledTrackers, tracker];
                  updateSettings({ enabledTrackers: next.length ? next : [tracker] });
                }}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  active ? "bg-rose-200 text-rose-900" : "bg-stone-100 text-stone-600"
                }`}
              >
                {TRACKER_META[tracker].emoji} {TRACKER_META[tracker].label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-rose-100 bg-white/80 p-4">
        <h2 className="text-sm font-semibold">🎨 Appearance</h2>
        <div className="mt-2 flex gap-2">
          {(["light", "dark", "system"] as const).map((theme) => (
            <button
              key={theme}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-sm ${settings.theme === theme ? "bg-rose-200" : "bg-stone-100"}`}
              onClick={() => updateSettings({ theme })}
            >
              {theme}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-rose-100 bg-white/80 p-4">
        <h2 className="text-sm font-semibold">💾 Data</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm" onClick={exportData}>
            Export JSON
          </button>
          <label className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm">
            Import JSON
            <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
          </label>
          <button
            type="button"
            className="rounded-lg bg-rose-100 px-3 py-1.5 text-sm text-rose-900"
            onClick={() => {
              if (!confirm("Reset all data?")) return;
              resetAll();
            }}
          >
            Reset all data
          </button>
        </div>
      </section>
    </div>
  );
};
