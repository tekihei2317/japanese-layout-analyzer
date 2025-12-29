import bunaTable from "./layouts/buna.json";
import burichutoroTable from "./layouts/burichutoro-20221015.json";
import hanaTable from "./layouts/hana.json";
import qwertyTable from "./layouts/qwerty.json";
import tsukiTable from "./layouts/tsuki-2-263.json";
import tukiringoTable from "./layouts/tukiringo.json";
import yukikaTable from "./layouts/yukika.json";
import mizunaraTable from "./layouts/mizunara.json";
import hybridTsukiTable from "./layouts/hybrid-tsuki.json";
import hidedukiTable from "./layouts/hideduki.json";
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

// ファイル名と同じ名前をキーに指定する
const layoutTables = {
  qwerty: qwertyTable as RomanTable,
  oonisi: oonisiTable as RomanTable,
  hana: hanaTable as RomanTable,
  "tsuki-2-263": tsukiTable as RomanTable,
  yukika: yukikaTable as RomanTable,
  mizunara: mizunaraTable as RomanTable,
  "hybrid-tsuki": hybridTsukiTable as RomanTable,
  buna: bunaTable as RomanTable,
  hideduki: hidedukiTable as RomanTable,
  "burichutoro-20221015": burichutoroTable as RomanTable,
  tsukimisou: tsukimisouTable as RomanTable,
  tukiringo: tukiringoTable as RomanTable,
  fumiduki: fumidukiTable as RomanTable,
} as const;

export type LayoutId = keyof typeof layoutTables;
export const layoutIdOrder = Object.keys(layoutTables) as LayoutId[];

export function getRomanTable(layoutId: LayoutId): RomanTable {
  return layoutTables[layoutId];
}

const jisKeyboardKeys = "1234567890-^¥qwertyuiop@[asdfghjkl;:]zxcvbnm,./_";
// 月林檎はCapsLock/Control位置をバッククウォートにして使う
const tsukiringoException = "\\";
// 句読点とシフトを共有している配列では、句読点の前後にスペースを入れて確定することにする
// 詳細は docs/shift-sharing-layout.md を参照
const shiftSharingLayoutException = " ";
const validKeys = new Set(
  (jisKeyboardKeys + tsukiringoException + shiftSharingLayoutException).split(
    ""
  )
);

/**
 * ローマ字テーブルから入力に使うキーを集める
 */
export function collectKeys(rules: RomanTable) {
  const keys = new Set<string>();
  rules.forEach((rule) => {
    for (const ch of rule.input) {
      if (validKeys.has(ch)) {
        keys.add(ch);
      }
    }
  });
  return Array.from(keys);
}
