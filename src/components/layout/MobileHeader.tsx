import { Menu, Settings } from "lucide-react";

type Props = {
  onOpen: () => void;
};

export const MobileHeader = ({ onOpen }: Props) => (
  <header className="sticky top-0 z-20 flex items-center justify-between border-b border-rose-100 bg-[#fbf6f1] px-4 py-3 md:hidden">
    <button type="button" aria-label="Open navigation" onClick={onOpen}>
      <Menu size={20} />
    </button>
    <div className="text-sm font-semibold text-rose-900">🌷 My Habit Garden</div>
    <Settings size={18} className="text-stone-500" />
  </header>
);
