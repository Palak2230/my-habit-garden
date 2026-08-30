import { dailySectionPass, weeklySectionPass } from "../../utils/sectionPass";

type Props = {
  habitIds: string[];
  dayKeys: string[];
  completed: (habitId: string, dateKey: string) => boolean;
  label?: string;
};

export const SectionPassRow = ({ habitIds, dayKeys, completed, label = "Daily pass" }: Props) => {
  if (!habitIds.length) return null;
  const weekly = weeklySectionPass(habitIds, dayKeys, completed);

  return (
    <div className="mt-1 grid grid-cols-[270px_repeat(7,minmax(42px,1fr))_130px] items-center gap-1 border-t border-dashed border-stone-200 pt-1">
      <div className="text-[11px] font-medium text-stone-500">{label}</div>
      {dayKeys.map((dayKey) => {
        const day = dailySectionPass(habitIds, dayKey, completed);
        return (
          <div
            key={dayKey}
            className={`text-center text-[10px] ${day.passed ? "font-semibold text-emerald-700" : "text-stone-500"}`}
            title={`${day.done}/${day.total} habits done`}
          >
            {day.done}/{day.total}
          </div>
        );
      })}
      <div
        className={`pr-1 text-right text-[11px] font-semibold ${weekly.percent >= 100 ? "text-emerald-700" : "text-stone-600"}`}
        title={`${weekly.passedDays}/${dayKeys.length} perfect days this week`}
      >
        {weekly.percent}% pass
      </div>
    </div>
  );
};

export const SectionPassBadge = ({
  habitIds,
  dayKeys,
  completed,
}: Omit<Props, "label">) => {
  if (!habitIds.length) return null;
  const weekly = weeklySectionPass(habitIds, dayKeys, completed);
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
        weekly.percent >= 100 ? "bg-emerald-100 text-emerald-800" : "bg-white/70 text-stone-600"
      }`}
    >
      {weekly.percent}% pass
    </span>
  );
};
