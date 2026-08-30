import {
  Flower2,
  Home,
  Smile,
  Lightbulb,
  Wallet,
  Gem,
  Briefcase,
  ChartColumn,
  Settings,
} from "lucide-react";

export const navItems = [
  { to: "/", label: "Home", icon: Home, emoji: "🏠" },
  { to: "/habits", label: "Habit Tracker", icon: Flower2, emoji: "🌷" },
  { to: "/mood", label: "Mood Tracker", icon: Smile, emoji: "😊" },
  { to: "/ideas", label: "Ideas Tracker", icon: Lightbulb, emoji: "💡" },
  { to: "/expenses", label: "Expense Tracker", icon: Wallet, emoji: "💰" },
  { to: "/net-worth", label: "Net Worth Tracker", icon: Gem, emoji: "💎" },
  { to: "/work", label: "Work Tracker", icon: Briefcase, emoji: "💼" },
];

export const secondaryNavItems = [
  { to: "/insights", label: "Insights", icon: ChartColumn, emoji: "📊" },
  { to: "/settings", label: "Settings", icon: Settings, emoji: "⚙️" },
];
