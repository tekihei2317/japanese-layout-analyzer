export { getRomanTable, type LayoutId, type RomanTable } from "./roman-table";

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
