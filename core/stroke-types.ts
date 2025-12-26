export type Rule = { input: string; output: string; nextInput?: string };
export type StepState = { buffer: string; matchedIndex: number | null };
export type StepResult = { state: StepState; output: string | null };
