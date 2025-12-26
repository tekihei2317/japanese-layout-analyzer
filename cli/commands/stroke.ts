import { promises as fs } from "node:fs";
import type {
  LayoutId,
  RomanTable,
  Rule,
} from "@japanese-layout-analyzer/core";
import {
  getRomanTable,
  findShortestKeystrokes,
  normalizeText,
} from "@japanese-layout-analyzer/core";

export const strokeCommand = async (file: string, layoutId: string) => {
  const table = getRomanTable(layoutId as LayoutId);
  const rules = table as RomanTable as Rule[];
  const inputText = await fs.readFile(file, "utf8");
  const normalized = normalizeText(inputText);
  const keystrokes = findShortestKeystrokes(rules, normalized);

  if (!keystrokes) {
    console.error("Failed to convert text to keystrokes.");
    process.exitCode = 1;
    return;
  }

  console.log(keystrokes);
};
