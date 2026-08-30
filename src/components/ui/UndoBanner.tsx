type Props = {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
};

export const UndoBanner = ({ message, onUndo, onDismiss }: Props) => (
  <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-rose-200 bg-white px-4 py-2 shadow-lg">
    <span className="text-sm text-stone-700">{message}</span>
    <button type="button" onClick={onUndo} className="text-sm font-semibold text-rose-700 hover:underline">
      Undo
    </button>
    <button type="button" onClick={onDismiss} className="text-sm text-stone-400 hover:text-stone-600" aria-label="Dismiss">
      ✕
    </button>
  </div>
);
