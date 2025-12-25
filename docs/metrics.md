# 指標について

## 指標一覧

### 打鍵効率

1かなを入力するのに必要な打鍵回数（打鍵回数 / 文字数）です。

### SFBs (Same finger bigrams)

同指連続となるような打鍵の割合です。

### SFSs (Same finger skipgrams)

1打鍵をまたいで同指連続となるような打鍵の割合です。

### Scissors

TODO: シザーと判定する指ペア/キーの定義を決める。

### Trigram stats

3打鍵を対象とした指標です。

#### alt

3打鍵が交互打鍵になるような打鍵の割合です。

#### roll

3打鍵が、片方の手で1打鍵、もう一方の手で2打鍵で打つような場合のうち、2打鍵がロール打ちできる打鍵の割合です。

ロール打ちとは、片手同一方向への打鍵を指します。

#### 3roll

3打鍵がロール打ちできる打鍵の割合です。

#### redirect

3打鍵が折り返し打鍵になるような打鍵の割合です。

折り返し打鍵とは、片手での打鍵で、同一方向に打てないような打鍵のことです。

#### Other

その他の打鍵の割合です（TODO: どのようなケースが当てはまるか追記する）。

### In:out roll

内ロールと外ロールの比率です。比率が高いほど、内ロールが多いです。

## 追記

cminiのコードリーディングをして大体どの指標を用意すれば分かったので、まとめます。

3-gramは分類して足して100%になります。メインカテゴリはSFB、ALT、ROLL、ONEHAND、REDIRECTの5つで、その中にサブカテゴリがあります。

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
