import { promises as fs } from "node:fs";
import path from "node:path";
import kuromoji from "kuromoji";
import type { Token, Tokenizer } from "kuromoji";

type WordEntry = {
  display: string;
  kana: string;
  url: string;
  book: {
    name: string;
    author: string;
  };
  note?: string;
};

const args = process.argv.slice(2);
const targetPath = args[0] ?? path.join("data", "aozora", "words-picked.json");

function katakanaToHiragana(value: string) {
  return value.replace(/[\u30A1-\u30F6]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x60)
  );
}

function buildTokenizer() {
  return new Promise<Tokenizer>((resolve, reject) => {
    const dicPath = path.join(process.cwd(), "node_modules", "kuromoji", "dict");
    kuromoji.builder({ dicPath }).build((error, tokenizer) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(tokenizer);
    });
  });
}

function toKana(tokenizer: Tokenizer, line: string) {
  if (line.trim() === "") return "";
  const tokens = tokenizer.tokenize(line);
  return tokens
    .map((token: Token) => {
      const reading = token.reading && token.reading !== "*" ? token.reading : null;
      const source = reading ?? token.surface_form;
      return katakanaToHiragana(source);
    })
    .join("");
}

async function run() {
  const tokenizer = await buildTokenizer();
  const raw = await fs.readFile(targetPath, "utf8");
  const entries = JSON.parse(raw) as WordEntry[];

  const updated = entries.map((entry) => {
    if (entry.kana || !entry.display) return entry;
    return { ...entry, kana: toKana(tokenizer, entry.display) };
  });

  await fs.writeFile(targetPath, JSON.stringify(updated, null, 2) + "\n");
  console.log(`Updated kana for ${targetPath}`);
}

run().catch((error) => {
  console.error("Failed to fill kana.");
  console.error(error);
  process.exit(1);
});
