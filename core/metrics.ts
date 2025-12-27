import assert from "node:assert";

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

const allowedStrokeKeys = new Set(
  Object.keys(rowColMap).filter((key) => key in fingerMap)
);

const isScissor = (a: string, b: string) => {
  const key = `${a}${b}`;
  const rev = `${b}${a}`;
  return scissorPairs.has(key) || scissorPairs.has(rev);
};

export type StrokeMetrics = {
  bigram: {
    sfb: number;
    scissors: number;
  };
  trigram: {
    sfb: number;
    sft: number;
    alt: number;
    altSfs: number;
    rollIn: number;
    rollOut: number;
    oneHandIn: number;
    oneHandOut: number;
    redirect: number;
    redirectSfs: number;
  };
};

function assertValidStrokeKeys(keys: string[]) {
  for (const key of keys) {
    if (!allowedStrokeKeys.has(key)) {
      throw new Error(`Unsupported stroke key: ${key}`);
    }
  }
}

function createEmptyStrokeMetrics(): StrokeMetrics {
  return {
    bigram: {
      sfb: 0,
      scissors: 0,
    },
    trigram: {
      sfb: 0,
      sft: 0,
      alt: 0,
      altSfs: 0,
      rollIn: 0,
      rollOut: 0,
      oneHandIn: 0,
      oneHandOut: 0,
      redirect: 0,
      redirectSfs: 0,
    },
  };
}

function validBigram(a: string, b: string) {
  return a !== b && fingerMap[a] && fingerMap[b];
}

function handOf(key: string): "L" | "R" | null {
  const finger = fingerMap[key];
  if (!finger) return null;
  return finger.startsWith("L") ? "L" : "R";
}

function colOf(key: string): number | null {
  const pos = rowColMap[key];
  return pos ? pos.col : null;
}

function directionOf(hand: "L" | "R", from: number, to: number) {
  if (from === to) return null;
  if (hand === "L") return to > from ? "in" : "out";
  return to < from ? "in" : "out";
}

function computeStrokeBigramMetrics(keys: string[]): StrokeMetrics["bigram"] {
  let bigramTotal = 0;
  let sfbCount = 0;
  let scissorCount = 0;

  for (let i = 0; i < keys.length - 1; i += 1) {
    const a = keys[i];
    const b = keys[i + 1];
    if (validBigram(a, b)) {
      bigramTotal += 1;
      if (fingerMap[a] === fingerMap[b]) sfbCount += 1;
      if (isScissor(a, b)) scissorCount += 1;
    }
  }

  if (!bigramTotal) {
    return createEmptyStrokeMetrics().bigram;
  }

  return {
    sfb: sfbCount / bigramTotal,
    scissors: scissorCount / bigramTotal,
  };
}

function computeStrokeTrigramMetrics(keys: string[]): StrokeMetrics["trigram"] {
  let trigramTotal = 0;
  let trigramSfbCount = 0;
  let trigramSftCount = 0;
  let altCount = 0;
  let altSfsCount = 0;
  let rollInCount = 0;
  let rollOutCount = 0;
  let oneHandInCount = 0;
  let oneHandOutCount = 0;
  let redirectCount = 0;
  let redirectSfsCount = 0;

  for (let i = 0; i < keys.length - 2; i += 1) {
    const a = keys[i];
    const b = keys[i + 1];
    const c = keys[i + 2];

    const first = {
      finger: fingerMap[a],
      hand: handOf(a),
      col: colOf(a),
    };
    const second = {
      finger: fingerMap[b],
      hand: handOf(b),
      col: colOf(b),
    };
    const third = {
      finger: fingerMap[c],
      hand: handOf(c),
      col: colOf(c),
    };

    // TODO:
    if (!first.hand || !second.hand || !third.hand) continue;
    if (first.col === null || second.col === null || third.col === null)
      continue;

    trigramTotal++;

    if (first.finger === second.finger || second.finger === third.finger) {
      // 1. 同指連続がある
      if (first.finger === second.finger && second.finger === third.finger) {
        trigramSftCount++;
      } else {
        trigramSfbCount++;
      }
    } else if (first.hand !== second.hand && second.hand !== third.hand) {
      // 2. 交互打鍵
      if (first.finger === third.finger) {
        altSfsCount++;
      } else {
        altCount++;
      }
    } else if (first.hand !== second.hand || second.hand !== third.hand) {
      // 3. ロール打鍵（1+2打鍵または2+1打鍵）
      const direction =
        first.hand === second.hand
          ? directionOf(first.hand, first.col, second.col)
          : directionOf(second.hand, second.col, third.col);
      if (direction) {
        if (direction === "in") {
          rollInCount++;
        } else {
          rollOutCount++;
        }
      }
    } else {
      const direction1 = directionOf(first.hand, first.col, second.col);
      const direction2 = directionOf(first.hand, second.col, third.col);
      assert.ok(direction1);
      assert.ok(direction2);
      if (direction1 === direction2) {
        // 4. 片手同一方向の打鍵
        if (direction1 === "in") {
          oneHandInCount++;
        } else {
          oneHandOutCount++;
        }
      } else {
        // 5. 折り返し打鍵
        if (first.finger === third.finger) {
          redirectSfsCount++;
        } else {
          redirectCount++;
        }
      }
    }
  }

  if (trigramTotal) {
    return {
      sfb: trigramSfbCount / trigramTotal,
      sft: trigramSftCount / trigramTotal,
      alt: altCount / trigramTotal,
      altSfs: altSfsCount / trigramTotal,
      rollIn: rollInCount / trigramTotal,
      rollOut: rollOutCount / trigramTotal,
      oneHandIn: oneHandInCount / trigramTotal,
      oneHandOut: oneHandOutCount / trigramTotal,
      redirect: redirectCount / trigramTotal,
      redirectSfs: redirectSfsCount / trigramTotal,
    };
  }
  return createEmptyStrokeMetrics().trigram;
}

export function computeStrokeMetrics(strokes: string): StrokeMetrics {
  const keys = Array.from(strokes);
  assertValidStrokeKeys(keys);
  return {
    bigram: computeStrokeBigramMetrics(keys),
    trigram: computeStrokeTrigramMetrics(keys),
  };
}
