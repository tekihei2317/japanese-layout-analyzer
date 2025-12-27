import { promises as fs } from "node:fs";
import path from "node:path";
import type { LayoutId } from "@japanese-layout-analyzer/core";
import {
  getRomanTable,
  normalizeText,
  findShortestKeystrokes,
  computeStrokeMetrics,
} from "@japanese-layout-analyzer/core";
import type { Format } from "../types";

export const analyzeCommand = async (
  corpusOrFile: string,
  layout: string,
  options: { format: Format }
) => {
  if (corpusOrFile.endsWith(".json")) {
    console.log("Not implemented");
    return;
  }

  const table = getRomanTable(layout as LayoutId);
  const inputText = await fs.readFile(corpusOrFile, "utf8");
  const normalized = normalizeText(inputText);
  const keystrokes = findShortestKeystrokes(table, normalized);

  if (!keystrokes) {
    console.error("Failed to convert text to keystrokes.");
    process.exitCode = 1;
    return;
  }

  const strokeMetrics = computeStrokeMetrics(keystrokes);
  const sfs3 = strokeMetrics.trigram.altSfs + strokeMetrics.trigram.redirectSfs;

  if (options.format === "json") {
    const payload = {
      layoutId: layout,
      corpusId: path.basename(corpusOrFile),
      unit: "ratio",
      metrics: {
        sfbs: strokeMetrics.bigram.sfb,
        sfss: sfs3,
        scissors: strokeMetrics.bigram.scissors,
      },
    };
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log(`layout: ${layout}`);
  console.log(`${path.basename(corpusOrFile)}:`);
  console.log(`  SFB: ${(strokeMetrics.bigram.sfb * 100).toFixed(2)}%`);
  console.log(`  SFS: ${(sfs3 * 100).toFixed(2)}%`);
  console.log(`  Sci: ${(strokeMetrics.bigram.scissors * 100).toFixed(2)}%`);
};
