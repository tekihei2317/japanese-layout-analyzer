export {
  createStrokeStepper as createStrokeProcessor,
  createStrokeStepperForLayout as createStrokeProcessorForLayout,
  getRomanTable,
  type LayoutId,
  type RomanTable,
} from "./roman-table";

export { normalizeText, findShortestKeystrokes } from "./kana-to-stroke";

export type { Rule, StepState, StepResult } from "./stroke-types";

export { computeMetrics } from "./metrics";
