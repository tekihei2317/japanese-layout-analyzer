import { KeyCode } from "./keyboard";

// JIS配列
const StrokeKeys = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "-",
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "@",
  "[",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  ";",
  ":",
  "]",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  ",",
  ".",
  "/",
  "_",
  "\\", // 月林檎配列
  " ", // ハイブリッド月配列、ブリ中トロ配列、月見草配列
] as const;

type StrokeKey = (typeof StrokeKeys)[number];

type Hand = "L" | "R";

/**
 * 0~9 左小指~右小指
 */
export type Finger = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export function fingerToHand(finger: Finger): Hand {
  if ([0, 1, 2, 3, 4].includes(finger)) return "L";
  else return "R";
}

type Info = {
  finger: Finger;
};

export const keyToInfo: Record<StrokeKey, Info> = {
  "1": { finger: 0 },
  "2": { finger: 0 },
  "3": { finger: 0 },
  "4": { finger: 0 },
  "5": { finger: 0 },
  "6": { finger: 0 },
  "7": { finger: 0 },
  "8": { finger: 0 },
  "9": { finger: 0 },
  "0": { finger: 0 },
  "-": { finger: 0 },
  q: { finger: 0 },
  w: { finger: 1 },
  e: { finger: 2 },
  r: { finger: 3 },
  t: { finger: 3 },
  y: { finger: 6 },
  u: { finger: 6 },
  i: { finger: 7 },
  o: { finger: 8 },
  p: { finger: 9 },
  "@": { finger: 9 },
  "[": { finger: 9 },
  a: { finger: 0 },
  s: { finger: 1 },
  d: { finger: 2 },
  f: { finger: 3 },
  g: { finger: 3 },
  h: { finger: 6 },
  j: { finger: 6 },
  k: { finger: 7 },
  l: { finger: 8 },
  ";": { finger: 9 },
  ":": { finger: 9 },
  "]": { finger: 9 },
  z: { finger: 0 },
  x: { finger: 1 },
  c: { finger: 2 },
  v: { finger: 3 },
  b: { finger: 3 },
  n: { finger: 6 },
  m: { finger: 6 },
  ",": { finger: 7 },
  ".": { finger: 8 },
  "/": { finger: 9 },
  _: { finger: 9 },
  "\\": { finger: 0 }, // 月林檎配列（CapsLock/Control位置）
  " ": { finger: 4 }, // ハイブリッド月配列、ブリ中トロ配列、月見草配列
};

export type Keystroke = {
  key: StrokeKey;
  finger: Finger;
  hand: Hand;
};

const strokeKeySet = new Set(StrokeKeys);

function assertStrokeKeys(keys: string[]): asserts keys is StrokeKey[] {
  for (const key of keys) {
    if (!strokeKeySet.has(key as StrokeKey)) {
      throw new Error(`Unsupported stroke key: ${key}`);
    }
  }
}

export function toKeystrokes(keys: string[]): Keystroke[] {
  assertStrokeKeys(keys);
  return keys.map((key) => {
    const info = keyToInfo[key];
    return {
      key,
      finger: info.finger,
      hand: fingerToHand(info.finger),
    };
  });
}

export const strokeKeyToCode: Record<StrokeKey, KeyCode> = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "0": "0",
  "-": "Minus",
  q: "q",
  w: "w",
  e: "e",
  r: "r",
  t: "t",
  y: "y",
  u: "u",
  i: "i",
  o: "o",
  p: "p",
  "@": "BracketLeft",
  "[": "BracketRight",
  a: "a",
  s: "s",
  d: "d",
  f: "f",
  g: "g",
  h: "h",
  j: "j",
  k: "k",
  l: "l",
  ";": "Semicolon",
  ":": "Quote",
  "]": "Backslash",
  z: "z",
  x: "x",
  c: "c",
  v: "v",
  b: "b",
  n: "n",
  m: "m",
  ",": "Comma",
  ".": "Period",
  "/": "Slash",
  _: "IntlRo",
  "\\": "ControlLeft",
  " ": "Space",
};
