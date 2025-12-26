import type { Node, Prev, Rule, StepResult, StepState } from "./stroke-types";

const initialState: StepState = { buffer: "", matchedIndex: null };

type PrefixInfo = { exactIndex: number | null; canGrow: boolean };

export const normalizeText = (text: string) => {
  const chars = Array.from(text);
  return chars.filter((ch) => /[ぁ-ゖー、。・ゔ]/.test(ch)).join("");
};

export const makeFastStepper = (rules: Rule[]) => {
  const prefixMap = new Map<string, PrefixInfo>();

  rules.forEach((rule, index) => {
    for (let i = 1; i <= rule.input.length; i += 1) {
      const prefix = rule.input.slice(0, i);
      const info = prefixMap.get(prefix) ?? {
        exactIndex: null,
        canGrow: false,
      };
      if (i === rule.input.length && info.exactIndex === null) {
        info.exactIndex = index;
      }
      if (i < rule.input.length) {
        info.canGrow = true;
      }
      prefixMap.set(prefix, info);
    }
  });

  return (state: StepState, key: string): StepResult => {
    const input = state.buffer + key;
    const info = prefixMap.get(input);
    const tmpFixed = info?.exactIndex ?? state.matchedIndex;

    if (info?.canGrow) {
      return { state: { buffer: input, matchedIndex: tmpFixed }, output: null };
    }

    if (tmpFixed !== null) {
      const rule = rules[tmpFixed];
      const isExact = input.length === rule.input.length;
      const nextBuffer = isExact
        ? rule.nextInput ?? ""
        : (rule.nextInput ?? "") + key;
      return {
        state: { buffer: nextBuffer, matchedIndex: null },
        output: rule.output,
      };
    }

    return { state: initialState, output: null };
  };
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
