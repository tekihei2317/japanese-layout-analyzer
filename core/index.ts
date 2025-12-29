export {
  getRomanTable,
  layoutIdOrder,
  type LayoutId,
  type RomanTable,
} from "./roman-table";

export {
  createStrokeStepper as createStrokeProcessor,
  createStrokeStepperForLayout as createStrokeProcessorForLayout,
} from "./stroke-to-kana";

export {
  normalizeText,
  findShortestKeystrokes,
  findShortestKeystrokesDetailed,
} from "./kana-to-stroke";

export { computeStrokeMetrics, computeHandLoad } from "./metrics";

export { computeLoadMetrics, type LoadMetrics } from "./load-metrics";

export {
  type KeyCode,
  type KeyboardRow,
  type KeyboardLayout,
  type LayoutKeyInfo,
  rowStaggeredLayout,
  ortholinearLayout,
  keyCodeToRow,
} from "./keyboard";
