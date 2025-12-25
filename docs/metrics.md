# 指標について

## 指標一覧

以下の指標を計算します。

- 1-gram
  - efficiency: 打鍵効率。打鍵回数 / 文字数。
- 2-gram
  - Same Finger Bigrams: 同じ指が連続する割合
  - Scissors: 特定のペアが現れる割合
- 3-gram
  - SFB: 同じ指が連続している
    - sfb: 2連続
    - sft: 同じ指が3連続
  - ALT: 交互打鍵
    - alt: skipgramなし
    - alt-sfs: 交互打鍵で、skipgramがある
  - ROLL:
    - roll-in: 内ロール
    - roll-out: 外ロール
  - ONEHAND: 片手同一方向の打鍵（横方向のみ考慮する）
    - onehand-in: 内ロール
    - onehand-out: 外ロール
  - REDIRECT: 片手の折り返し打鍵
    - redirect: 折り返し打鍵で、skipgramがない
    - redirect-sfs: 折り返し打鍵で、skipgramがある

## 1-gramの指標

### 打鍵効率

1かなを入力するのに必要な打鍵回数（打鍵回数 / 文字数）です。

## 2-gramの指標

### Same Finger Bigrams

### Scissors

特定のキーのペアが出現する割合です。

## 3-gramの指標

3-gramの分類は、メインカテゴリはSFB、ALT、ROLL、ONEHAND、REDIRECTの5つで、その中にサブカテゴリがあります。

漏れと重複がなく、足して100%になるような分類です。

### SFB

3打鍵のうち、2打鍵以上が同指連続になるもの。

サブカテゴリ

- `sfb`: 2打鍵が同指連続になるもの
- `sft`: 3打鍵が同指連続になるもの

### ALT

3打鍵が交互打鍵になるもの。

サブカテゴリ

- `alt`: 同じ指を使わないもの
- `alt-sfs`: 同じ指を使う（skipgramがある）もの

### ROLL

片方の手:もう一方の手=2打鍵:1打鍵になるもの。

サブカテゴリ

- `roll-in`: 2打鍵が内方向になるもの
- `roll-out`: 2打鍵が外方向になるもの

### ONEHAND

3打鍵を片方の手で打ち、かつ横に1方向なもの。

サブカテゴリ

- `onehand-in`: 3打鍵が内方向になるもの
- `onehand-out`: 3打鍵が外方向になるもの

### REDIRECT

3打鍵を片方の手でうち、かつ横方向に折り返すもの。

サブカテゴリ

- `redirect`: 同じ指を使わないもの
- `redirect-sfs`: 同じ指を使う（skipgram）があるもの

### In:out roll

内ロールと外ロールの比率です。比率が高いほど、内ロールが多いです。

`((roll-in) + (onehand-in)) / ((roll-out) + (onehand-out))`で計算します。
