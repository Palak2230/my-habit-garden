import type { ChangeEvent } from "react";
import { useHabits } from "../../hooks/useHabits";

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
