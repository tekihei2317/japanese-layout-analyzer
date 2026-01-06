import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Word } from "./words";

type TypewellWordStreamProps = {
  wordList: Word[];
  currentIndex: number;
  currentWord: Word;
  correctLength: number;
  wrongChar: string;
  restStart: number;
};

export function TypewellWordStream({
  wordList,
  currentIndex,
  currentWord,
  correctLength,
  wrongChar,
  restStart,
}: TypewellWordStreamProps) {
  const displayPrefixRef = useRef<HTMLSpanElement | null>(null);
  const displayContainerRef = useRef<HTMLDivElement | null>(null);
  const kanaPrefixRef = useRef<HTMLSpanElement | null>(null);
  const kanaContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrollOffset, setScrollOffset] = useState<number | null>(null);
  const [kanaScrollOffset, setKanaScrollOffset] = useState<number | null>(null);
  const [scrollReady, setScrollReady] = useState(false);

  const kanaPrefixLength = (() => {
    let length = 0;
    for (let i = 0; i < currentIndex; i += 1) {
      length += wordList[i]?.kana.length ?? 0;
    }
    return length;
  })();
  const correctTypedLength = kanaPrefixLength + correctLength;

  const kanaStream = wordList.map((word) => word.kana).join("");
  const displayWords = wordList.map((word) => `${word.display} `);
  const displayStream = displayWords.join("");
  const displayPrefixLength = (() => {
    let length = 0;
    for (let i = 0; i < currentIndex; i += 1) {
      length += displayWords[i]?.length ?? 0;
    }
    const currentDisplayLength = displayWords[currentIndex]?.length ?? 0;
    const currentKanaLength = wordList[currentIndex]?.kana.length ?? 1;
    const progress = Math.min(
      currentDisplayLength,
      Math.round((correctLength / currentKanaLength) * currentDisplayLength)
    );
    return length + progress;
  })();
  const displayPrefix = displayStream.slice(0, displayPrefixLength);
  const displayRest = displayStream.slice(displayPrefixLength);

  const measureScroll = () => {
    const displayContainerWidth = displayContainerRef.current?.offsetWidth ?? 0;
    const displayPrefixWidth = displayPrefixRef.current?.offsetWidth ?? 0;
    const kanaContainerWidth = kanaContainerRef.current?.offsetWidth ?? 0;
    const kanaPrefixWidth = kanaPrefixRef.current?.offsetWidth ?? 0;
    setScrollOffset(displayContainerWidth / 2 - displayPrefixWidth);
    setKanaScrollOffset(kanaContainerWidth / 2 - kanaPrefixWidth);
  };

  useLayoutEffect(() => {
    measureScroll();
  }, [currentIndex, correctTypedLength, displayPrefixLength]);

  useEffect(() => {
    let cancelled = false;
    const finalize = () => {
      if (cancelled) return;
      measureScroll();
      setScrollReady(true);
    };
    setScrollReady(false);
    if ("fonts" in document && document.fonts?.ready) {
      document.fonts.ready.then(finalize);
    } else {
      finalize();
    }
    return () => {
      cancelled = true;
    };
  }, [currentIndex, correctTypedLength, displayPrefixLength]);

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <div
          ref={displayContainerRef}
          className={`relative overflow-hidden ${scrollReady ? "opacity-100" : "opacity-0"}`}
        >
          <div className="pointer-events-none absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-amber-400" />
          <div
            className={`w-max whitespace-pre text-lg text-slate-500 sm:text-xl ${
              scrollReady ? "transition-transform duration-100 ease-out" : ""
            }`}
            style={{
              transform: `translateX(${scrollOffset ?? 0}px)`,
            }}
          >
            <span ref={displayPrefixRef} className="text-slate-300">
              {displayPrefix}
            </span>
            <span>{displayRest}</span>
          </div>
        </div>
      </div>
      <div
        ref={kanaContainerRef}
        className={`overflow-hidden ${scrollReady ? "opacity-100" : "opacity-0"}`}
      >
        <div
          className={`w-max whitespace-pre text-2xl text-slate-500 ${
            scrollReady ? "transition-transform duration-100 ease-out" : ""
          }`}
          style={{ transform: `translateX(${kanaScrollOffset ?? 0}px)` }}
        >
          <span ref={kanaPrefixRef} className="text-slate-300">
            {kanaStream.slice(0, kanaPrefixLength)}
          </span>
          <span className="text-emerald-600">
            {currentWord.kana.slice(0, correctLength)}
          </span>
          {wrongChar ? <span className="text-rose-600">{wrongChar}</span> : null}
          <span>{currentWord.kana.slice(restStart)}</span>
          <span className="text-slate-300">
            {kanaStream.slice(kanaPrefixLength + currentWord.kana.length)}
          </span>
        </div>
      </div>
    </>
  );
}
