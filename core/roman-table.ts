import bunaTable from "./layouts/buna.json";
import burichutoroTable from "./layouts/burichutoro-20221015.json";
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

/**
 * 打鍵をかなに変換する
 */
type Processer = (input: ProcessStrokeInput) => ProcessStrokeOutput;

export function createStrokeProcessor(table: RomanTable): Processer {
  function processStroke({
    buffer,
    pressedKey,
  }: ProcessStrokeInput): ProcessStrokeOutput {
    const next = buffer + pressedKey;
    const exact = findEntry(table, next);
    const prefixes = findEntriesByPrefix(table, next);

    if (prefixes.length >= 2) {
      // バッファに対する変換候補が複数ある場合は、変換を保留する
      return { newBuffer: next, output: "" };
    }

    if (exact) {
      // 変換ルールが1つしかない場合は、それを使って変換する
      return {
        output: exact.output,
        newBuffer: exact.nextInput ?? "",
      };
    }

    // 変換ルールが見つからなかった場合は、文字を|str|-1文字と1文字に分割してそれぞれ変換する
    const left = next.slice(0, -1);
    const right = next.slice(-1);

    const leftOutput = convertRoman(table, left);
    const rightExact = findEntry(table, right);
    const rightPrefixes = findEntriesByPrefix(table, right);

    if (rightPrefixes.length >= 2) {
      return { output: leftOutput, newBuffer: right };
    }

    if (rightExact) {
      return {
        output: leftOutput + rightExact.output,
        newBuffer: rightExact.nextInput ?? "",
      };
    }

    return { output: leftOutput, newBuffer: right };
  }

  return processStroke;
}

export function createStrokeProcessorForLayout(layoutId: LayoutId): Processer {
  return createStrokeProcessor(getRomanTable(layoutId));
}

export const processStroke = createStrokeProcessorForLayout("qwerty");
