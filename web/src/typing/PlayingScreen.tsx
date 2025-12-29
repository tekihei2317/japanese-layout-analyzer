import { useEffect } from "react";
import { isEditableTarget } from "./keyboard";
import type { Word } from "./words";

type PlayingScreenProps = {
  currentWord: Word;
  typed: string;
  buffer: string;
  onInputKey: (key: string) => void;
  onBackspace: () => void;
  onFlushBuffer: () => void;
  onReset: () => void;
};

export const PlayingScreen = ({
  currentWord,
  typed,
  buffer,
  onInputKey,
  onBackspace,
  onFlushBuffer,
  onReset,
}: PlayingScreenProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Backspace") {
        event.preventDefault();
        onBackspace();
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        onFlushBuffer();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onReset();
        return;
      }
      if (event.key.length !== 1) return;

      onInputKey(event.key.toLowerCase());
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onInputKey, onBackspace, onFlushBuffer, onReset]);

  const findMismatchIndex = (target: string, input: string) => {
    const minLength = Math.min(target.length, input.length);
    for (let i = 0; i < minLength; i += 1) {
      if (target[i] !== input[i]) return i;
    }
    if (input.length > target.length) return target.length;
    return -1;
  };

  const mismatchIndex = findMismatchIndex(currentWord.kana, typed);
  const correctLength = mismatchIndex === -1 ? typed.length : mismatchIndex;
  const wrongChar =
    mismatchIndex !== -1 && mismatchIndex < currentWord.kana.length
      ? currentWord.kana[mismatchIndex]
      : "";
  const restStart = wrongChar ? mismatchIndex + 1 : correctLength;

  return (
    <section className="p-6">
      <div className="flex flex-col gap-4">
        <div className="text-xs text-slate-500">ワード表示</div>
        <div className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          {currentWord.display}
        </div>
        <div className="text-2xl text-slate-500">
          <span className="text-emerald-600">
            {currentWord.kana.slice(0, correctLength)}
          </span>
          {wrongChar ? (
            <span className="text-rose-600">{wrongChar}</span>
          ) : null}
          <span>{currentWord.kana.slice(restStart)}</span>
        </div>
        <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-2xl text-slate-700">
          <span>{typed}</span>
          <span className="underline decoration-teal-500 decoration-2 underline-offset-4">
            {buffer}
          </span>
          <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-teal-500 align-middle"></span>
        </div>
      </div>
    </section>
  );
};
