import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type LayoutEntry = { input: string; output: string; nextInput?: string };

const rootDir = path.resolve(process.cwd());
const layoutsDir = path.join(rootDir, "layouts");
const outputDir = path.join(rootDir, "packages", "core", "layouts");

function parseTsv(contents: string, source: string): LayoutEntry[] {
  const entries: LayoutEntry[] = [];
  const lines = contents.split(/\r?\n/);
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const parts = trimmed.split("\t");
    if (parts.length === 1) {
      return;
    }
    if (parts.length === 2) {
      entries.push({ input: parts[0], output: parts[1] });
      return;
    }
    if (parts.length === 3) {
      entries.push({
        input: parts[0],
        output: parts[1],
        nextInput: parts[2] || undefined,
      });
      return;
    }
    throw new Error(
      `Invalid TSV row in ${source}:${index + 1} (expected 2-3 columns)`
    );
  });
  return entries;
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const files = await readdir(layoutsDir);
  const tsvFiles = files.filter((file) => file.endsWith(".tsv"));

  for (const file of tsvFiles) {
    const sourcePath = path.join(layoutsDir, file);
    const contents = await readFile(sourcePath, "utf8");
    const entries = parseTsv(contents, sourcePath);
    const baseName = path.basename(file, ".tsv");
    const outputPath = path.join(outputDir, `${baseName}.json`);
    await writeFile(
      outputPath,
      JSON.stringify(entries, null, 2) + "\n",
      "utf8"
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
