import { KeyboardRow, KeyCode } from "./keyboard";

type Hand = "L" | "R";

type Finger =
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
  finger: Record<Finger, number>;
  /** 手ごとの負荷 */
  hand: Record<Hand, number>;
};
