import { promises as fs } from "node:fs";
import path from "node:path";
import type { LayoutId, RomanTable } from "@japanese-layout-analyzer/core";
import { getRomanTable } from "@japanese-layout-analyzer/core";
import type { Format } from "../types";
import type { Rule } from "../stroke-types";
import { computeMetrics } from "../analysis-utils";
import { findShortestKeystrokes, normalizeText } from "../stroke-utils";

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
  const rules = table as RomanTable as Rule[];
  const inputText = await fs.readFile(corpusOrFile, "utf8");
  const normalized = normalizeText(inputText);
  const keystrokes = findShortestKeystrokes(rules, normalized);

  if (!keystrokes) {
    console.error("Failed to convert text to keystrokes.");
    process.exitCode = 1;
    return;
  }

  const metrics = computeMetrics(keystrokes);

  if (options.format === "json") {
    const payload = {
      layoutId: layout,
      corpusId: path.basename(corpusOrFile),
      unit: "ratio",
      metrics: {
        sfbs: metrics.sfb,
        sfss: metrics.sfs,
        scissors: metrics.scissors,
      },
      distribution: {
        handLoad: metrics.handLoad,
        rowLoad: metrics.rowLoad,
        columnLoad: metrics.columnLoad,
        keyLoad: metrics.keyLoad,
      },
    };
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log(`layout: ${layout}`);
  console.log(`${path.basename(corpusOrFile)}:`);
  console.log(`  SFB: ${(metrics.sfb * 100).toFixed(2)}%`);
  console.log(`  SFS: ${(metrics.sfs * 100).toFixed(2)}%`);
  console.log(`  Sci: ${(metrics.scissors * 100).toFixed(2)}%`);
  console.log("");
  console.log(
    `  LH/RH: ${(metrics.handLoad.left * 100).toFixed(2)}% | ${(metrics.handLoad.right * 100).toFixed(2)}%`
  );
  console.log(
    `  Row: ${metrics.rowLoad
      .map((value) => (value * 100).toFixed(1))
      .join(" / ")}`
  );
  console.log(
    `  Col: ${metrics.columnLoad.left
      .map((value) => (value * 100).toFixed(1))
      .join(" ")} | ${metrics.columnLoad.right
      .map((value) => (value * 100).toFixed(1))
      .join(" ")}`
  );
  console.log("  Key:");
  metrics.keyLoad.forEach((row) => {
    const left = row.slice(0, 5).map((value) => (value * 100).toFixed(1));
    const right = row.slice(5).map((value) => (value * 100).toFixed(1));
    console.log(`    ${left.join(" ")} | ${right.join(" ")}`);
  });
};
