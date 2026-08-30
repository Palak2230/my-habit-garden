import { clampThreshold } from "../../utils/sectionPass";

type Props = {
  value: number;
  onChange: (value: number) => void;
  compact?: boolean;
};

export const PassThresholdInput = ({ value, onChange, compact = false }: Props) => (
  <label
    className={`flex items-center gap-1 text-stone-500 ${compact ? "text-[10px]" : "text-xs"}`}
    onClick={(e) => e.stopPropagation()}
    onKeyDown={(e) => e.stopPropagation()}
  >
    <span>Pass</span>
    <input
      type="number"
      min={50}
      max={100}
      step={5}
      value={value}
      onChange={(e) => onChange(clampThreshold(Number(e.target.value) || value))}
      className={`rounded border border-stone-200 bg-white text-center font-medium text-stone-700 ${
        compact ? "h-5 w-10 text-[10px]" : "h-7 w-12 text-xs"
      }`}
      aria-label="Section pass threshold percent"
    />
    <span>%</span>
  </label>
);
