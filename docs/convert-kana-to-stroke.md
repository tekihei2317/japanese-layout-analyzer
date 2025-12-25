# かなをストロークに変換する方法

様々な指標を計算するためには、ひらがなのテキストまたはN-gramデータをストロークに変換する必要があります。

少し難しいので、整理してみましょう。

## 難しいところ

例えばローマ字入力では

しょ

を入力する方法には、syo、sho、silyoなど様々な方法があり、どの方法を優先するかを考える必要があります。この場合は最も短くなるような入力のうちどちらかを優先させればいいでしょうか。

同じようにぶり中トロ配列では、

しょ

を入力する方法に iz+l=しょ+う、i+da=し+ょう、があります。これは区切り方が違うので難しいですね。最長マッチするならizlですが、「ょう」はdaとホームポジションのアルペジオで打てるように用意されているので、そちらを使うようにもしたいです。

## 処理の概要

ひらがなのテキストファイルを指定した場合は、ローマ字テーブルを利用してストロークに変換します。

コーパスはの形式は、基本的にはモーラ単位の2-gram、3-gramのデータです。

[コーパス](./corpora.md)

なので、コーパスを指定した場合は、先にモーラに対するストロークを計算し、それを合成した文字列に対して計算します。

## テキストファイルを指定した場合

次のアルゴリズムで、ひらがなをストロークに変換し、指標を計算します。

前提

- ローマ字テーブル: input, output, next_input の3列（Google日本語入力互換）。inputはキー列、outputはかな列、next_inputは確
  定後に続けてマッチさせるキー列（通常空）。
- IMEステート: buffer（未確定プレフィックス）, matched_index（直近の完全一致ルールID）。

1. 単打ステッパー（前処理込み）

- ルールのプレフィックスをマップ化（prefix = { prefix_str -> { exact?, can_grow } }）。makeFastStepper で構築。
- step(state, key):
    - input = state.buffer + key
    - info = prefix[input]
    - tmp_fixed = info.exact or state.matched_index
    - if info.can_grow: return {buffer: input, matched: tmp_fixed, output: None}
    - if tmp_fixed exists:
        - fixed_rule = rules[tmp_fixed]
        - next_buffer = fixed_rule.next_input (または next_input+key if 過剰打鍵)
        - return {buffer: next_buffer, matched: None, output: fixed_rule.output}
    - それ以外はミス入力→バッファ初期化。

2. 最短キー列探索（BFS）

- ノード: {pos, state} （pos はターゲットかな列の何文字目まで確定したか）。
- 受理条件: pos == target.len かつ buffer="" かつ matched_index=None。
- 遷移:
    - キー集合（ルールの input / next_input に出る文字）をループ。
    - res = step(state, key)
    - if res.output != None: out = res.output
        - if target[pos..].starts_with(out): new_pos = pos + out.len
        - そうでなければ捨てる。
    - else: new_pos = pos
    - 新ノード {new_pos, res.state} をキューへ（visitedで重複排除）。
- キューから受理ノードに到達したら prev マップをたどってキー列を復元。
- オプション: キー消費なしで確定できる pending をフラッシュする処理を各ノードで行う（matched_index があり、next_input が空
  で、output がターゲット残部に一致する間、pos を進めて matched_index をクリア）。

幅優先対策

```ts
/**
 * Find the shortest keystroke sequence that yields the given hiragana string.
 * BFS over (position, IME state) using the stateless `step` function.
 */
export function findShortestKeystrokes(
  rules: Rule[],
  target: string
): string | null {
  const fastStep = makeFastStepper(rules);
  const keys = collectKeys(rules);
  const start: Node = { pos: 0, state: initialState };
  const q: Node[] = [start];
  const visited = new Set<string>([nodeKey(start)]);
  const prev = new Map<string, Prev>();

  const isAccept = (n: Node) =>
    n.pos === target.length &&
    n.state.buffer === "" &&
    n.state.matchedIndex === null;

  while (q.length) {
    const cur = q.shift()!;
    if (isAccept(cur)) {
      // Reconstruct path
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
    }
  }

  return null;
}
```

`step`のナイーブな実装

```ts
export type Rule = {
  input: string;
  output: string;
  nextInput: string;
};

export type State = {
  buffer: string;
  matchedIndex: number | null;
};

export const initialState: State = { buffer: "", matchedIndex: null };

export type StepResult = {
  state: State;
  output: string | null; // fixed output if a rule became final on this key
}

/**
 * One-keystroke step.
 * - Searches rules whose input has the current buffer as a prefix.
 * - If no candidates remain, the previously matched rule (if any) is fixed.
 */
export function step(rules: Rule[], state: State, key: string): StepResult {
  const input = state.buffer + key;
  let tmpFixedIndex = state.matchedIndex;

  const candidates: number[] = [];
  for (let i = 0; i < rules.length; i++) {
    const r = rules[i];
    if (!r.input.startsWith(input)) continue;
    if (r.input === input) {
      // fully matched; remember as the latest exact match
      tmpFixedIndex = i;
    } else {
      // still can grow; keep waiting
      candidates.push(i);
    }
  }

  // Still have candidates: keep waiting.
  if (candidates.length > 0) {
    return {
      state: { buffer: input, matchedIndex: tmpFixedIndex },
      output: null,
    };
  }

  // No candidates: if we had a fully matched rule, fix it.
  if (tmpFixedIndex !== null) {
    const fixedRule = rules[tmpFixedIndex];
    const nextBuffer =
      fixedRule.input.length === input.length
        ? fixedRule.nextInput
        : fixedRule.nextInput + key;
    return {
      state: { buffer: nextBuffer, matchedIndex: null },
      output: fixedRule.output,
    };
  }

  // Nothing matched at all (invalid key sequence).
  return {
    state: { buffer: "", matchedIndex: null },
    output: null,
  };
};
```

`step`の高速化版

```ts
function buildPrefixMap(rules: Rule[]): Map<string, PrefixInfo> {
  const mp = new Map<string, PrefixInfo>();
  rules.forEach((r, idx) => {
    const s = r.input;
    for (let i = 1; i <= s.length; i++) {
      const pre = s.slice(0, i);
      const info = mp.get(pre) ?? { exact: null, canGrow: false };
      if (i === s.length) {
        info.exact = idx;
      } else {
        info.canGrow = true;
      }
      mp.set(pre, info);
    }
  });
  return mp;
}

/**
 * Faster step function generator using a precomputed prefix map.
 */
export function makeFastStepper(rules: Rule[]) {
  const prefixMap = buildPrefixMap(rules);
  return (state: State, key: string): StepResult => {
    const input = state.buffer + key;
    const info = prefixMap.get(input);
    let tmpFixedIndex = state.matchedIndex;

    if (info && info.exact !== null) tmpFixedIndex = info.exact;

    const hasCandidates = info ? info.canGrow === true : false;

    if (hasCandidates) {
      return {
        state: { buffer: input, matchedIndex: tmpFixedIndex },
        output: null,
      };
    }

    if (tmpFixedIndex !== null) {
      const fixedRule = rules[tmpFixedIndex];
      const nextBuffer =
        fixedRule.input.length === input.length
          ? fixedRule.nextInput
          : fixedRule.nextInput + key;
      return {
        state: { buffer: nextBuffer, matchedIndex: null },
        output: fixedRule.output,
      };
    }

    return {
      state: { buffer: "", matchedIndex: null },
      output: null,
    };
  };
}
```

## コーパスを指定した場合

例外処理があって難しいので、追記する。
