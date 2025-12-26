import { Rule, StepResult, StepState } from "./stroke-types";

const initialState: StepState = { buffer: "", matchedIndex: null };

type PrefixInfo = { exactIndex: number | null; canGrow: boolean };

export const makeFastStepper = (rules: Rule[]) => {
  const prefixMap = new Map<string, PrefixInfo>();

  rules.forEach((rule, index) => {
    for (let i = 1; i <= rule.input.length; i += 1) {
      const prefix = rule.input.slice(0, i);
      const info = prefixMap.get(prefix) ?? {
        exactIndex: null,
        canGrow: false,
      };
      if (i === rule.input.length && info.exactIndex === null) {
        info.exactIndex = index;
      }
      if (i < rule.input.length) {
        info.canGrow = true;
      }
      prefixMap.set(prefix, info);
    }
  });

  return (state: StepState, key: string): StepResult => {
    const input = state.buffer + key;
    const info = prefixMap.get(input);
    const tmpFixed = info?.exactIndex ?? state.matchedIndex;

    if (info?.canGrow) {
      return { state: { buffer: input, matchedIndex: tmpFixed }, output: null };
    }

    if (tmpFixed !== null) {
      const rule = rules[tmpFixed];
      const isExact = input.length === rule.input.length;
      const nextBuffer = isExact
        ? rule.nextInput ?? ""
        : (rule.nextInput ?? "") + key;
      return {
        state: { buffer: nextBuffer, matchedIndex: null },
        output: rule.output,
      };
    }

    return { state: initialState, output: null };
  };
};
