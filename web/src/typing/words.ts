import { aozoraWords, type AozoraWord } from "./words-aozora";
import { typewellWords, type TypeWellWord } from "./words-typewell";

export const words = {
  aozora: aozoraWords,
  typewell: typewellWords,
};

export type Word = AozoraWord | TypeWellWord;

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
