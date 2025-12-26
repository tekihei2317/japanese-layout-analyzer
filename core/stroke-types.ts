export type Rule = { input: string; output: string; nextInput?: string };
export type StepState = { buffer: string; matchedIndex: number | null };
export type StepResult = { state: StepState; output: string | null };
export type Node = { pos: number; state: StepState };
export type Prev = { prevKey: string | null; from: string | null };
