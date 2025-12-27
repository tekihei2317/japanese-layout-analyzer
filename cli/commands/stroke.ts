import { promises as fs } from "node:fs";
import type { LayoutId } from "@japanese-layout-analyzer/core";
import {
  getRomanTable,
  findShortestKeystrokesDetailed,
  normalizeText,
} from "@japanese-layout-analyzer/core";

export const strokeCommand = async (file: string, layoutId: string) => {
  const table = getRomanTable(layoutId as LayoutId);
  const inputText = await fs.readFile(file, "utf8");
  const normalized = normalizeText(inputText);
  const result = findShortestKeystrokesDetailed(table, normalized);

  if (!result.ok) {
    console.error("Failed to convert text to keystrokes.");
    console.error(
      `Stopped at ${result.farthestPos}/${
        normalized.length
      }: ${normalized.slice(0, result.farthestPos)}`
    );
    console.error(`Pending buffer: ${result.state.buffer || "(empty)"}`);
    console.error(`Partial keystrokes: ${result.partialStrokes}`);
    process.exitCode = 1;
    return;
  }

  console.log(result.strokes);
};
