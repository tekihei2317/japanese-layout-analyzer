import { useEffect, useMemo, useState } from "react";
import { type LayoutId } from "@japanese-layout-analyzer/core";
import { useTypingGame } from "./use-typing-game";
import { FinishedScreen } from "./FinishedScreen";
import { Layouts } from "./Layouts";
import { PlayingScreen } from "./PlayingScreen";
import { WaitingScreen } from "./WaitingScreen";
import { generateWords, words } from "./words";

type Settings = {
  wordSetId: keyof typeof words;
  count: number;
  layoutId: LayoutId;
};

export const TypingGame = () => {
  const [settings, setSettings] = useState<Settings>({
    wordSetId: "original",
    count: 5,
    layoutId: "qwerty",
  });

  const wordList = useMemo(
    () => generateWords(settings.wordSetId, settings.count),
    [settings.wordSetId, settings.count]
  );

  const { state, startGame, inputKey, flushBuffer, backspace, resetGame } =
    useTypingGame({
      words: wordList,
      layoutId: settings.layoutId,
    });

  const currentIndex = state.status === "playing" ? state.currentIndex : 0;
  const currentWord = wordList[currentIndex] ??
    wordList[0] ?? { display: "", kana: "" };

  useEffect(() => {
    resetGame();
  }, [settings.wordSetId, settings.count, settings.layoutId, resetGame]);

  const counts = [5, 10, 15, 30];
  const layoutOptions: { id: LayoutId; label: string }[] = [
    { id: "qwerty", label: "QWERTY" },
    { id: "tsuki-2-263", label: "月配列 2-263式" },
    { id: "tukiringo", label: "月林檎配列" },
    { id: "buna", label: "ぶな配列" },
    { id: "burichutoro-20221015", label: "ブリ中トロ配列" },
  ];
  const selectedLayout =
    layoutOptions.find((option) => option.id === settings.layoutId) ??
    layoutOptions[0];
  const settingsPanel = (
    <section className="border border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
      <div className="grid gap-4 text-slate-700 sm:grid-cols-[1.2fr_1fr_1fr] sm:items-center">
        <label className="flex flex-col gap-2">
          <span className="uppercase tracking-wider text-slate-400">配列</span>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700"
            value={settings.layoutId}
            onChange={(event) =>
              setSettings((prev) => ({
                ...prev,
                layoutId: event.target.value as LayoutId,
              }))
            }
          >
            {layoutOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="uppercase tracking-wider text-slate-400">
            ワード
          </span>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700"
            value={settings.wordSetId}
            onChange={(event) =>
              setSettings((prev) => ({
                ...prev,
                wordSetId: event.target.value as keyof typeof words,
              }))
            }
          >
            <option value="original">オリジナル</option>
          </select>
        </label>
        <div className="flex flex-col gap-2">
          <span className="uppercase tracking-wider text-slate-400">
            出題数
          </span>
          <div className="flex flex-wrap gap-2">
            {counts.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, count }))}
                className={`rounded-full px-3 py-1 transition ${
                  settings.count === count
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
  const layoutPanel = (
    <section className="border border-slate-200 bg-white/90 p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          {selectedLayout?.label ?? "配列図"}
        </h2>
      </div>
      <div className="mt-4">
        <Layouts layoutId={settings.layoutId} />
      </div>
    </section>
  );

  if (state.status === "waiting") {
    return (
      <div className="flex flex-col gap-6">
        {settingsPanel}
        <WaitingScreen onStart={startGame} />
        {layoutPanel}
      </div>
    );
  }

  if (state.status === "playing") {
    return (
      <div className="flex flex-col gap-6">
        {settingsPanel}
        <PlayingScreen
          currentWord={currentWord}
          typed={state.typed}
          buffer={state.buffer}
          onInputKey={inputKey}
          onBackspace={backspace}
          onFlushBuffer={flushBuffer}
          onReset={resetGame}
        />
        {layoutPanel}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {settingsPanel}
      <FinishedScreen typed={state.typed} onReset={resetGame} />
      {layoutPanel}
    </div>
  );
};
