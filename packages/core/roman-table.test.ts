import { describe, expect, test } from "bun:test";
import { createStrokeProcessor, RomanTable } from "./roman-table";

describe(createStrokeProcessor, () => {
  const qwertyRomanTable: RomanTable = [
    { input: "a", output: "あ" },
    { input: "ka", output: "か" },
    { input: "kya", output: "きゃ" },
    { input: "kyu", output: "きゅ" },
    { input: "na", output: "な" },
    { input: "nn", output: "ん" },
    { input: "n", output: "ん" },
  ];

  describe("Qwerty", () => {
    const processStroke = createStrokeProcessor(qwertyRomanTable);

    function processStrokes(strokes: string): string {
      let buffer = "";
      let output = "";
      for (let i = 0; i < strokes.length; i++) {
        const result = processStroke({ buffer, pressedKey: strokes[i] });

        buffer = result.newBuffer;
        output += result.output;
      }
      return output;
    }

    test("a を あ に変換すること", () => {
      expect(processStrokes("a")).toBe("あ");
    });

    test("ka を か に変換すること", () => {
      expect(processStrokes("ka")).toBe("か");
    });

    test("naを な に変換すること", () => {
      expect(processStrokes("na")).toBe("な");
    });

    test("nnを ん に変換すること", () => {
      expect(processStrokes("nn")).toBe("ん");
    });

    test("nkaを んか に変換すること", () => {
      expect(processStrokes("nka")).toBe("んか");
    });

    test("kyaを きゃ に変換すること", () => {
      expect(processStrokes("kya")).toBe("きゃ");
    });
  });
});
