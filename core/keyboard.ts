// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
const KeyCodes = [
  "Escape",

  // Number row
  "Hankaku", // 間違ってるかも
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
  "Minus",
  "Equal",
  "Backquote",
  "Backspace",

  // Top row
  "Tab",
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
  "BracketLeft",
  "BracketRight",
  "Enter",

  // Middle row
  "ControlLeft",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "p",
  "Semicolon",
  "Quote",
  "Backslash",

  // Bottom Row
  "ShiftLeft",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  "Comma",
  "Period",
  "Slash",
  "IntlRo",
  "ShiftRight",

  // Space Row
  "Space",
] as const;

type KeyCode = (typeof KeyCodes)[number];

type LayoutKeyInfo = {
  code: KeyCode;
  /** キーの横幅 */
  unit: number;
  offset?: number;
};

type KeyboardRow =
  | "NumberRow"
  | "TopRow"
  | "MiddleRow"
  | "BottomRow"
  | "SpaceRow";

type KeyboardLayout = Record<KeyboardRow, LayoutKeyInfo[]>;

const RowStaggeredLayout: KeyboardLayout = {
  NumberRow: [
    { code: "Hankaku", unit: 1 },
    { code: "1", unit: 1 },
    { code: "2", unit: 1 },
    { code: "3", unit: 1 },
    { code: "4", unit: 1 },
    { code: "5", unit: 1 },
    { code: "6", unit: 1 },
    { code: "7", unit: 1 },
    { code: "8", unit: 1 },
    { code: "9", unit: 1 },
    { code: "0", unit: 1 },
    { code: "Minus", unit: 1 },
    { code: "Equal", unit: 1 },
    { code: "Backquote", unit: 1 },
    { code: "Backspace", unit: 1 },
  ],
  TopRow: [
    { code: "Tab", unit: 1.5 },
    { code: "q", unit: 1 },
    { code: "w", unit: 1 },
    { code: "e", unit: 1 },
    { code: "r", unit: 1 },
    { code: "t", unit: 1 },
    { code: "y", unit: 1 },
    { code: "u", unit: 1 },
    { code: "i", unit: 1 },
    { code: "o", unit: 1 },
    { code: "p", unit: 1 },
    { code: "BracketLeft", unit: 1 },
    { code: "BracketRight", unit: 1 },
    // Enterは2列にまたがっているのでどうするか
    { code: "Enter", unit: 1.5 },
  ],
  MiddleRow: [
    { code: "ControlLeft", unit: 1.75 },
    { code: "a", unit: 1 },
    { code: "s", unit: 1 },
    { code: "d", unit: 1 },
    { code: "f", unit: 1 },
    { code: "g", unit: 1 },
    { code: "h", unit: 1 },
    { code: "j", unit: 1 },
    { code: "k", unit: 1 },
    { code: "l", unit: 1 },
    { code: "Semicolon", unit: 1 },
    { code: "Quote", unit: 1 },
    { code: "Backslash", unit: 1 },
    { code: "Enter", unit: 1.25 },
  ],
  BottomRow: [
    { code: "ShiftLeft", unit: 2.25 },
    { code: "z", unit: 1 },
    { code: "x", unit: 1 },
    { code: "c", unit: 1 },
    { code: "v", unit: 1 },
    { code: "b", unit: 1 },
    { code: "n", unit: 1 },
    { code: "m", unit: 1 },
    { code: "Comma", unit: 1 },
    { code: "Period", unit: 1 },
    { code: "Slash", unit: 1 },
    { code: "IntlRo", unit: 1 },
    { code: "ShiftRight", unit: 1.75 },
  ],
  SpaceRow: [{ code: "Space", unit: 3, offset: 5.25 }],
};

const OrtholinierLayout: KeyboardLayout = {
  NumberRow: [
    { code: "Escape", unit: 1 },
    { code: "1", unit: 1 },
    { code: "2", unit: 1 },
    { code: "3", unit: 1 },
    { code: "4", unit: 1 },
    { code: "5", unit: 1 },
    { code: "6", unit: 1 },
    { code: "7", unit: 1 },
    { code: "8", unit: 1 },
    { code: "9", unit: 1 },
    { code: "0", unit: 1 },
    { code: "Minus", unit: 1 },
    { code: "Equal", unit: 1 },
    { code: "Backquote", unit: 1 },
  ],
  TopRow: [
    { code: "Tab", unit: 1 },
    { code: "q", unit: 1 },
    { code: "w", unit: 1 },
    { code: "e", unit: 1 },
    { code: "r", unit: 1 },
    { code: "t", unit: 1 },
    { code: "y", unit: 1 },
    { code: "u", unit: 1 },
    { code: "i", unit: 1 },
    { code: "o", unit: 1 },
    { code: "p", unit: 1 },
    { code: "BracketLeft", unit: 1 },
    { code: "BracketRight", unit: 1 },
    { code: "Backspace", unit: 1 },
  ],
  MiddleRow: [
    { code: "ControlLeft", unit: 1 },
    { code: "a", unit: 1 },
    { code: "s", unit: 1 },
    { code: "d", unit: 1 },
    { code: "f", unit: 1 },
    { code: "g", unit: 1 },
    { code: "h", unit: 1 },
    { code: "j", unit: 1 },
    { code: "k", unit: 1 },
    { code: "l", unit: 1 },
    { code: "Semicolon", unit: 1 },
    { code: "Quote", unit: 1 },
    { code: "Backslash", unit: 1 },
    { code: "Enter", unit: 1 },
  ],
  BottomRow: [
    { code: "ShiftLeft", unit: 1 },
    { code: "z", unit: 1 },
    { code: "x", unit: 1 },
    { code: "c", unit: 1 },
    { code: "v", unit: 1 },
    { code: "b", unit: 1 },
    { code: "n", unit: 1 },
    { code: "m", unit: 1 },
    { code: "Comma", unit: 1 },
    { code: "Period", unit: 1 },
    { code: "Slash", unit: 1 },
    { code: "IntlRo", unit: 1 },
    // 下段は1個キーが少ないので適当に1個詰めておく
    { code: "Hankaku", unit: 1 },
    { code: "ShiftRight", unit: 1 },
  ],
  SpaceRow: [{ code: "Space", unit: 2, offset: 6 }],
};
