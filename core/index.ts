export {
  createStrokeProcessor,
  createStrokeProcessorForLayout,
  getRomanTable,
  type LayoutId,
  type RomanTable,
  processStroke,
} from "./roman-table";

export { normalizeText, findShortestKeystrokes } from "./kana-to-stroke";

export type { Rule, StepState, StepResult, Node, Prev } from "./stroke-types";

export { computeMetrics } from "./metrics";
