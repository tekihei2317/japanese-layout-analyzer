import { createStrokeStepper } from "./stroke-to-kana";
import { collectKeys, RomanTable } from "./roman-table";

export type StepState = { buffer: string; matchedIndex: number | null };

const initialState: StepState = { buffer: "", matchedIndex: null };

export const normalizeText = (text: string) => {
  const chars = Array.from(text);
  return chars.filter((ch) => /[ぁ-ゖー、。・ゔ]/.test(ch)).join("");
};

export type Prev = { prevKey: string | null; from: string | null };

export type Node = { pos: number; state: StepState };

const nodeKey = (node: Node) =>
  `${node.pos}:${node.state.buffer}:${node.state.matchedIndex ?? "none"}`;

export type KeystrokeResult =
  | { ok: true; strokes: string }
  | {
      ok: false;
      farthestPos: number;
      partialStrokes: string;
      state: StepState;
      reason: "no-path";
    };

const buildStrokePath = (endKey: string, prev: Map<string, Prev>) => {
  const path: string[] = [];
  let k = endKey;
  while (true) {
    const p = prev.get(k);
    if (!p || p.prevKey === null || p.from === null) break;
    path.push(p.prevKey);
    k = p.from;
  }
  return path.reverse().join("");
};

/**
 * Find the shortest keystroke sequence that yields the given hiragana string.
 * BFS over (position, IME state) using the stateless stepper.
 */
export const findShortestKeystrokes = (
  rules: RomanTable,
  target: string
): string | null => {
  const result = findShortestKeystrokesDetailed(rules, target);
  return result.ok ? result.strokes : null;
};

export const findShortestKeystrokesDetailed = (
  rules: RomanTable,
  target: string
): KeystrokeResult => {
  // const fastStep = makeFastStepper(rules);
  const fastStep = createStrokeStepper(rules);
  const keys = collectKeys(rules);
  const start: Node = { pos: 0, state: initialState };
  const q: Node[] = [start];
  const visited = new Set<string>([nodeKey(start)]);
  const prev = new Map<string, Prev>();
  let head = 0;
  let bestNode = start;
  let bestKey = nodeKey(start);

  const isAccept = (n: Node) =>
    n.pos === target.length &&
    n.state.buffer === "" &&
    n.state.matchedIndex === null;

  while (head < q.length) {
    const cur = q[head];
    head += 1;
    if (cur.pos > bestNode.pos) {
      bestNode = cur;
      bestKey = nodeKey(cur);
    }
    if (isAccept(cur)) {
      return { ok: true, strokes: buildStrokePath(nodeKey(cur), prev) };
    }

    for (const key of keys) {
      const res = fastStep({ state: cur.state, key });
      let newPos = cur.pos;
      if (res.output !== null) {
        const out = res.output;
        if (!target.startsWith(out, cur.pos)) continue;
        newPos += out.length;
        if (newPos > target.length) continue;
      }
      const nextNode: Node = { pos: newPos, state: res.state };
      const nk = nodeKey(nextNode);
      if (visited.has(nk)) continue;
      visited.add(nk);
      prev.set(nk, { prevKey: key, from: nodeKey(cur) });
      q.push(nextNode);
      if (newPos > bestNode.pos) {
        bestNode = nextNode;
        bestKey = nk;
      }

      // バッファーに入っている文字が文末に一致している場合、0打鍵で確定できるものとする
      // TODO: ブリ中トロ配列や月見草配列の句読点など、バッファを確定しないと打てない場合に対応する
      const buffer = res.state.buffer;
      if (
        buffer !== "" &&
        newPos + buffer.length === target.length &&
        target.slice(newPos) === buffer
      ) {
        newPos += buffer.length;
        const nextNode: Node = {
          pos: newPos,
          state: { buffer: "", matchedIndex: null },
        };
        const nk = nodeKey(nextNode);
        if (visited.has(nk)) continue;
        visited.add(nk);
        prev.set(nk, { prevKey: key, from: nodeKey(cur) });
        q.push(nextNode);
        if (newPos > bestNode.pos) {
          bestNode = nextNode;
          bestKey = nk;
        }
      }
    }
  }

  return {
    ok: false,
    farthestPos: bestNode.pos,
    partialStrokes: buildStrokePath(bestKey, prev),
    state: bestNode.state,
    reason: "no-path",
  };
};
