import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { MobileHeader } from "./MobileHeader";
import { navItems, secondaryNavItems } from "./nav";
import { Sidebar } from "./Sidebar";

const COLLAPSE_KEY = "my-habit-garden-sidebar-collapsed";

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm ${isActive ? "bg-rose-100 text-rose-900 font-medium" : "text-stone-700"}`;

export const AppShell = () => {
  const [collapsed, setCollapsed] = useState<boolean>(() => localStorage.getItem(COLLAPSE_KEY) === "1");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-[#fbf6f1] text-stone-700">
      <MobileHeader onOpen={() => setMobileOpen(true)} />
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <main className="flex-1 p-4 md:p-7">
          <Outlet />
        </main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="h-full w-72 bg-[#fffaf6] p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 text-base font-semibold text-rose-900">🌷 My Habit Garden</div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                  {item.emoji} {item.label}
                </NavLink>
              ))}
              <hr className="my-3 border-rose-100" />
              {secondaryNavItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                  {item.emoji} {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
