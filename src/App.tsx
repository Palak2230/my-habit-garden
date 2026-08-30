import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { useHabits } from "./hooks/useHabits";
import { useTheme } from "./hooks/useTheme";
import ExpensePage from "./pages/ExpensePage";
import HabitPage from "./pages/HabitPage";
import HomePage from "./pages/HomePage";
import IdeasPage from "./pages/IdeasPage";
import InsightsPage from "./pages/InsightsPage";
import ManageHabitsPage from "./pages/ManageHabitsPage";
import MoodPage from "./pages/MoodPage";
import NetWorthPage from "./pages/NetWorthPage";
import SettingsPage from "./pages/SettingsPage";
import WorkPage from "./pages/WorkPage";

function App() {
  const { data } = useHabits();
  useTheme(data.settings);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/habits" element={<HabitPage />} />
          <Route path="/habits/manage" element={<ManageHabitsPage />} />
          <Route path="/mood" element={<MoodPage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/expenses" element={<ExpensePage />} />
          <Route path="/net-worth" element={<NetWorthPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
