# CLI

## 目的

コーパスの作成と、配列の評価指標の計算を行う。

## コマンド一覧

### analyze

```bash
jla analyze <corpus|file> <layout> [--format <text|json>]
```

`<corpus|file>` が `.json` の場合はコーパスとして扱い、それ以外はテキストファイルとして解析する。
`--format` の既定値は `text`。

数値は JSON では 0-1 の比率、text ではパーセント表示にする。

#### 出力例（text）

```text
layout: qwerty
original:
  Alt: 21.78%
  Rol: 39.85%   (In/Out: 20.12% | 19.73%)
  One:  2.31%   (In/Out:  1.03% |  1.28%)
  Rtl: 40.74%   (In/Out: 21.65% | 19.09%)
  Red:  2.65%   (Bad:     0.37%)

  SFB:  1.23%
  SFS:  4.56%   (Red/Alt: 2.12% | 2.44%)
  Sci:  0.34%

  LH/RH: 54.42% | 45.58%
  Row: 52.0 / 31.0 / 17.0
  Col: 13.0 7.0 8.0 15.0 28.0 | 17.0 12.0 1.0 0.0 0.0
  Key:
    0.6 1.1 1.2 1.5 2.7 | 2.3 1.8 1.2 0.5 0.2
    1.3 2.1 1.6 2.0 2.4 | 2.6 1.7 1.4 0.8 0.4
    0.8 1.0 1.4 1.9 1.6 | 1.1 0.7 0.3 0.2 0.1
```

#### 出力例（json）

```json
{
  "layoutId": "qwerty",
  "corpusId": "original",
  "unit": "ratio",
  "metrics": {
    "alternates": 0.2178,
    "rolls": 0.3985,
    "rollsIn": 0.2012,
    "rollsOut": 0.1973,
    "onehands": 0.0231,
    "onehandsIn": 0.0103,
    "onehandsOut": 0.0128,
    "totalRolls": 0.4074,
    "totalRollsIn": 0.2165,
    "totalRollsOut": 0.1909,
    "redirects": 0.0265,
    "badRedirects": 0.0037,
    "sfbs": 0.0123,
    "sfss": 0.0456,
    "scissors": 0.0034,
    "sfssRedirects": 0.0212,
    "sfssAlternates": 0.0244
  },
  "distribution": {
    "handLoad": {
      "left": 0.5442,
      "right": 0.4558
    },
    "rowLoad": [0.52, 0.31, 0.17],
    "columnLoad": {
      "left": [0.13, 0.07, 0.08, 0.15, 0.28],
      "right": [0.17, 0.12, 0.01, 0.0, 0.0]
    },
    "keyLoad": [
      [0.006, 0.011, 0.012, 0.015, 0.027, 0.023, 0.018, 0.012, 0.005, 0.002],
      [0.013, 0.021, 0.016, 0.02, 0.024, 0.026, 0.017, 0.014, 0.008, 0.004],
      [0.008, 0.01, 0.014, 0.019, 0.016, 0.011, 0.007, 0.003, 0.002, 0.001]
    ]
  }
}
```

#### 略語

- Alt: Alternates
- Rol: Rolls
- One: Onehands
- Rtl: Total Rolls（Rol + One）
- Red: Redirects
- SFB: Same Finger Bigrams
- SFS: Same Finger Skipgrams
- Sci: Scissors

### layout

```bash
jla layout list
jla layout show <layout>
```

`list` は配列の一覧、`show` は配列の詳細を表示する。

### corpus

```bash
jla corpus build <file.txt>
jla corpus list
jla corpus show <corpus>
jla corpus ngram <corpus> [--n <2|3>] [--count <number>]
```

`build` はテキストからコーパスを生成する。`ngram` は指定した n-gram の頻度を表示する。

### metrics

```bash
jla sfbs <corpus> <layout> [--count <number>]
jla sfss <corpus> <layout> [--count <number>]
jla scissors <corpus> <layout> [--count <number>]
```

指定した指標の上位リストを表示する。

### export

Web UIに指標を表示するためのデータをエクスポートします。

```bash
jla export --corpus <id|file|all> --layout <id|all> [--out-dir <dir>]
```

例:

```bash
# コーパスを指定して全配列を出力
jla export --corpus aozora

# 配列を指定して全コーパスを出力
jla export --layout qwerty

# 特定の組み合わせを出力
jla export --corpus data/texts/aozora.txt --layout qwerty
```
