import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { GardenProvider } from "./hooks/useHabits";
import { useReminders } from "./hooks/useReminders";
import "./index.css";

const ReminderBootstrap = ({ children }: { children: React.ReactNode }) => {
  useReminders();
  return children;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GardenProvider>
      <ReminderBootstrap>
        <App />
      </ReminderBootstrap>
    </GardenProvider>
  </StrictMode>,
);
