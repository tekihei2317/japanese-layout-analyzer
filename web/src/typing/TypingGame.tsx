import { useEffect, useMemo, useState } from "react";
import { useTypingGame } from "./use-typing-game";
import { FinishedScreen } from "./FinishedScreen";
import { Layouts } from "./Layouts";
import { PlayingScreen } from "./PlayingScreen";
import { WaitingScreen } from "./WaitingScreen";
import { generateWords } from "./words";
import { SettingPanel, type Settings } from "./TypingSetting";

export const TypingGame = () => {
  const [settings, setSettings] = useState<Settings>({
    wordSetId: "aozora",
    durationSec: 15,
    layoutId: "qwerty",
  });

  const wordList = useMemo(
    () => generateWords(settings.wordSetId, 200),
    [settings.wordSetId]
  );

  const {
    state,
    startGame,
    inputKey,
    flushBuffer,
    backspace,
    finishGame,
    resetGame,
  } = useTypingGame({
    words: wordList,
    layoutId: settings.layoutId,
  });

  const currentIndex = state.status === "playing" ? state.currentIndex : 0;
  const currentWord = wordList[currentIndex] ??
    wordList[0] ?? { display: "", kana: "" };

  useEffect(() => {
    resetGame();
  }, [settings.wordSetId, settings.durationSec, settings.layoutId]);

  if (state.status === "waiting") {
    return (
      <div className="flex flex-col gap-6">
        <SettingPanel settings={settings} setSettings={setSettings} />
        <WaitingScreen onStart={startGame} />
        <Layouts layoutId={settings.layoutId} />
      </div>
    );
  }

  if (state.status === "playing") {
    return (
      <div className="flex flex-col gap-6">
        <SettingPanel settings={settings} setSettings={setSettings} />
        <PlayingScreen
          currentWord={currentWord}
          typed={state.typed}
          buffer={state.buffer}
          durationSec={settings.durationSec}
          onInputKey={inputKey}
          onBackspace={backspace}
          onFlushBuffer={flushBuffer}
          onFinish={finishGame}
          onReset={resetGame}
        />
        <Layouts layoutId={settings.layoutId} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SettingPanel settings={settings} setSettings={setSettings} />
      <FinishedScreen typed={state.typed} onReset={resetGame} />
      <Layouts layoutId={settings.layoutId} />
    </div>
  );
};
