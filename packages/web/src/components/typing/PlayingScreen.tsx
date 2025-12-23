import { useEffect } from "react";
import { isEditableTarget } from "./keyboard";

type Prompt = {
  word: string;
  kana: string;
};

type PlayingScreenProps = {
  prompt: Prompt;
  typed: string;
  buffer: string;
  onInputKey: (key: string) => void;
  onBackspace: () => void;
};

export const PlayingScreen = ({
  prompt,
  typed,
  buffer,
  onInputKey,
  onBackspace,
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
      if (event.key.length !== 1) return;

      onInputKey(event.key.toLowerCase());
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onInputKey, onBackspace]);

  const findMismatchIndex = (target: string, input: string) => {
    const minLength = Math.min(target.length, input.length);
    for (let i = 0; i < minLength; i += 1) {
      if (target[i] !== input[i]) return i;
    }
    if (input.length > target.length) return target.length;
    return -1;
  };

  const mismatchIndex = findMismatchIndex(prompt.kana, typed);
  const correctLength = mismatchIndex === -1 ? typed.length : mismatchIndex;
  const wrongChar =
    mismatchIndex !== -1 && mismatchIndex < prompt.kana.length
      ? prompt.kana[mismatchIndex]
      : "";
  const restStart = wrongChar ? mismatchIndex + 1 : correctLength;

  return (
    <section className="border border-slate-200 bg-white/90 p-6 backdrop-blur">
      <div className="flex flex-col gap-4">
        <div className="text-xs text-slate-500">ワード表示</div>
        <div className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          {prompt.word}
        </div>
        <div className="text-2xl text-slate-500">
          <span className="text-emerald-600">
            {prompt.kana.slice(0, correctLength)}
          </span>
          {wrongChar ? (
            <span className="text-rose-600">{wrongChar}</span>
          ) : null}
          <span>{prompt.kana.slice(restStart)}</span>
        </div>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-2xl text-slate-700">
          <span>{typed}</span>
          <span>{buffer}</span>
          <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-teal-500 align-middle"></span>
        </div>
      </div>
    </section>
  );
};
