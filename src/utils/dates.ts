const pad = (n: number) => `${n}`.padStart(2, "0");

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseDateKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const startOfWeekMonday = (date: Date) => {
  const copy = new Date(date);
  const day = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export const addDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};

export const weekDates = (reference: Date) => {
  const start = startOfWeekMonday(reference);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const formatWeekRange = (reference: Date) => {
  const days = weekDates(reference);
  const first = days[0];
  const last = days[6];
  const fmt = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });
  return `${fmt.format(first)} – ${fmt.format(last)}`;
};

export const isSameDay = (a: Date, b: Date) => toDateKey(a) === toDateKey(b);
