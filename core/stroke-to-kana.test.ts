import { describe, test, expect } from "bun:test";
import { getRomanTable } from "./roman-table";
import { createStrokeStepper, ImeState } from "./stroke-to-kana";

function makeProcessStrokes(
  processStroke: ReturnType<typeof createStrokeStepper>
) {
  return (strokes: string) => {
    let imeState: ImeState = { buffer: "", matchedIndex: null };
    let output = "";
    for (const ch of strokes) {
      const result = processStroke({ state: imeState, key: ch });
      output += result.output;
      imeState = result.state;
    }
    return { output, buffer: imeState.buffer };
  };
}

describe(createStrokeStepper, () => {
  describe("Qwerty", () => {
    const qwertyRomanTable = getRomanTable("qwerty");
    const processStroke = createStrokeStepper(qwertyRomanTable);
    const processStrokes = makeProcessStrokes(processStroke);

    test("a を あ に変換すること", () => {
      expect(processStrokes("a").output).toBe("あ");
    });

    test("ka を か に変換すること", () => {
      expect(processStrokes("ka").output).toBe("か");
    });

    test("naを な に変換すること", () => {
      expect(processStrokes("na").output).toBe("な");
    });

    test("nnを ん に変換すること", () => {
      expect(processStrokes("nn").output).toBe("ん");
    });

    test("nkaを んか に変換すること", () => {
      expect(processStrokes("nka").output).toBe("んか");
    });

    test("kyaを きゃ に変換すること", () => {
      expect(processStrokes("kya").output).toBe("きゃ");
    });
  });

  describe("月配列2-263式", () => {
    const tsukiRomanTable = getRomanTable("tsuki-2-263");
    const processStrokes = makeProcessStrokes(
      createStrokeStepper(tsukiRomanTable)
    );

    test("siを かい に変換すること", () => {
      expect(processStrokes("si").output).toBe("かい");
    });

    test("slを が に変換すること", () => {
      expect(processStrokes("sl").output).toBe("が");
    });

    test("elを じ に変換すること", () => {
      expect(processStrokes("el").output).toBe("じ");
    });

    test("esを しか に変換すること", () => {
      expect(processStrokes("es")).toEqual({ output: "し", buffer: "か" });
    });

    test("rlを で に変換すること", () => {
      expect(processStrokes("rl").output).toBe("で");
    });
  });

  describe("花配列", () => {
    const hanaRomanTable = getRomanTable("hana");
    const processStrokes = makeProcessStrokes(
      createStrokeStepper(hanaRomanTable)
    );

    test("tkgを ぱ に変換すること", () => {
      expect(processStrokes("tkg")).toEqual({ output: "ぱ", buffer: "" });
    });

    test("krkgを ぽ に変換すること", () => {
      expect(processStrokes("krkg")).toEqual({ output: "ぽ", buffer: "" });
    });

    test("tkrを はほ に変換すること", () => {
      expect(processStrokes("tkr")).toEqual({ output: "は", buffer: "ほ" });
    });
  });
});
