import { useCallback, useMemo, useReducer } from "react";
import { createStrokeProcessorForLayout } from "@japanese-layout-analyzer/core";
import type { Word } from "./words";

type GameState =
  | { status: "waiting" }
  | {
      status: "playing";
      currentIndex: number;
      buffer: string;
      typed: string;
      matchedIndex: number | null;
    }
  | { status: "finished"; typed: string };

type Action =
  | { type: "START" }
  | { type: "INPUT"; output: string; newBuffer: string }
  | { type: "FLUSH_BUFFER" }
  | { type: "BACKSPACE" }
  | { type: "FINISH" }
  | { type: "RESET" };

type UseTypingReturn = {
  state: GameState;
  startGame: () => void;
  inputKey: (key: string) => void;
  flushBuffer: () => void;
  backspace: () => void;
  finishGame: () => void;
  resetGame: () => void;
};

type UseTypingGameArgs = {
  words: Word[];
  layoutId?: Parameters<typeof createStrokeProcessorForLayout>[0];
};

function createGameReducer(words: Word[]) {
  return function gameReducer(state: GameState, action: Action): GameState {
    if (action.type === "START") {
      if (state.status === "waiting") {
        if (words.length === 0) {
          return { status: "finished", typed: "" };
        }
        return {
          status: "playing",
          currentIndex: 0,
          buffer: "",
          typed: "",
          matchedIndex: null,
        };
      }
    } else if (action.type === "INPUT") {
      if (state.status === "playing") {
        const currentWord = words[state.currentIndex];
        if (!currentWord) return state;
        const nextTyped = state.typed + action.output;
        if (nextTyped === currentWord.kana) {
          const nextIndex = state.currentIndex + 1;
          return {
            status: "playing",
            currentIndex: nextIndex >= words.length ? 0 : nextIndex,
            buffer: "",
            typed: "",
            matchedIndex: null,
          };
        }
        return {
          status: "playing",
          currentIndex: state.currentIndex,
          buffer: action.newBuffer,
          typed: nextTyped,
          matchedIndex: null,
        };
      }
    } else if (action.type === "FLUSH_BUFFER") {
      if (state.status === "playing") {
        if (state.buffer.length === 0) return state;
        const currentWord = words[state.currentIndex];
        if (!currentWord) return state;
        const nextTyped = state.typed + state.buffer;
        if (nextTyped === currentWord.kana) {
          const nextIndex = state.currentIndex + 1;
          return {
            status: "playing",
            currentIndex: nextIndex >= words.length ? 0 : nextIndex,
            buffer: "",
            typed: "",
            matchedIndex: null,
          };
        }
        return {
          status: "playing",
          currentIndex: state.currentIndex,
          buffer: "",
          typed: nextTyped,
          matchedIndex: null,
        };
      }
    } else if (action.type === "BACKSPACE") {
      if (state.status === "playing") {
        if (state.buffer.length > 0) {
          return {
            status: "playing",
            currentIndex: state.currentIndex,
            buffer: state.buffer.slice(0, -1),
            typed: state.typed,
            matchedIndex: state.matchedIndex,
          };
        }
        if (state.typed.length > 0) {
          return {
            status: "playing",
            currentIndex: state.currentIndex,
            buffer: "",
            typed: state.typed.slice(0, -1),
            matchedIndex: null,
          };
        }
      }
    } else if (action.type === "FINISH") {
      if (state.status === "playing") {
        return { status: "finished", typed: state.typed };
      }
    } else if (action.type === "RESET") {
      return { status: "waiting" };
    }
    return state;
  };
}

export function useTypingGame({
  words,
  layoutId = "qwerty",
}: UseTypingGameArgs): UseTypingReturn {
  const reducer = useMemo(() => createGameReducer(words), [words]);
  const [state, dispatch] = useReducer(reducer, { status: "waiting" });
  const strokeProcessor = useMemo(
    () => createStrokeProcessorForLayout(layoutId),
    [layoutId]
  );

  const startGame = useCallback(() => {
    dispatch({ type: "START" });
  }, []);

  const inputKey = useCallback(
    (key: string) => {
      if (state.status !== "playing") return;
      const result = strokeProcessor({
        state: { buffer: state.buffer, matchedIndex: state.matchedIndex },
        key,
      });
      dispatch({
        type: "INPUT",
        output: result.output,
        newBuffer: result.state.buffer,
      });
    },
    [state, strokeProcessor]
  );

  const backspace = useCallback(() => {
    dispatch({ type: "BACKSPACE" });
  }, []);

  const flushBuffer = useCallback(() => {
    dispatch({ type: "FLUSH_BUFFER" });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const finishGame = useCallback(() => {
    dispatch({ type: "FINISH" });
  }, []);

  return {
    state,
    startGame,
    inputKey,
    flushBuffer,
    backspace,
    finishGame,
    resetGame,
  };
}

export type { GameState };
