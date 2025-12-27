import { describe, expect, test } from "bun:test";
import { collectKeys, RomanTable } from "./roman-table";

describe(collectKeys, () => {
  test("JISキーボードで入力できる記号を集めること", () => {
    const rules: RomanTable = [
      { input: "j", output: "あ" },
      { input: "'", output: "い" },
      { input: "@", output: "う" },
    ];
    expect(collectKeys(rules)).toEqual(["j", "@"]);
  });

  test("バックスラッシュ（）を除外しないこと", () => {
    const rules: RomanTable = [{ input: "\\", output: "き" }];
    expect(collectKeys(rules)).toEqual(["\\"]);
  });
});
