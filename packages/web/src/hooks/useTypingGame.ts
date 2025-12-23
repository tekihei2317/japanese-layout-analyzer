import { useMemo, useReducer } from "react";
import { createStrokeProcessorForLayout } from "@japanese-layout-analyzer/core";

type GameState =
  | { status: "waiting" }
  | { status: "playing"; buffer: string; typed: string }
  | { status: "finished"; typed: string };

type Action =
  | { type: "START" }
  | { type: "INPUT"; output: string; newBuffer: string }
  | { type: "BACKSPACE" }
  | { type: "RESET" };

type UseTypingReturn = {
  state: GameState;
  startGame: () => void;
  inputKey: (key: string) => void;
  backspace: () => void;
  resetGame: () => void;
};

type UseTypingGameArgs = {
  kana: string;
  layoutId?: Parameters<typeof createStrokeProcessorForLayout>[0];
};

function createGameReducer(kana: string) {
  return function gameReducer(state: GameState, action: Action): GameState {
    if (action.type === "START") {
      if (state.status === "waiting") {
        return { status: "playing", buffer: "", typed: "" };
      }
    } else if (action.type === "INPUT") {
      if (state.status === "playing") {
        const nextTyped = state.typed + action.output;
        if (nextTyped === kana) {
          return { status: "finished", typed: nextTyped };
        }
        return {
          status: "playing",
          buffer: action.newBuffer,
          typed: nextTyped,
        };
      }
    } else if (action.type === "BACKSPACE") {
      if (state.status === "playing") {
        if (state.buffer.length > 0) {
          return {
            status: "playing",
            buffer: state.buffer.slice(0, -1),
            typed: state.typed,
          };
        }
        if (state.typed.length > 0) {
          return {
            status: "playing",
            buffer: "",
            typed: state.typed.slice(0, -1),
          };
        }
      }
    } else if (action.type === "RESET") {
      return { status: "waiting" };
    }
    return state;
  };
}

export function useTypingGame({
  kana,
  layoutId = "qwerty",
}: UseTypingGameArgs): UseTypingReturn {
  const reducer = useMemo(() => createGameReducer(kana), [kana]);
  const [state, dispatch] = useReducer(reducer, { status: "waiting" });
  const strokeProcessor = useMemo(
    () => createStrokeProcessorForLayout(layoutId),
    [layoutId]
  );

  return {
    state,
    startGame: () => dispatch({ type: "START" }),
    inputKey: (key) => {
      if (state.status !== "playing") return;
      const result = strokeProcessor({
        buffer: state.buffer,
        pressedKey: key,
      });
      dispatch({
        type: "INPUT",
        output: result.output,
        newBuffer: result.newBuffer,
      });
    },
    backspace: () => dispatch({ type: "BACKSPACE" }),
    resetGame: () => dispatch({ type: "RESET" }),
  };
}

export type { GameState };
