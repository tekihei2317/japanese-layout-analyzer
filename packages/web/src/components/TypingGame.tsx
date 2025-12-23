import { useTypingGame } from "../hooks/useTypingGame";
import { FinishedScreen } from "./typing/FinishedScreen";
import { PlayingScreen } from "./typing/PlayingScreen";
import { WaitingScreen } from "./typing/WaitingScreen";

const prompt = {
  word: "日本で一番高い山は富士山だ",
  kana: "にほんでいちばんたかいやまはふじさんだ",
};

type Settings = {
  wordSetId: string;
  count: number;
  layoutId: string;
};

export const TypingGame = () => {
  const { state, startGame, inputKey, backspace, resetGame } = useTypingGame({
    kana: prompt.kana,
  });

  if (state.status === "waiting") {
    return <WaitingScreen onStart={startGame} />;
  }

  if (state.status === "playing") {
    return (
      <PlayingScreen
        prompt={prompt}
        typed={state.typed}
        buffer={state.buffer}
        onInputKey={inputKey}
        onBackspace={backspace}
      />
    );
  }

  return <FinishedScreen typed={state.typed} onReset={resetGame} />;
};
