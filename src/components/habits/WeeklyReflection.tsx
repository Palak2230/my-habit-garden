import { useMemo } from "react";

type Props = {
  weekStartKey: string;
  reflections: { weekStart: string; wentWell: string; improve: string; proud: string }[];
  onChange: (value: { weekStart: string; wentWell: string; improve: string; proud: string }) => void;
};

export const WeeklyReflection = ({ weekStartKey, reflections, onChange }: Props) => {
  const current = useMemo(
    () =>
      reflections.find((r) => r.weekStart === weekStartKey) ?? {
        weekStart: weekStartKey,
        wentWell: "",
        improve: "",
        proud: "",
      },
    [reflections, weekStartKey],
  );

  return (
    <section className="mt-4 rounded-2xl border border-rose-100 bg-white/80 p-4">
      <h3 className="mb-3 text-sm font-semibold text-rose-900">💌 Weekly Reflection</h3>
      <div className="grid gap-3">
        <ReflectionInput
          label="💗 What went well?"
          value={current.wentWell}
          onChange={(value) => onChange({ ...current, wentWell: value })}
        />
        <ReflectionInput
          label="🌱 What could I improve?"
          value={current.improve}
          onChange={(value) => onChange({ ...current, improve: value })}
        />
        <ReflectionInput
          label="🌷 What am I proud of?"
          value={current.proud}
          onChange={(value) => onChange({ ...current, proud: value })}
        />
      </div>
    </section>
  );
};

const ReflectionInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <label className="grid gap-1 text-sm">
    <span className="font-medium text-stone-700">{label}</span>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-20 rounded-lg border border-stone-200 bg-white px-3 py-2"
    />
  </label>
);
