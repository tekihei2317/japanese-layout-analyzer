import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type KeyCode =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "semicolon"
  | "comma"
  | "period"
  | "slash"
  | "hyphen";

const keyCodeToChar: Record<KeyCode, string> = {
  a: "a",
  b: "b",
  c: "c",
  d: "d",
  e: "e",
  f: "f",
  g: "g",
  h: "h",
  i: "i",
  j: "j",
  k: "k",
  l: "l",
  m: "m",
  n: "n",
  o: "o",
  p: "p",
  q: "q",
  r: "r",
  s: "s",
  t: "t",
  u: "u",
  v: "v",
  w: "w",
  x: "x",
  y: "y",
  z: "z",
  semicolon: ";",
  comma: ",",
  period: ".",
  slash: "/",
  hyphen: "-",
};

const simpleModifications: Array<{ from: KeyCode; to: KeyCode }> = [
  { from: "a", to: "e" },
  { from: "b", to: "semicolon" },
  { from: "comma", to: "m" },
  { from: "d", to: "a" },
  { from: "e", to: "u" },
  { from: "f", to: "o" },
  { from: "g", to: "hyphen" },
  { from: "h", to: "k" },
  { from: "hyphen", to: "slash" },
  { from: "i", to: "r" },
  { from: "j", to: "t" },
  { from: "k", to: "n" },
  { from: "l", to: "s" },
  { from: "m", to: "d" },
  { from: "n", to: "g" },
  { from: "o", to: "y" },
  { from: "period", to: "j" },
  { from: "r", to: "comma" },
  { from: "s", to: "i" },
  { from: "semicolon", to: "h" },
  { from: "slash", to: "b" },
  { from: "t", to: "period" },
  { from: "u", to: "w" },
  { from: "w", to: "l" },
  { from: "y", to: "f" },
];

const rootDir = path.resolve(process.cwd());
const sourcePath = path.join(rootDir, "layouts", "qwerty.tsv");
const outputPath = path.join(rootDir, "layouts", "oonisi.tsv");

function buildInverseCharMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const rule of simpleModifications) {
    const fromChar = keyCodeToChar[rule.from];
    const toChar = keyCodeToChar[rule.to];
    map.set(toChar, fromChar);
  }
  return map;
}

function rewriteInput(input: string, charMap: Map<string, string>): string {
  return input
    .split("")
    .map((char) => charMap.get(char) ?? char)
    .join("");
}

async function main() {
  const contents = await readFile(sourcePath, "utf8");
  const charMap = buildInverseCharMap();
  const lines = contents.split(/\r?\n/);
  const rewritten = lines.map((line) => {
    if (!line.trim()) return line;
    const parts = line.split("\t");
    if (parts.length === 0) return line;
    parts[0] = rewriteInput(parts[0], charMap);
    return parts.join("\t");
  });

  await writeFile(outputPath, `${rewritten.join("\n")}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
