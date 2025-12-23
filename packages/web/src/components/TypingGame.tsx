import { useReducer } from "react";

const prompt = {
  word: "日本で一番高い山は富士山だ",
  kana: "にほんでいちばんたかいやまはふじさんだ",
  typed: "にほんでいちばんt",
};

type Settings = {
  wordSetId: string;
  cuont: number;
  layoutId: string;
};

type GameState =
  | { status: "waiting" }
  | { status: "playing"; buffer: string; typed: string }
  | { status: "interval" }
  | { status: "finished" };

type Action =
  | { type: "START" }
  | { type: "INPUT"; key: string }
  | { type: "NEXT_WORD" }
  | { type: "RESET" };

function gameReducer(state: GameState, action: Action): GameState {
  return state;
}

type UseTypingReturn = {
  state: GameState;
};

function useTypingGame(): UseTypingReturn {
  const [state, dispatch] = useReducer(gameReducer, { status: "waiting" });

  return { state };
}

export const TypingGame = () => {
  const { state } = useTypingGame();

  return (
    <section className="border border-slate-200 bg-white/90 p-6 backdrop-blur">
      <div className="flex flex-col gap-4">
        <div className="text-xs text-slate-500">ワード表示</div>
        <div className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          {prompt.word}
        </div>
        <div className="text-2xl text-slate-500">{prompt.kana}</div>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-2xl text-slate-700">
          <span className="text-slate-400">{prompt.typed.slice(0, -1)}</span>
          <span className="text-slate-900">{prompt.typed.slice(-1)}</span>
          <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-teal-500 align-middle"></span>
        </div>
      </div>
    </section>
  );
};
