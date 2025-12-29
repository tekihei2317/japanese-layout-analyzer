import { useEffect } from "react";
import { isEditableTarget } from "./keyboard";

type WaitingScreenProps = {
  onStart: () => void;
};

export const WaitingScreen = ({ onStart }: WaitingScreenProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;
      if (event.key === " ") {
        event.preventDefault();
        onStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onStart]);

  return (
    <section className="p-6">
      <div className="flex flex-col gap-3 text-slate-600">
        <div className="text-xs uppercase tracking-wider text-slate-400">
          Ready
        </div>
        <div className="text-2xl font-semibold text-slate-900">
          スペースキーで開始
        </div>
      </div>
    </section>
  );
};
