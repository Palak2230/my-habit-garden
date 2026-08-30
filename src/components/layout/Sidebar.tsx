import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navItems, secondaryNavItems } from "./nav";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
    isActive ? "bg-rose-100/80 font-semibold text-rose-900" : "text-stone-600 hover:bg-white/75"
  }`;

export const Sidebar = ({ collapsed, onToggle }: Props) => (
  <aside
    className={`hidden border-r border-rose-100/70 bg-white/60 p-4 backdrop-blur md:flex md:flex-col ${
      collapsed ? "md:w-20" : "md:w-64"
    }`}
  >
    <button
      className="mb-3 ml-auto rounded-lg bg-white p-2 text-stone-500 hover:text-stone-900"
      onClick={onToggle}
      aria-label="Toggle sidebar"
      type="button"
    >
      {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
    </button>
    <div className={`mb-6 ${collapsed ? "text-center" : ""}`}>
      <div className="text-lg font-semibold text-rose-900">{collapsed ? "🌷" : "🌷 My Habit Garden"}</div>
      {!collapsed && <p className="text-xs text-stone-500">my little life dashboard ♡</p>}
    </div>

    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to} title={collapsed ? item.label : undefined} className={linkClass}>
          <item.icon size={16} />
          {!collapsed && <span>{item.emoji} {item.label}</span>}
        </NavLink>
      ))}
    </nav>

    <hr className="my-4 border-rose-100" />

    <nav className="space-y-1">
      {secondaryNavItems.map((item) => (
        <NavLink key={item.to} to={item.to} title={collapsed ? item.label : undefined} className={linkClass}>
          <item.icon size={16} />
          {!collapsed && <span>{item.emoji} {item.label}</span>}
        </NavLink>
      ))}
    </nav>
  </aside>
);
