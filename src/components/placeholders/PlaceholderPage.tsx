type Props = {
  title: string;
  subtitle: string;
  accent: string;
  emoji: string;
};

export const PlaceholderPage = ({ title, subtitle, accent, emoji }: Props) => (
  <div className="rounded-2xl border bg-white/80 p-8" style={{ borderColor: `${accent}66` }}>
    <h1 className="text-2xl font-bold" style={{ color: accent }}>
      {emoji} {title}
    </h1>
    <p className="mt-2 text-stone-600">{subtitle}</p>
    <div className="mt-8 text-center text-5xl">{emoji}</div>
    <p className="mt-4 text-center text-lg font-medium">Coming soon.</p>
    <p className="mt-1 text-center text-sm text-stone-500">We&apos;re still planting this part of your garden ♡</p>
  </div>
);
