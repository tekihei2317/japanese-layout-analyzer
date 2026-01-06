import { useEffect, useState } from "react";
import { isEditableTarget } from "./keyboard";
import { words, type Word } from "./words";
import { TypewellWordStream } from "./TypewellWordStream";

type PlayingScreenProps = {
  currentWord: Word;
  currentIndex: number;
  wordList: Word[];
  wordSetId: keyof typeof words;
  typed: string;
  buffer: string;
  durationSec: number;
  onInputKey: (key: string) => void;
  onBackspace: () => void;
  onFlushBuffer: () => void;
  onReset: () => void;
  onFinish: () => void;
};

const findMismatchIndex = (target: string, input: string) => {
  const minLength = Math.min(target.length, input.length);
  for (let i = 0; i < minLength; i += 1) {
    if (target[i] !== input[i]) return i;
  }
  if (input.length > target.length) return target.length;
  return -1;
};

export const PlayingScreen = ({
  currentWord,
  currentIndex,
  wordList,
  wordSetId,
  typed,
  buffer,
  durationSec,
  onInputKey,
  onBackspace,
  onFlushBuffer,
  onReset,
  onFinish,
}: PlayingScreenProps) => {
  // キー入力のハンドリング
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

  const [timeLeftSec, setTimeLeftSec] = useState(durationSec);
  // タイマーの管理
  useEffect(() => {
    const startedAt = Date.now();
    const tick = () => {
      const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, durationSec - elapsedSec);
      setTimeLeftSec(remaining);
      if (remaining <= 0) {
        onFinish();
      }
    };
    tick();
    const timerId = window.setInterval(tick, 250);
    return () => window.clearInterval(timerId);
  }, [durationSec]);

  const mismatchIndex = findMismatchIndex(currentWord.kana, typed);
  const correctLength = mismatchIndex === -1 ? typed.length : mismatchIndex;
  const wrongChar =
    mismatchIndex !== -1 && mismatchIndex < currentWord.kana.length
      ? currentWord.kana[mismatchIndex]
      : "";
  const restStart = wrongChar ? mismatchIndex + 1 : correctLength;
  const bookLabel = currentWord.book
    ? `${currentWord.book.name} / ${currentWord.book.author}`
    : "";

  return (
    <section className="py-6">
      <div className="flex flex-col gap-4">
        <div className="text-xs text-slate-500">
          残り時間{" "}
          <span className="font-semibold text-slate-700">{timeLeftSec}</span>秒
        </div>
        {wordSetId === "typewell" ? (
          <TypewellWordStream
            wordList={wordList}
            currentIndex={currentIndex}
            currentWord={currentWord}
            correctLength={correctLength}
            wrongChar={wrongChar}
            restStart={restStart}
          />
        ) : (
          <>
            <div className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              {currentWord.display}
            </div>
            {bookLabel ? (
              <div className="text-xs text-slate-500">{bookLabel}</div>
            ) : null}
            <div className="text-2xl text-slate-500">
              <span className="text-emerald-600">
                {currentWord.kana.slice(0, correctLength)}
              </span>
              {wrongChar ? (
                <span className="text-rose-600">{wrongChar}</span>
              ) : null}
              <span>{currentWord.kana.slice(restStart)}</span>
            </div>
          </>
        )}
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
