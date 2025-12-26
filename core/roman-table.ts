import bunaTable from "./layouts/buna.json";
import burichutoroTable from "./layouts/burichutoro-20221015.json";
import hanaTable from "./layouts/hana.json";
import qwertyTable from "./layouts/qwerty.json";
import tsukiTable from "./layouts/tsuki-2-263.json";
import tukiringoTable from "./layouts/tukiringo.json";
import yukikaTable from "./layouts/yukika.json";
import mizunaraTable from "./layouts/mizunara.json";
import hybridTsukiTable from "./layouts/hybrid-tsuki.json";
import hidedukiTable from "./layouts/hideduki_v4.1.json";
import oonisiTable from "./layouts/oonisi.json";
import fumidukiTable from "./layouts/fumiduki.json";
import tsukimisouTable from "./layouts/tsukimisou.json";

/**
 * ローマ字テーブルのエントリ
 */
export type TableEntry = { input: string; output: string; nextInput?: string };

/**
 * ローマ字テーブル
 */
export type RomanTable = TableEntry[];

const layoutTables = {
  qwerty: qwertyTable as RomanTable,
  oonisi: oonisiTable as RomanTable,
  hana: hanaTable as RomanTable,
  "tsuki-2-263": tsukiTable as RomanTable,
  yukika: yukikaTable as RomanTable,
  mizunara: mizunaraTable as RomanTable,
  hybridTsuki: hybridTsukiTable as RomanTable,
  buna: bunaTable as RomanTable,
  hideduki: hidedukiTable as RomanTable,
  "burichutoro-20221015": burichutoroTable as RomanTable,
  tsukimisou: tsukimisouTable as RomanTable,
  tukiringo: tukiringoTable as RomanTable,
  fumiduki: fumidukiTable as RomanTable,
} as const;

export type LayoutId = keyof typeof layoutTables;

export function getRomanTable(layoutId: LayoutId): RomanTable {
  return layoutTables[layoutId];
}

type PrefixInfo = { exactIndex: number | null; canGrow: boolean };

export type ImeState = { buffer: string; matchedIndex: number | null };

type StepperInput = {
  state: ImeState;
  key: string;
};

type StepperOutput = {
  state: ImeState;
  output: string;
};

type StrokeStepper = (input: StepperInput) => StepperOutput;

// 参考: https://github.com/tomoemon/google_input
export function createStrokeStepper(rules: RomanTable): StrokeStepper {
  const prefixMap = new Map<string, PrefixInfo>();
  const prefixCounts = new Map<string, number>();
  const exactMap = new Map<string, number>();

  rules.forEach((rule, index) => {
    exactMap.set(rule.input, index);
    for (let i = 1; i <= rule.input.length; i += 1) {
      const prefix = rule.input.slice(0, i);
      prefixCounts.set(prefix, (prefixCounts.get(prefix) ?? 0) + 1);
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

  const convertInput = (text: string) => {
    const index = exactMap.get(text);
    return index !== undefined ? rules[index].output : text;
  };

  const step = ({ state, key }: StepperInput): StepperOutput => {
    const input = state.buffer + key;
    const info = prefixMap.get(input);
    const tmpFixed = info?.exactIndex ?? state.matchedIndex;

    if (info?.canGrow) {
      // 候補が複数ある場合は確定を保留する
      return { state: { buffer: input, matchedIndex: tmpFixed }, output: "" };
    }

    if (tmpFixed !== null) {
      // 確定する
      const rule = rules[tmpFixed];
      const isExact = input.length === rule.input.length;
      const nextBuffer = isExact
        ? rule.nextInput ?? ""
        : (rule.nextInput ?? "") + key;
      return {
        output: rule.output,
        state: { buffer: nextBuffer, matchedIndex: null },
      };
    }

    if (state.buffer !== "") {
      const left = state.buffer;
      const right = key;
      const rightIndex = exactMap.get(right);
      const rightRule = rightIndex !== undefined ? rules[rightIndex] : null;

      if (rightRule?.nextInput) {
        const combined = left + rightRule.nextInput;
        const combinedPrefixes = prefixCounts.get(combined) ?? 0;
        if (combinedPrefixes > 0) {
          return { output: "", state: { buffer: combined, matchedIndex: null } };
        }
      }

      for (let i = 1; i < left.length; i += 1) {
        const leftPrefix = left.slice(0, -i);
        const leftSuffix = left.slice(-i);
        const combined = leftSuffix + right;
        const combinedPrefixes = prefixCounts.get(combined) ?? 0;
        if (combinedPrefixes >= 2) {
          return {
            output: convertInput(leftPrefix),
            state: { buffer: combined, matchedIndex: null },
          };
        }
        const combinedIndex = exactMap.get(combined);
        if (combinedIndex !== undefined) {
          const combinedRule = rules[combinedIndex];
          return {
            output: convertInput(leftPrefix) + combinedRule.output,
            state: {
              buffer: combinedRule.nextInput ?? "",
              matchedIndex: null,
            },
          };
        }
      }

      const leftOutput = convertInput(left);
      const rightPrefixes = prefixCounts.get(right) ?? 0;
      if (rightPrefixes >= 2) {
        return {
          output: leftOutput,
          state: { buffer: right, matchedIndex: null },
        };
      }

      if (rightRule) {
        return {
          output: leftOutput + rightRule.output,
          state: {
            buffer: rightRule.nextInput ?? "",
            matchedIndex: null,
          },
        };
      }

      return {
        output: leftOutput,
        state: { buffer: right, matchedIndex: null },
      };
    }

    return { output: "", state: { buffer: "", matchedIndex: null } };
  };

  return step;
}

export function createStrokeStepperForLayout(
  layoutId: LayoutId
): StrokeStepper {
  return createStrokeStepper(getRomanTable(layoutId));
}
