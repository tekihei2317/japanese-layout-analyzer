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
  const prefixCounts = new Map<string, number>();
  const exactMap = new Map<string, number>();

  rules.forEach((rule, index) => {
    exactMap.set(rule.input, index);
    for (let i = 1; i <= rule.input.length; i += 1) {
      const prefix = rule.input.slice(0, i);
      prefixCounts.set(prefix, (prefixCounts.get(prefix) ?? 0) + 1);
    }
  });

  const lookUpPrefix = (text: string) => {
    for (let i = text.length; i > 0; i -= 1) {
      const prefix = text.slice(0, i);
      const index = exactMap.get(prefix);
      if (index !== undefined) {
        const fixed = (prefixCounts.get(prefix) ?? 0) === 1;
        return { rule: rules[index], keyLength: i, fixed };
      }
    }
    return { rule: null, keyLength: 0, fixed: false };
  };

  const step = ({ state, key }: StepperInput): StepperOutput => {
    let input = state.buffer + key;
    let output = "";

    while (input.length > 0) {
      const lookup = lookUpPrefix(input);
      if (lookup.rule) {
        const remaining = input.slice(lookup.keyLength);
        if (!lookup.fixed && remaining.length === 0) {
          return { output, state: { buffer: input, matchedIndex: null } };
        }
        output += lookup.rule.output;
        input = (lookup.rule.nextInput ?? "") + remaining;
        continue;
      }

      const prefixCount = prefixCounts.get(input) ?? 0;
      if (prefixCount > 0) {
        return { output, state: { buffer: input, matchedIndex: null } };
      }

      const left = input.slice(0, -1);
      const right = input.slice(-1);
      const rightIndex = exactMap.get(right);
      const rightRule = rightIndex !== undefined ? rules[rightIndex] : null;
      if (rightRule?.nextInput && left) {
        const combined = left + rightRule.nextInput;
        if ((prefixCounts.get(combined) ?? 0) > 0) {
          return { output, state: { buffer: combined, matchedIndex: null } };
        }
      }

      output += input[0];
      input = input.slice(1);
    }

    return { output, state: { buffer: "", matchedIndex: null } };
  };

  return step;
}

export function createStrokeStepperForLayout(
  layoutId: LayoutId
): StrokeStepper {
  return createStrokeStepper(getRomanTable(layoutId));
}
