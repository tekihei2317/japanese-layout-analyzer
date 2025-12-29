import { KeyboardRow, KeyCode, keyCodeToRow } from "./keyboard";
import { strokeKeyToCode, toKeystrokes } from "./keystroke";
import type { Finger as StrokeFinger } from "./keystroke";

type Hand = "L" | "R";

type LoadFinger =
  | "LeftPinky"
  | "LeftRing"
  | "LeftMiddle"
  | "LeftIndex"
  | "LeftThumb"
  | "RightThumb"
  | "RightIndex"
  | "RightMiddle"
  | "RightRing"
  | "RightPinky";

export type LoadMetrics = {
  /** キーごとの負荷 */
  key: Partial<Record<KeyCode, number>>;
  /** 行ごとの負荷 */
  row: Record<KeyboardRow, number>;
  /** 指ごとの負荷 */
  finger: Record<LoadFinger, number>;
  /** 手ごとの負荷 */
  hand: Record<Hand, number>;
};

const fingerNames: Record<StrokeFinger, keyof LoadMetrics["finger"]> = {
  0: "LeftPinky",
  1: "LeftRing",
  2: "LeftMiddle",
  3: "LeftIndex",
  4: "LeftThumb",
  5: "RightThumb",
  6: "RightIndex",
  7: "RightMiddle",
  8: "RightRing",
  9: "RightPinky",
};

function createEmptyLoadMetrics(): LoadMetrics {
  return {
    key: {},
    row: {
      NumberRow: 0,
      TopRow: 0,
      MiddleRow: 0,
      BottomRow: 0,
      SpaceRow: 0,
    },
    finger: {
      LeftPinky: 0,
      LeftRing: 0,
      LeftMiddle: 0,
      LeftIndex: 0,
      LeftThumb: 0,
      RightThumb: 0,
      RightIndex: 0,
      RightMiddle: 0,
      RightRing: 0,
      RightPinky: 0,
    },
    hand: {
      L: 0,
      R: 0,
    },
  };
}

export function computeLoadMetrics(strokes: string): LoadMetrics {
  const keys = Array.from(strokes);
  const keystrokes = toKeystrokes(keys);
  const metrics = createEmptyLoadMetrics();

  for (const stroke of keystrokes) {
    const code = strokeKeyToCode[stroke.key];
    if (code) {
      metrics.key[code] = (metrics.key[code] ?? 0) + 1;
      const row = keyCodeToRow[code];
      if (row) {
        metrics.row[row] += 1;
      }
    }

    const fingerName = fingerNames[stroke.finger];
    metrics.finger[fingerName] += 1;
    metrics.hand[stroke.hand] += 1;
  }

  const denom = keystrokes.length || 1;
  (Object.keys(metrics.key) as KeyCode[]).forEach((code) => {
    metrics.key[code] = (metrics.key[code] ?? 0) / denom;
  });
  (Object.keys(metrics.row) as KeyboardRow[]).forEach((row) => {
    metrics.row[row] = metrics.row[row] / denom;
  });
  (Object.keys(metrics.finger) as Array<keyof LoadMetrics["finger"]>).forEach(
    (finger) => {
      metrics.finger[finger] = metrics.finger[finger] / denom;
    }
  );
  (Object.keys(metrics.hand) as Hand[]).forEach((hand) => {
    metrics.hand[hand] = metrics.hand[hand] / denom;
  });

  return metrics;
}
