import assert from "node:assert";
import { Keystroke, toKeystrokes, Finger } from "./keystroke";

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

export type HandLoad = { left: number; right: number };

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

function directionOf(hand: "L" | "R", from: Finger, to: Finger): "in" | "out" {
  assert.ok(from !== to);
  if (hand === "L") return to > from ? "in" : "out";
  return to < from ? "in" : "out";
}

function computeStrokeBigramMetrics(
  keystrokes: Keystroke[]
): StrokeMetrics["bigram"] {
  let bigramTotal = 0;
  let sfbCount = 0;
  let scissorCount = 0;

  for (let i = 0; i < keystrokes.length - 1; i += 1) {
    const a = keystrokes[i];
    const b = keystrokes[i + 1];
    bigramTotal += 1;
    if (a.finger === b.finger) sfbCount += 1;
    if (isScissor(a.key, b.key)) scissorCount += 1;
  }

  if (!bigramTotal) {
    return createEmptyStrokeMetrics().bigram;
  }

  return {
    sfb: sfbCount / bigramTotal,
    scissors: scissorCount / bigramTotal,
  };
}

function computeStrokeTrigramMetrics(
  keystrokes: Keystroke[]
): StrokeMetrics["trigram"] {
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

  for (let i = 0; i < keystrokes.length - 2; i += 1) {
    const a = keystrokes[i];
    const b = keystrokes[i + 1];
    const c = keystrokes[i + 2];

    trigramTotal++;

    if (a.finger === b.finger || b.finger === c.finger) {
      // 1. 同指連続がある
      if (a.finger === b.finger && b.finger === c.finger) {
        trigramSftCount++;
      } else {
        trigramSfbCount++;
      }
    } else if (a.hand !== b.hand && b.hand !== c.hand) {
      // 2. 交互打鍵
      if (a.finger === c.finger) {
        altSfsCount++;
      } else {
        altCount++;
      }
    } else if (a.hand !== b.hand || b.hand !== c.hand) {
      // 3. ロール打鍵（1+2打鍵または2+1打鍵）
      const direction =
        a.hand === b.hand
          ? directionOf(a.hand, a.finger, b.finger)
          : directionOf(b.hand, b.finger, c.finger);
      if (direction) {
        if (direction === "in") {
          rollInCount++;
        } else {
          rollOutCount++;
        }
      }
    } else {
      const direction1 = directionOf(a.hand, a.finger, b.finger);
      const direction2 = directionOf(a.hand, b.finger, c.finger);
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
        if (a.finger === c.finger) {
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
  const keystrokes = toKeystrokes(keys);

  return {
    bigram: computeStrokeBigramMetrics(keystrokes),
    trigram: computeStrokeTrigramMetrics(keystrokes),
  };
}

export function computeHandLoad(strokes: string): HandLoad {
  const keys = Array.from(strokes);
  const keystrokes = toKeystrokes(keys);
  let leftCount = 0;
  let rightCount = 0;
  for (const stroke of keystrokes) {
    if (stroke.hand === "L") {
      leftCount += 1;
    } else {
      rightCount += 1;
    }
  }
  const denom = keys.length || 1;
  return {
    left: leftCount / denom,
    right: rightCount / denom,
  };
}
