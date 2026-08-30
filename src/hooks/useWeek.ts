import { useMemo, useState } from "react";
import { addDays, formatWeekRange, startOfWeekMonday, weekDates } from "../utils/dates";

export const useWeek = () => {
  const [reference, setReference] = useState(() => startOfWeekMonday(new Date()));

  const days = useMemo(() => weekDates(reference), [reference]);
  const rangeLabel = useMemo(() => formatWeekRange(reference), [reference]);

  return {
    reference,
    days,
    rangeLabel,
    goPrev: () => setReference((d) => addDays(d, -7)),
    goNext: () => setReference((d) => addDays(d, 7)),
    goThisWeek: () => setReference(startOfWeekMonday(new Date())),
  };
};
