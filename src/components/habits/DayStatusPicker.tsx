import type { DayStatus, DayStatusType } from "../../types/tracker";

type Props = {
  dayKey: string;
  label: string;
  isToday: boolean;
  status?: DayStatus;
  onChange: (type: DayStatusType | null) => void;
};

const emoji = (type: DayStatusType | null) => {
  if (type === "rest") return "🛌";
  if (type === "sick") return "🤒";
  if (type === "away") return "📅";
  return "✓";
};

const cycle = (current: DayStatusType | null): DayStatusType | null => {
  if (current === null) return "rest";
  if (current === "rest") return "sick";
  if (current === "sick") return "away";
  return null;
};

const title = (type: DayStatusType | null) => {
  if (type === "rest") return "Rest day";
  if (type === "sick") return "Sick day";
  if (type === "away") return "Away / commitment";
  return "Normal day";
};

export const DayStatusPicker = ({ dayKey, label, isToday, status, onChange }: Props) => {
  const active = status?.type ?? null;

  return (
    <div
      className={`flex flex-col items-center rounded-md p-0.5 ${isToday ? "bg-rose-100 text-rose-900" : ""}`}
    >
      <div className="text-[10px] font-semibold leading-tight">{label}</div>
      <button
        type="button"
        onClick={() => onChange(cycle(active))}
        title={`${title(active)} — tap to cycle`}
        className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg border text-sm transition-colors ${
          active === "rest"
            ? "border-violet-200 bg-violet-50"
            : active === "sick"
              ? "border-amber-200 bg-amber-50"
              : active === "away"
                ? "border-sky-200 bg-sky-50"
                : "border-stone-200 bg-white hover:bg-rose-50"
        }`}
        aria-label={`Day type for ${dayKey}: ${title(active)}`}
      >
        {emoji(active)}
      </button>
    </div>
  );
};
