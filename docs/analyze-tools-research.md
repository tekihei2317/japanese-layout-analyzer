# 配列分析ツールの指標の計算方法を調べる

## genkey

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

### genkeyの計算方法（コード確認）

- Alternates: trigramで `h1!=h2 && h2!=h3` の交互打鍵。3指がすべて別指のものだけを対象。`FastTrigrams` の `Alternates`。`genkey/layout.go`.
- Rolls: 3打鍵のうち2打鍵が同手でロールになるケース。中央キーの手をロール手として判定。左手は `first < second` が内ロール、右手は `first > second` が内ロール。`FastTrigrams` の左右ロール合計。`genkey/layout.go`.
- Onehands: 3打鍵すべて同手で、方向が単調 (`dir1==dir2`) の場合。`FastTrigrams` の `Onehands`。`genkey/layout.go`.
- Redirects: 3打鍵すべて同手で、方向が反転 (`dir1!=dir2`) の場合。`FastTrigrams` の `Redirects`。`genkey/layout.go`.
- SFBs: 同じ指に割り当てられたキー同士の bigram を両方向で集計。`SFBs(l, false)` を `Total` で割る。`genkey/layout.go`.
- SFSs: genkeyの `DSFBs` に相当。`SFBs(l, true)` で `Data.Skipgrams` を使う。skipgramは距離に応じて `1/2^d` で減衰し、最大距離は `MaxSkipgramSize`。`genkey/text.go`.
- Scissors: genkeyの標準出力には存在しない（LSBsは別指標）。`genkey/output.go`.

## oxeylyzer

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

### oxeylyzerの計算方法（コード確認）

- Alternates: 手の並びが L-R-L / R-L-R の trigrams。`is_alt`。SFSなら `AlternateSfs` に分類。`oxeylyzer-core/src/trigram_patterns.rs`.
- Rolls: 手が「同手2打 + 反対手1打」の並び。`is_roll` で判定し、指の方向で `Inroll/Outroll` に分岐。`oxeylyzer-core/src/trigram_patterns.rs`.
- Onehands: 3打鍵が同手で、SFT/SFB/Redirect に該当しないもの。`get_one_hand` の `Onehand`。`oxeylyzer-core/src/trigram_patterns.rs`.
- Redirects: 同手で方向が反転する trigrams。SFS/BadRedirect の派生あり。`is_redir` / `is_bad_redir`。`oxeylyzer-core/src/trigram_patterns.rs`.
- SFBs: bigram の同指連続。`bigram_percent("sfbs")` が `data.bigrams` を参照して合算。`oxeylyzer-core/src/generate.rs`.
- SFSs: skipgram の同指連続。`bigram_percent("skipgrams")` が `data.skipgrams` を参照。`skipgrams2/3` も別指標として保持。`oxeylyzer-core/src/generate.rs`.
- Scissors: 固定の scissor ペア集合に対する bigram 頻度の合算。`scissor_score`。`oxeylyzer-core/src/generate.rs` + `oxeylyzer-core/src/utility.rs`.

補足:
- trigram の分類は `layout.get_trigram_pattern` で決まる。`trigram_stats` が全 trigrams を集計。`oxeylyzer-core/src/generate.rs`.
- skipgram は 1文字飛ばし/2文字飛ばし/3文字飛ばしを `skipgrams/skipgrams2/skipgrams3` として個別集計する。`oxeylyzer-core/src/load_text.rs`.

### cmini

コードはこれかな。

[Apsu/cmini: A layout analyzer in bot form](https://github.com/Apsu/cmini)

コードリーディングしてまとめた。

[typing-keyboard-layout-wiki/docs/cminiの各種指標の計算方法を調べる.md at main · tekihei2317/typing-keyboard-layout-wiki](https://github.com/tekihei2317/typing-keyboard-layout-wiki/blob/1167579a28815e282b0678515d4c784b79c61a3c/docs/cmini%E3%81%AE%E5%90%84%E7%A8%AE%E6%8C%87%E6%A8%99%E3%81%AE%E8%A8%88%E7%AE%97%E6%96%B9%E6%B3%95%E3%82%92%E8%AA%BF%E3%81%B9%E3%82%8B.md)
