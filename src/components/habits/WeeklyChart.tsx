import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
  data: { label: string; value: number }[];
};

export const WeeklyChart = ({ data }: Props) => (
  <section className="mt-4 rounded-2xl border border-rose-100 bg-white/80 p-4">
    <h3 className="mb-3 text-sm font-semibold text-rose-900">📊 Weekly Progress</h3>
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="value" fill="#d9adc0" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </section>
);
