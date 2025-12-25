type Finger = "LP" | "LR" | "LM" | "LI" | "RI" | "RM" | "RR" | "RP";

const fingerMap: Record<string, Finger> = {
  q: "LP",
  a: "LP",
  z: "LP",
  w: "LR",
  s: "LR",
  x: "LR",
  e: "LM",
  d: "LM",
  c: "LM",
  r: "LI",
  f: "LI",
  v: "LI",
  t: "LI",
  g: "LI",
  b: "LI",
  y: "RI",
  h: "RI",
  n: "RI",
  u: "RI",
  j: "RI",
  m: "RI",
  i: "RM",
  k: "RM",
  ",": "RM",
  o: "RR",
  l: "RR",
  ".": "RR",
  p: "RP",
  ";": "RP",
  "/": "RP",
  "-": "RP",
  "[": "RP",
  "]": "RP",
  "'": "RP",
  "\\": "RP",
};

const rowColMap: Record<string, { row: number; col: number }> = {
  q: { row: 0, col: 0 },
  w: { row: 0, col: 1 },
  e: { row: 0, col: 2 },
  r: { row: 0, col: 3 },
  t: { row: 0, col: 4 },
  y: { row: 0, col: 5 },
  u: { row: 0, col: 6 },
  i: { row: 0, col: 7 },
  o: { row: 0, col: 8 },
  p: { row: 0, col: 9 },
  a: { row: 1, col: 0 },
  s: { row: 1, col: 1 },
  d: { row: 1, col: 2 },
  f: { row: 1, col: 3 },
  g: { row: 1, col: 4 },
  h: { row: 1, col: 5 },
  j: { row: 1, col: 6 },
  k: { row: 1, col: 7 },
  l: { row: 1, col: 8 },
  ";": { row: 1, col: 9 },
  z: { row: 2, col: 0 },
  x: { row: 2, col: 1 },
  c: { row: 2, col: 2 },
  v: { row: 2, col: 3 },
  b: { row: 2, col: 4 },
  n: { row: 2, col: 5 },
  m: { row: 2, col: 6 },
  ",": { row: 2, col: 7 },
  ".": { row: 2, col: 8 },
  "/": { row: 2, col: 9 },
};

const scissorPairs = new Set<string>([
  "cq",
  "cw",
  "cr",
  "ct",
  "xq",
  "xr",
  "xt",
  "xe",
  "zw",
  ",p",
  ",o",
  ",u",
  ",y",
  ".p",
  ".u",
  ".y",
  ".i",
  "/o",
]);

const isScissor = (a: string, b: string) => {
  const key = `${a}${b}`;
  const rev = `${b}${a}`;
  return scissorPairs.has(key) || scissorPairs.has(rev);
};

type MetricsResult = {
  sfb: number;
  sfs: number;
  scissors: number;
  handLoad: { left: number; right: number };
  rowLoad: number[];
  columnLoad: { left: number[]; right: number[] };
  keyLoad: number[][];
};

export const computeMetrics = (strokes: string): MetricsResult => {
  const keys = Array.from(strokes);
  const total = keys.length;
  const keyCounts = Array.from({ length: 3 }, () => Array(10).fill(0));
  const rowCounts = Array(3).fill(0);
  const colCounts = Array(10).fill(0);
  let leftCount = 0;
  let rightCount = 0;

  keys.forEach((key) => {
    const finger = fingerMap[key];
    if (finger) {
      if (finger.startsWith("L")) leftCount += 1;
      if (finger.startsWith("R")) rightCount += 1;
    }
    const pos = rowColMap[key];
    if (pos) {
      rowCounts[pos.row] += 1;
      colCounts[pos.col] += 1;
      keyCounts[pos.row][pos.col] += 1;
    }
  });

  const validBigram = (a: string, b: string) =>
    a !== b && fingerMap[a] && fingerMap[b];

  let sfbCount = 0;
  let sfbTotal = 0;
  let scissorCount = 0;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const a = keys[i];
    const b = keys[i + 1];
    if (!validBigram(a, b)) continue;
    sfbTotal += 1;
    if (fingerMap[a] === fingerMap[b]) sfbCount += 1;
    if (isScissor(a, b)) scissorCount += 1;
  }

  let sfsCount = 0;
  let sfsTotal = 0;
  for (let i = 0; i < keys.length - 2; i += 1) {
    const a = keys[i];
    const c = keys[i + 2];
    if (!validBigram(a, c)) continue;
    sfsTotal += 1;
    if (fingerMap[a] === fingerMap[c]) sfsCount += 1;
  }

  const denom = total || 1;
  const left = leftCount / denom;
  const right = rightCount / denom;

  const rowLoad = rowCounts.map((count) => count / denom);
  const columnLoad = {
    left: colCounts.slice(0, 5).map((count) => count / denom),
    right: colCounts.slice(5).map((count) => count / denom),
  };
  const keyLoad = keyCounts.map((row) =>
    row.map((count) => count / denom)
  );

  return {
    sfb: sfbTotal ? sfbCount / sfbTotal : 0,
    sfs: sfsTotal ? sfsCount / sfsTotal : 0,
    scissors: sfbTotal ? scissorCount / sfbTotal : 0,
    handLoad: { left, right },
    rowLoad,
    columnLoad,
    keyLoad,
  };
};
