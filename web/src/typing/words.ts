import { aozoraWords, type AozoraWord } from "./words-aozora";
import type { TypeWellWord } from "./words-type";
import { typewellWords } from "./words-typewell";
import { typewellKanjiWords } from "./words-typewell-kanji";
import { typewellKankotoWords } from "./words-typewell-kankoto";
import { typewellKatakanaWords } from "./words-typewell-katakana";

export const words = {
  aozora: aozoraWords,
  typewell: typewellWords,
  typewellKatakana: typewellKatakanaWords,
  typewellKanji: typewellKanjiWords,
  typewellKankoto: typewellKankotoWords,
};

export type Word = AozoraWord | TypeWellWord;

export function generateWords(
  wordSetId: keyof typeof words,
  count: number
): Word[] {
  const source = words[wordSetId] ?? [];
  const offset = 0;
  if (source.length === 0) return [];
  return Array.from(
    { length: count },
    (_, index) => source[(offset + index) % source.length]
  );
}
