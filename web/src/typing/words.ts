import { aozoraWords } from "./words-aozora";

export const words = {
  aozora: aozoraWords,
};

export type Word = {
  display: string;
  kana: string;
};

export function generateWords(
  wordSetId: keyof typeof words,
  count: number
): Word[] {
  const source = words[wordSetId] ?? [];
  if (source.length === 0) return [];
  return Array.from(
    { length: count },
    (_, index) => source[index % source.length]
  );
}
