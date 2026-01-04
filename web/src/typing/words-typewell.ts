export type TypeWellWord = {
  display: string;
  kana: string;
  book?: {
    name: string;
    author: string;
  };
};

export const typewellWords: TypeWellWord[] = [
  { display: "次に", kana: "つぎに" },
  { display: "でれでれ", kana: "でれでれ" },
  { display: "あっさり", kana: "あっさり" },
  { display: "すきがない", kana: "すきがない" },
  { display: "もやし", kana: "もやし" },
  { display: "なまり", kana: "なまり" },
  { display: "ソーセージ", kana: "そーせーじ" },
  { display: "ごめん", kana: "ごめん" },
  { display: "限度", kana: "げんど" },
];
