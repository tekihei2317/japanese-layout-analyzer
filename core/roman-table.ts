import bunaTable from "./layouts/buna.json";
import burichutoroTable from "./layouts/burichutoro-20221015.json";
import hanaTable from "./layouts/hana.json";
import qwertyTable from "./layouts/qwerty.json";
import tsukiTable from "./layouts/tsuki-2-263.json";
import tukiringoTable from "./layouts/tukiringo.json";

/**
 * ローマ字テーブルのエントリ
 */
export type TableEntry = { input: string; output: string; nextInput?: string };

/**
 * ローマ字テーブル
 */
export type RomanTable = TableEntry[];

const layoutTables = {
  buna: bunaTable as RomanTable,
  "burichutoro-20221015": burichutoroTable as RomanTable,
  hana: hanaTable as RomanTable,
  qwerty: qwertyTable as RomanTable,
  "tsuki-2-263": tsukiTable as RomanTable,
  tukiringo: tukiringoTable as RomanTable,
} as const;

export type LayoutId = keyof typeof layoutTables;

export function getRomanTable(layoutId: LayoutId): RomanTable {
  return layoutTables[layoutId];
}

function findEntry(table: RomanTable, text: string): TableEntry | undefined {
  return table.find((entry) => entry.input === text);
}

function findEntriesByPrefix(table: RomanTable, prefix: string): TableEntry[] {
  return table.filter((entry) => entry.input.startsWith(prefix));
}

function convertRoman(table: RomanTable, text: string): string {
  const rule = findEntry(table, text);
  return rule ? rule.output : text;
}

type ProcessStrokeInput = { buffer: string; pressedKey: string };
type ProcessStrokeOutput = { output: string; newBuffer: string };
type Processor = (input: ProcessStrokeInput) => ProcessStrokeOutput;

// 参考: https://github.com/tomoemon/google_input
export function createStrokeProcessor(table: RomanTable): Processor {
  let inputBuffer = "";
  let tmpFixed: TableEntry | null = null;
  let nextCandidates: TableEntry[] = [];

  return function processStroke({
    buffer,
    pressedKey,
  }: ProcessStrokeInput): ProcessStrokeOutput {
    if (buffer !== inputBuffer) {
      inputBuffer = buffer;
      tmpFixed = null;
      nextCandidates = [];
    }

    const candidates = nextCandidates.length ? nextCandidates : table;
    const input = inputBuffer + pressedKey;
    let localTmpFixed = tmpFixed;
    const localNextCandidates: TableEntry[] = [];

    for (const rule of candidates) {
      if (rule.input.startsWith(input)) {
        if (rule.input === input) {
          localTmpFixed = rule;
        } else {
          localNextCandidates.push(rule);
        }
      }
    }

    if (localNextCandidates.length === 0) {
      if (localTmpFixed) {
        if (localTmpFixed.input.length === input.length) {
          inputBuffer = localTmpFixed.nextInput ?? "";
        } else {
          inputBuffer = (localTmpFixed.nextInput ?? "") + pressedKey;
        }
        tmpFixed = null;
        nextCandidates = [];
        return { output: localTmpFixed.output, newBuffer: inputBuffer };
      }

      const left = input.slice(0, -1);
      const right = input.slice(-1);
      const rightExact = findEntry(table, right);
      const rightPrefixes = findEntriesByPrefix(table, right);

      if (rightExact?.nextInput) {
        const combined = left + rightExact.nextInput;
        const combinedPrefixes = findEntriesByPrefix(table, combined);
        if (combinedPrefixes.length > 0) {
          inputBuffer = combined;
          tmpFixed = null;
          nextCandidates = combinedPrefixes;
          return { output: "", newBuffer: inputBuffer };
        }
      }

      for (let i = 1; i < left.length; i += 1) {
        const leftPrefix = left.slice(0, -i);
        const leftSuffix = left.slice(-i);
        const combined = leftSuffix + right;
        const combinedPrefixes = findEntriesByPrefix(table, combined);
        if (combinedPrefixes.length >= 2) {
          inputBuffer = combined;
          tmpFixed = null;
          nextCandidates = combinedPrefixes;
          return {
            output: convertRoman(table, leftPrefix),
            newBuffer: inputBuffer,
          };
        }
        const combinedExact = findEntry(table, combined);
        if (combinedExact) {
          inputBuffer = combinedExact.nextInput ?? "";
          tmpFixed = null;
          nextCandidates = [];
          return {
            output: convertRoman(table, leftPrefix) + combinedExact.output,
            newBuffer: inputBuffer,
          };
        }
      }

      const leftOutput = convertRoman(table, left);

      if (rightPrefixes.length >= 2) {
        inputBuffer = right;
        tmpFixed = null;
        nextCandidates = rightPrefixes;
        return { output: leftOutput, newBuffer: inputBuffer };
      }

      if (rightExact) {
        inputBuffer = rightExact.nextInput ?? "";
        tmpFixed = null;
        nextCandidates = [];
        return {
          output: leftOutput + rightExact.output,
          newBuffer: inputBuffer,
        };
      }

      inputBuffer = right;
      tmpFixed = null;
      nextCandidates = [];
      return { output: leftOutput, newBuffer: inputBuffer };
    }

    inputBuffer = input;
    tmpFixed = localTmpFixed ?? null;
    nextCandidates = localNextCandidates;
    return { output: "", newBuffer: inputBuffer };
  };
}

export function createStrokeProcessorForLayout(layoutId: LayoutId): Processor {
  return createStrokeProcessor(getRomanTable(layoutId));
}

export const processStroke = createStrokeProcessorForLayout("qwerty");
