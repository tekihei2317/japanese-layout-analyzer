import { describe, expect, test } from "bun:test";
import { collectKeys, findShortestKeystrokes } from "./stroke-utils";
import { getRomanTable, RomanTable } from "@japanese-layout-analyzer/core";

describe(collectKeys, () => {
  test("JISキーボードで入力できる記号を集めること", () => {
    const rules: RomanTable = [
      { input: "j", output: "あ" },
      { input: "'", output: "い" },
      { input: "@", output: "う" },
    ];
    expect(collectKeys(rules)).toEqual(["j", "@"]);
  });
});

describe(findShortestKeystrokes, () => {
  describe("月配列2-263式", () => {
    const table = getRomanTable("tsuki-2-263");
    const cases: [string, string][] = [
      ["、", ","],
      ["。", "."],
      ["「", "d@"],
      ["」", "d:"],
      ["゛", "l"],
      ["ー", "d."],
      ["ぁ", "kq"],
      ["あ", "kf"],
      ["ぃ", "ka"],
      ["い", "i"],
      ["ぅ", "kz"],
      ["う", "j"],
      ["ぇ", "dp"],
      ["え", "du"],
      ["ぉ", "d/"],
      ["お", "dj"],
      ["か", "s"],
      ["き", ";"],
      ["く", "h"],
      ["け", "x"],
      ["こ", "w"],
      ["さ", "b"],
      ["し", "e"],
      ["す", "z"],
      ["せ", "kc"],
      ["そ", "q"],
      ["た", "g"],
      ["ち", "@"],
      ["っ", "n"],
      ["つ", "y"],
      ["て", "r"],
      ["と", "f"],
      ["な", "v"],
      ["に", "c"],
      ["ぬ", "dy"],
      ["ね", "d,"],
      ["の", "o"],
      ["は", "a"],
      ["ひ", "kw"],
      ["ふ", "kr"],
      ["へ", "kx"],
      ["ほ", "ke"],
      ["ま", "dh"],
      ["み", "di"],
      ["む", "dn"],
      ["め", "kt"],
      ["も", "dk"],
      ["ゃ", "kb"],
      ["や", "do"],
      ["ゅ", "kv"],
      ["ゆ", "d;"],
      ["ょ", "t"],
      ["よ", "kg"],
      ["ら", "kd"],
      ["り", "p"],
      ["る", "m"],
      ["れ", ":"],
      ["ろ", "dm"],
      ["わ", "dl"],
      ["を", "ks"],
      ["ん", "u"],
    ];

    test.each(cases)("%p -> %p", (kana, expected) => {
      expect(findShortestKeystrokes(table, kana)).toBe(expected);
    });
  });

  describe("花配列", () => {
    const table = getRomanTable("hana");
    const cases = [
      ["、", "."],
      ["。", ","],
      ["「", "d@"],
      ["」", "d:"],
      ["゛", "l"],
      ["゜", "kg"],
      ["ー", "@"],
      ["ぁ", "ka"],
      ["あ", "kc"],
      ["い", "n"],
      ["ぃ", "dp"],
      ["ぅ", "kz"],
      ["う", "i"],
      ["ぇ", "ke"],
      ["え", "_"],
      ["ぉ", "d;"],
      ["お", "d."],
      ["か", "s"],
      ["き", "f"],
      ["く", "u"],
      ["け", "kw"],
      ["こ", "r"],
      ["さ", "z"],
      ["し", "x"],
      ["す", "a"],
      ["せ", "kx"],
      ["そ", "di"],
      ["た", "g"],
      ["ち", "dk"],
      ["っ", "y"],
      ["つ", "m"],
      ["て", "w"],
      ["と", "e"],
      ["な", "c"],
      ["に", "b"],
      ["ぬ", "d/"],
      ["ね", "dn"],
      ["の", "v"],
      ["は", "t"],
      ["ひ", "kq"],
      ["ふ", "dj"],
      ["へ", "kt"],
      ["ほ", "kr"],
      ["ま", "du"],
      ["み", "dm"],
      ["む", "dl"],
      ["め", "/"],
      ["も", "do"],
      ["ゃ", "dy"],
      ["や", "kf"],
      ["ゅ", "kd"],
      ["ゆ", "kb"],
      ["ょ", "q"],
      ["よ", "ks"],
      ["よ", "dh"],
      ["ら", "p"],
      ["り", ":"],
      ["る", "o"],
      ["れ", "j"],
      ["ろ", ";"],
      ["わ", "kv"],
      ["を", "d,"],
      ["ん", "h"],
    ];

    test.each(cases)("%p -> %p", (kana, expected) => {
      expect(findShortestKeystrokes(table, kana)).toBe(expected);
    });
  });
});
