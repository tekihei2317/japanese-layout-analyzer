import { beforeAll, describe, expect, test } from "bun:test";
import { promises as fs } from "node:fs";
import {
  findShortestKeystrokes,
  findShortestKeystrokesDetailed,
  normalizeText,
} from "./kana-to-stroke";
import { getRomanTable } from "./roman-table";
import { cases } from "./kana-to-stroke.cases";

describe(findShortestKeystrokes, () => {
  describe("月配列2-263式", () => {
    const table = getRomanTable("tsuki-2-263");
    test.each(cases["tsuki-2-263"])("%p -> %p", (kana, expected) => {
      expect(findShortestKeystrokes(table, kana)).toBe(expected);
    });
  });

  describe("花配列", () => {
    const table = getRomanTable("hana");
    test.each(cases.hana)("%p -> %p", (kana, expected) => {
      expect(findShortestKeystrokes(table, kana)).toBe(expected);
    });
  });

  describe("ぶな配列", () => {
    const table = getRomanTable("buna");
    test.each(cases.buna)("%p -> %p", (kana, expected) => {
      expect(findShortestKeystrokes(table, kana)).toBe(expected);
    });
  });

  describe("ミズナラ配列", () => {
    const table = getRomanTable("mizunara");
    test.each(cases.mizunara)("%p -> %p", (kana, expected) => {
      expect(findShortestKeystrokes(table, kana)).toBe(expected);
    });
  });

  describe("幸花配列", () => {
    const table = getRomanTable("yukika");
    test.each(cases.yukika)("%p -> %p", (kana, expected) => {
      expect(findShortestKeystrokes(table, kana)).toBe(expected);
    });
  });

  describe("文月配列", () => {
    const table = getRomanTable("fumiduki");
    test.each(cases.fumiduki)("%p -> %p", (kana, expected) => {
      expect(findShortestKeystrokes(table, kana)).toBe(expected);
    });
  });

  describe("英月配列", () => {
    const table = getRomanTable("hideduki");
    test.each(cases.hideduki)("%p -> %p", (kana, expected) => {
      expect(findShortestKeystrokes(table, kana)).toBe(expected);
    });
  });

  describe("ハイブリッド月配列", () => {
    const table = getRomanTable("hybrid-tsuki");
    test.each(cases["hybrid-tsuki"])("%p -> %p", (kana, expected) => {
      expect(findShortestKeystrokes(table, kana)).toBe(expected);
    });
  });

  describe("月林檎配列", () => {
    const table = getRomanTable("tukiringo");
    test.each(cases.tukiringo)("%p -> %p", (kana, expected) => {
      expect(findShortestKeystrokes(table, kana)).toBe(expected);
    });
  });
});

describe("シフトキー共有配列の変換", () => {
  describe("ハイブリッド月配列", () => {
    const table = getRomanTable("hybrid-tsuki");

    test("文中に読点がある場合に変換できること", () => {
      expect(findShortestKeystrokes(table, "、し")).toBe("d f");
    });

    test("文中に句点がある場合に変換できること", () => {
      expect(findShortestKeystrokes(table, "。し")).toBe("k f");
    });
  });
});

describe("日本国憲法前文", () => {
  let normalized = "";

  beforeAll(async () => {
    const text = await fs.readFile("data/texts/kenpou.txt", "utf8");
    normalized = normalizeText(text);
  });

  const assertConvertible = (layoutId: Parameters<typeof getRomanTable>[0]) => {
    const table = getRomanTable(layoutId);
    const result = findShortestKeystrokesDetailed(table, normalized);
    if (!result.ok) {
      throw new Error(
        `Stopped at ${result.farthestPos}/${normalized.length} (buffer: "${result.state.buffer}")`
      );
    }
  };

  describe("QWERTY", () => {
    test("変換できること", () => {
      assertConvertible("qwerty");
    });
  });

  describe("大西配列", () => {
    test("変換できること", () => {
      assertConvertible("oonisi");
    });
  });

  describe("花配列", () => {
    test("変換できること", () => {
      assertConvertible("hana");
    });
  });

  describe("月配列2-263式", () => {
    test("変換できること", () => {
      assertConvertible("tsuki-2-263");
    });
  });

  describe("幸花配列", () => {
    test("変換できること", () => {
      assertConvertible("yukika");
    });
  });

  describe("ミズナラ配列", () => {
    test("変換できること", () => {
      assertConvertible("mizunara");
    });
  });

  describe("ハイブリッド月配列", () => {
    test("変換できること", () => {
      assertConvertible("hybrid-tsuki");
    });
  });

  describe("ぶな配列", () => {
    test("変換できること", () => {
      assertConvertible("buna");
    });
  });

  describe("英月配列", () => {
    test("変換できること", () => {
      assertConvertible("hideduki");
    });
  });

  describe("ブリ中トロ配列", () => {
    test("変換できること", () => {
      assertConvertible("burichutoro-20221015");
    });
  });

  describe("月見草配列", () => {
    test("変換できること", () => {
      assertConvertible("tsukimisou");
    });
  });

  describe("月林檎配列", () => {
    test("変換できること", () => {
      assertConvertible("tukiringo");
    });
  });

  describe("文月配列", () => {
    test("変換できること", () => {
      assertConvertible("fumiduki");
    });
  });
});
