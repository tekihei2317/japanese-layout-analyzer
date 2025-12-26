import { promises as fs } from "node:fs";
import path from "node:path";
import kuromoji from "kuromoji";
import type { Token, Tokenizer } from "kuromoji";

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  console.error("Usage: bun run scripts/convert-text-to-hiragana.ts <input> <output>");
  process.exit(1);
}

const katakanaToHiragana = (value: string) =>
  value.replace(/[\u30A1-\u30F6]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x60)
  );

const buildTokenizer = () =>
  new Promise<Tokenizer>((resolve, reject) => {
    const dicPath = path.join(process.cwd(), "node_modules", "kuromoji", "dict");
    kuromoji.builder({ dicPath }).build((error, tokenizer) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(tokenizer);
    });
  });

const tokenizeLine = (tokenizer: Tokenizer, line: string) => {
  if (line.trim() === "") return line;
  const tokens = tokenizer.tokenize(line);
  return tokens
    .map((token: Token) => {
      const reading = token.reading && token.reading !== "*" ? token.reading : null;
      const source = reading ?? token.surface_form;
      return katakanaToHiragana(source);
    })
    .join("");
};

const run = async () => {
  const tokenizer = await buildTokenizer();
  const input = await fs.readFile(inputPath, "utf8");
  const lines = input.split(/\r?\n/);
  const converted = lines.map((line) => tokenizeLine(tokenizer, line)).join("\n");
  await fs.writeFile(outputPath, converted);
};

run().catch((error) => {
  console.error("Failed to convert to hiragana.");
  console.error(error);
  process.exit(1);
});
