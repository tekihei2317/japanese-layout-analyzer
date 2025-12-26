import { makeFastStepper } from "./stroke-to-kana";
import type { Rule, StepState } from "./stroke-types";

const initialState: StepState = { buffer: "", matchedIndex: null };

export const normalizeText = (text: string) => {
  const chars = Array.from(text);
  return chars.filter((ch) => /[ぁ-ゖー、。・ゔ]/.test(ch)).join("");
};

const jisKeyboardKeys = "1234567890-^¥qwertyuiop@[asdfghjkl;:]zxcvbnm,./_";
const tsukiringoException = "\\";
const validKeys = new Set((jisKeyboardKeys + tsukiringoException).split(""));

export const collectKeys = (rules: Rule[]) => {
  const keys = new Set<string>();
  rules.forEach((rule) => {
    for (const ch of rule.input) {
      if (validKeys.has(ch)) {
        keys.add(ch);
      }
    }
  });
  return Array.from(keys);
};

export type Prev = { prevKey: string | null; from: string | null };

export type Node = { pos: number; state: StepState };

const nodeKey = (node: Node) =>
  `${node.pos}:${node.state.buffer}:${node.state.matchedIndex ?? "none"}`;

/**
 * Find the shortest keystroke sequence that yields the given hiragana string.
 * BFS over (position, IME state) using the stateless stepper.
 */
export const findShortestKeystrokes = (
  rules: Rule[],
  target: string
): string | null => {
  const fastStep = makeFastStepper(rules);
  const keys = collectKeys(rules);
  const start: Node = { pos: 0, state: initialState };
  const q: Node[] = [start];
  const visited = new Set<string>([nodeKey(start)]);
  const prev = new Map<string, Prev>();
  let head = 0;

  const isAccept = (n: Node) =>
    n.pos === target.length &&
    n.state.buffer === "" &&
    n.state.matchedIndex === null;

  while (head < q.length) {
    const cur = q[head];
    head += 1;
    if (isAccept(cur)) {
      const path: string[] = [];
      let k = nodeKey(cur);
      while (true) {
        const p = prev.get(k);
        if (!p || p.prevKey === null || p.from === null) break;
        path.push(p.prevKey);
        k = p.from;
      }
      return path.reverse().join("");
    }

    for (const key of keys) {
      const res = fastStep(cur.state, key);
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
      }
    }
  }

  return null;
};
