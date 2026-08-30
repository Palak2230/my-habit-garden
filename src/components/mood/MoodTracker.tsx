import { useMemo } from "react";
import { useHabits } from "../../hooks/useHabits";
import { toDateKey } from "../../utils/dates";
import { ALL_TRACKERS, TRACKER_META, type TrackerType } from "../../types/tracker";

const MOOD_SCALE = ["😫", "😕", "😐", "🙂", "😄"];
const SKIN_SCALE = ["😣", "😕", "😐", "✨", "🌟"];
const PRODUCTIVITY_SCALE = ["😴", "😕", "😐", "💪", "🔥"];

export const MoodTracker = () => {
  const { data, updateTrackerEntry, getTrackerEntry, updateSettings } = useHabits();
  const today = new Date();
  const todayKey = toDateKey(today);
  const entry = getTrackerEntry(todayKey) ?? { date: todayKey };
  const enabled = data.settings.enabledTrackers;

  const toggleTracker = (tracker: TrackerType) => {
    const next = enabled.includes(tracker)
      ? enabled.filter((item) => item !== tracker)
      : [...enabled, tracker];
    updateSettings({ enabledTrackers: next.length ? next : [tracker] });
  };

  const weekEntries = useMemo(() => {
    const entries = [];
    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = toDateKey(date);
      entries.push({
        key,
        entry: data.trackerEntries.find((item) => item.date === key),
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        day: date.getDate(),
        isToday: key === todayKey,
      });
    }
    return entries;
  }, [todayKey, data.trackerEntries]);

  const loggedToday = enabled.filter((tracker) => {
    if (tracker === "water") return (entry.water ?? 0) > 0;
    return Boolean(entry[tracker]);
  }).length;

  const completionPercent = enabled.length
    ? Math.round((loggedToday / enabled.length) * 100)
    : 0;

  return (
    <div className="space-y-4 pb-6">
      <header className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-rose-400">Wellness</p>
        <h1 className="mt-1 text-2xl font-bold text-rose-900">How are you today?</h1>
        <p className="mt-1 text-sm text-stone-500">
          {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        {enabled.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="rounded-full bg-white/70 px-3 py-1 text-sm text-stone-600">
              <span className="font-semibold text-rose-900">{loggedToday}</span> of {enabled.length} logged
            </p>
            <div className="min-w-[120px] flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-white/80">
                <div
                  className="h-full rounded-full bg-rose-300 transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </header>

      <section className="rounded-2xl border border-rose-100 bg-white/80 p-4">
        <p className="mb-3 text-xs font-medium text-rose-400">Trackers</p>
        <div className="flex flex-wrap gap-2">
          {ALL_TRACKERS.map((tracker) => {
            const meta = TRACKER_META[tracker];
            const active = enabled.includes(tracker);
            return (
              <button
                key={tracker}
                type="button"
                onClick={() => toggleTracker(tracker)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-rose-200 bg-rose-100 text-rose-900"
                    : "border-rose-50 bg-white text-stone-500 hover:border-rose-100 hover:bg-rose-50/50"
                }`}
              >
                <span>{meta.emoji}</span>
                {meta.label}
              </button>
            );
          })}
        </div>
      </section>

      {enabled.length > 0 ? (
        <section className="grid gap-3 sm:grid-cols-2">
          {enabled.includes("mood") && (
            <ScaleCard
              tracker="mood"
              title="Mood"
              description={TRACKER_META.mood.description}
              scale={MOOD_SCALE}
              value={entry.mood}
              onChange={(value) => updateTrackerEntry(today, { mood: value })}
            />
          )}
          {enabled.includes("skin") && (
            <ScaleCard
              tracker="skin"
              title="Skin health"
              description={TRACKER_META.skin.description}
              scale={SKIN_SCALE}
              value={entry.skin}
              onChange={(value) => updateTrackerEntry(today, { skin: value })}
            />
          )}
          {enabled.includes("water") && (
            <WaterCard
              value={entry.water ?? 0}
              onChange={(value) => updateTrackerEntry(today, { water: value })}
            />
          )}
          {enabled.includes("productivity") && (
            <ScaleCard
              tracker="productivity"
              title="Productivity"
              description={TRACKER_META.productivity.description}
              scale={PRODUCTIVITY_SCALE}
              value={entry.productivity}
              onChange={(value) => updateTrackerEntry(today, { productivity: value })}
            />
          )}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-rose-100 bg-rose-50/30 px-4 py-10 text-center">
          <p className="text-sm text-stone-500">Turn on at least one tracker above to start logging.</p>
        </section>
      )}

      <section className="rounded-2xl border border-rose-100 bg-white/80 p-4">
        <h2 className="mb-2 text-sm font-semibold text-rose-900">Daily note</h2>
        <textarea
          value={entry.note ?? ""}
          onChange={(e) => updateTrackerEntry(today, { note: e.target.value })}
          rows={3}
          className="w-full resize-none rounded-xl border border-rose-100 bg-rose-50/30 px-3 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-100"
          placeholder="Anything on your mind today…"
        />
      </section>

      <section className="rounded-2xl border border-rose-100 bg-white/80 p-4">
        <h2 className="mb-3 text-sm font-semibold text-rose-900">Last 7 days</h2>
        <div className="overflow-x-auto pb-1">
          <div className="min-w-[320px]">
            <div className="mb-2 grid grid-cols-8 gap-1">
              <div />
              {weekEntries.map(({ key, label, day, isToday }) => (
                <div
                  key={key}
                  className={`rounded-md py-1 text-center text-[10px] font-medium ${
                    isToday ? "bg-rose-100 text-rose-900" : "text-stone-400"
                  }`}
                >
                  <div>{label}</div>
                  <div>{day}</div>
                </div>
              ))}
            </div>
            {enabled.includes("mood") && (
              <WeekRow label="Mood" emoji="😊" values={weekEntries.map((d) => d.entry?.mood)} scale={MOOD_SCALE} />
            )}
            {enabled.includes("skin") && (
              <WeekRow label="Skin" emoji="✨" values={weekEntries.map((d) => d.entry?.skin)} scale={SKIN_SCALE} />
            )}
            {enabled.includes("water") && (
              <WeekRow label="Water" emoji="💧" values={weekEntries.map((d) => d.entry?.water)} water />
            )}
            {enabled.includes("productivity") && (
              <WeekRow
                label="Focus"
                emoji="📚"
                values={weekEntries.map((d) => d.entry?.productivity)}
                scale={PRODUCTIVITY_SCALE}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const ScaleCard = ({
  tracker,
  title,
  description,
  scale,
  value,
  onChange,
}: {
  tracker: TrackerType;
  title: string;
  description: string;
  scale: string[];
  value?: number;
  onChange: (value: number) => void;
}) => {
  const meta = TRACKER_META[tracker];

  return (
    <article className="rounded-2xl border border-rose-100 bg-white/90 p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-rose-900">
        <span>{meta.emoji}</span>
        {title}
      </h3>
      <p className="mt-0.5 text-xs text-stone-500">{description}</p>
      <div className="mt-3 flex justify-between gap-1">
        {scale.map((emoji, index) => {
          const level = index + 1;
          const selected = value === level;
          return (
            <button
              key={emoji}
              type="button"
              onClick={() => onChange(level)}
              className={`flex flex-1 flex-col items-center rounded-xl py-2 transition-colors ${
                selected
                  ? "bg-rose-100 ring-1 ring-rose-200"
                  : "hover:bg-rose-50/60"
              }`}
              aria-label={`${title} level ${level}`}
            >
              <span className="text-lg">{emoji}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
};

const WaterCard = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => {
  const goal = 8;

  return (
    <article className="rounded-2xl border border-rose-100 bg-white/90 p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-rose-900">
        <span>💧</span>
        Water
      </h3>
      <p className="mt-0.5 text-xs text-stone-500">Glasses today</p>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-100 bg-white text-sm text-stone-600 hover:bg-rose-50"
          aria-label="Remove one glass"
        >
          −
        </button>
        <span className="text-2xl font-semibold tabular-nums text-rose-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(12, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-100 bg-white text-sm text-stone-600 hover:bg-rose-50"
          aria-label="Add one glass"
        >
          +
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-1">
        {Array.from({ length: goal }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className={`h-2 w-2 rounded-full transition-colors ${
              value >= i + 1 ? "bg-rose-300" : "bg-rose-100"
            }`}
            aria-label={`${i + 1} glasses`}
          />
        ))}
      </div>
    </article>
  );
};

const WeekRow = ({
  label,
  emoji,
  values,
  scale,
  water,
}: {
  label: string;
  emoji: string;
  values: (number | undefined)[];
  scale?: string[];
  water?: boolean;
}) => (
  <div className="mb-1.5 grid grid-cols-8 items-center gap-1">
    <div className="flex items-center gap-1 text-[10px] text-stone-500">
      <span>{emoji}</span>
      <span>{label}</span>
    </div>
    {values.map((val, i) => (
      <div
        key={i}
        className={`flex h-8 items-center justify-center rounded-md text-sm ${
          val ? "bg-rose-50 text-stone-700" : "text-stone-300"
        }`}
      >
        {water ? (val ? <span className="text-[10px] font-medium">{val}</span> : "·") : val && scale ? scale[val - 1] : "·"}
      </div>
    ))}
  </div>
);
