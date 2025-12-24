# 指標について

## 指標一覧

### 打鍵効率

1かなを入力するのに必要な打鍵回数（打鍵回数 / 文字数）です。

### SFBs (Same finger bigrams)

同指連続となるような打鍵の割合です。

### SFSs (Same finger skipgrams)

1打鍵をまたいで同指連続となるような打鍵の割合です。

### Scissors

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

## 各分析ツールでの計算方法

### genkey

```text
$ ./genkey analyze qwerty
QWERTY
q w e r t  y u i o p [ ] \
a s d f g  h j k l ; '
z x c v b  n m , . /
Rolls (l): 19.53%
        Inward: 9.66%
        Outward: 9.87%
Rolls (r): 18.31%
        Inward: 10.69%
        Outward: 7.62%
Alternates: 26.81%
Onehands: 2.83%
Redirects: 13.36%
Finger Speed (weighted): [0.34 0.43 10.74 10.22 10.21 1.00 3.20 0.27]
Finger Speed (unweighted): [0.50 1.53 51.56 56.19 56.13 4.79 11.54 0.40]
Highest Speed (weighted): 10.74 (LM)
Highest Speed (unweighted): 56.19 (LI)
Index Usage: 21.7% 18.8%
SFBs: 5.250%
DSFBs: 9.642%
LSBs: 5.51%
Top SFBs:
        ed 0.971%       de 0.679%       ce 0.560%       ec 0.433%
        lo 0.427%       un 0.380%       tr 0.368%       rt 0.342%

Worst Bigrams:
        ec 121.931      un 62.668       ed 42.876       rt 37.855
        ol 32.229       rb 25.755       rv 21.451       um 20.087

Score: 115.58
```

- rolls
- alternates
- onehands
- redirects
- SFBs
- SFSs

### oxeylyzer

配列の文字が赤色のグラデーションで表示されて、ヒートマップになっている。

```text
$ oxeylyzer
> language english
"english"
Set language to english. Sfr: 2.74%
> analyze qwerty
qwerty
q w e r t  y u i o p
a s d f g  h j k l ;
z x c v b  n m , . /
Sfb:  6.604%
Dsfb: 11.238%
Finger Speed: 62.295
    [0.762, 1.248, 19.165, 16.881, 15.537, 2.136, 6.462, 0.103]
Scissors: 2.026%
Lsbs: 4.199%
Pinky Ring Bigrams: 1.685%

Inrolls: 20.173%
Outrolls: 16.829%
Total Rolls: 37.002%
Onehands: 2.779%

Alternates: 19.503%
Alternates (sfs): 6.828%
Total Alternates: 26.331%

Redirects: 6.022%
Redirects Sfs: 5.703%
Bad Redirects: 0.424%
Bad Redirects Sfs: 1.008%
Total Redirects: 13.158%

Bad Sfbs: 5.339%
Sft: 0.431%

Score: -6.800
```

### cmini

コードはこれかな。

[Apsu/cmini: A layout analyzer in bot form](https://github.com/Apsu/cmini)

```text
> !cmini view qwerty
QWERTY (cmini) (0 likes)
  q w e r t  y u i o p [ ] \
   a s d f g  h j k l ; '
    z x c v b  n m , . /

MT-QUOTES:
  Alt: 19.31%
  Rol: 38.43%   (In/Out: 20.62% | 17.81%)
  One:  2.31%   (In/Out:  1.03% |  1.28%)
  Rtl: 40.74%   (In/Out: 21.65% | 19.09%)
  Red:  6.07%   (Bad:     0.37%)

  SFB:  5.84%
  SFS: 12.67%   (Red/Alt: 6.68% | 5.98%)

  LH/RH: 54.42% | 45.58%
```
