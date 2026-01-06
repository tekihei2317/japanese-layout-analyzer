import { promises as fs } from "node:fs";
import path from "node:path";
import {
  createStrokeStepperForLayout,
  ImeState,
} from "@japanese-layout-analyzer/core/stroke-to-kana";
import assert from "node:assert";

type TypewellEntry = {
  word: string;
  roman: string;
};

type TypeWellWord = {
  display: string;
  kana: string;
};

const [inputDir = path.join("data", "typewell"), outputDir] =
  process.argv.slice(2);
const resolvedOutputDir = outputDir ?? inputDir;

const decodeXml = (value: string) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

function parseWordAttributes(line: string): TypewellEntry | null {
  const attrMatches = line.matchAll(/(\w+)="([^"]*)"/g);
  const attrs = new Map<string, string>();
  for (const match of attrMatches) {
    const key = match[1];
    const value = decodeXml(match[2] ?? "");
    attrs.set(key, value);
  }
  const word = attrs.get("word") ?? "";
  const roman = attrs.get("roman") ?? "";
  if (!word || !roman) return null;
  return { word, roman };
}

const processStroke = createStrokeStepperForLayout("qwerty");
const processStrokes = makeProcessStrokes();

function makeProcessStrokes() {
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

function romanToKana(roman: string): string {
  const result = processStrokes(roman);
  let kana = result.output;
  if (result.buffer !== "") {
    if (result.buffer == "n") {
      kana += "ん";
    } else if (result.buffer === "fu") {
      kana += "ふ";
    } else {
      assert.ok(result.output !== "");
    }
  }
  return kana;
}

async function run() {
  const files = (await fs.readdir(inputDir))
    .filter((file) => file.endsWith(".tpl"))
    .sort((a, b) => a.localeCompare(b, "ja"));

  if (files.length === 0) {
    console.error(`No .tpl files found in ${inputDir}`);
    process.exit(1);
  }

  for (const file of files) {
    const entries: TypewellEntry[] = [];
    const filePath = path.join(inputDir, file);
    const raw = await fs.readFile(filePath, "utf8");
    const lines = raw.split(/\r?\n/);
    for (const line of lines) {
      if (!line.includes("<Word")) continue;
      const entry = parseWordAttributes(line);
      if (entry) entries.push(entry);
    }
    const baseName = path.basename(file, ".tpl");
    const outputPath = path.join(resolvedOutputDir, `${baseName}.json`);

    const words: TypeWellWord[] = entries.map((entry) => ({
      display: entry.word,
      kana: romanToKana(entry.roman),
    }));
    await fs.writeFile(outputPath, JSON.stringify(words, null, 2) + "\n");
    console.log(`Wrote ${words.length} words to ${outputPath}`);
  }
}

run().catch((error) => {
  console.error("Failed to convert typewell words.");
  console.error(error);
  process.exit(1);
});
