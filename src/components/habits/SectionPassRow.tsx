import { dailySectionPass, weeklySectionPass } from "../../utils/sectionPass";

type Props = {
  habitIds: string[];
  dayKeys: string[];
  completed: (habitId: string, dateKey: string) => boolean;
  passThreshold: number;
  label?: string;
  isExcusedDay?: (dayKey: string) => boolean;
};

export const SectionPassRow = ({
  habitIds,
  dayKeys,
  completed,
  passThreshold,
  label = "Daily pass",
  isExcusedDay,
}: Props) => {
  if (!habitIds.length) return null;
  const weekly = weeklySectionPass(habitIds, dayKeys, completed, passThreshold, isExcusedDay);

  return (
    <div className="mt-1 grid grid-cols-[270px_repeat(7,minmax(42px,1fr))_130px] items-center gap-1 border-t border-dashed border-stone-200 pt-1">
      <div className="text-[11px] font-medium text-stone-500">{label}</div>
      {dayKeys.map((dayKey) => {
        const day = dailySectionPass(
          habitIds,
          dayKey,
          completed,
          passThreshold,
          isExcusedDay?.(dayKey),
        );
        return (
          <div
            key={dayKey}
            className={`text-center text-[10px] ${day.passed ? "font-semibold text-emerald-700" : "text-stone-500"}`}
            title={
              isExcusedDay?.(dayKey)
                ? "Rest / sick day"
                : `${day.done}/${day.total} habits done (${day.percent}% · need ${passThreshold}%)`
            }
          >
            {isExcusedDay?.(dayKey) ? "—" : `${day.done}/${day.total}`}
          </div>
        );
      })}
      <div
        className={`pr-1 text-right text-[11px] font-semibold ${weekly.percent >= passThreshold ? "text-emerald-700" : "text-stone-600"}`}
        title={`${weekly.passedDays}/${dayKeys.length} pass days this week`}
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
  passThreshold,
  isExcusedDay,
}: Omit<Props, "label">) => {
  if (!habitIds.length) return null;
  const weekly = weeklySectionPass(habitIds, dayKeys, completed, passThreshold, isExcusedDay);
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
        weekly.percent >= passThreshold ? "bg-emerald-100 text-emerald-800" : "bg-white/70 text-stone-600"
      }`}
    >
      {weekly.percent}% pass
    </span>
  );
};
