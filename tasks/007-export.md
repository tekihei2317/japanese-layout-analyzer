# 指標のエクスポートと繋ぎ込み

コーパス x 配列に対する指標をJSONファイルでエクスポートするコマンドを作ります。

できたら、テーブル画面とトップページに繋ぎ込みます。先にテーブル画面を作った方がデザインを考えずに進められるのでいいかも。

## タスク一覧

- [x] テーブル画面に表示するデータを決める
  - 配列名、1-gramのデータ、2-gramのデータ、3-gramのデータ、追加指標みたいな感じにする
  - 追加指標は、今はカテゴリを跨いでいるSFSs（`redirect-sfs`+`alternate-sfs`）はあったほうがいいかも。随時足していこう。
- デザイン修正
- [x] テーブル画面に繋ぎ込む
- [x] ソート機能を実装する
- [x] 解析に使うサンプルを用意する
  - [x] 日本国憲法前文
  - [x] めくらぶどうと虹
  - [x] 羅生門
  - [x] 緋のエチュード
- [x] `jla export`コマンドを実装する
- [ ] 配列ごとに、正しく変換できることを確認する
  - ローマ字は多分できると思うけど、それ以外は色々詰まると思う
- [ ] トップページに繋ぎ込む
  - 必要なデータを整理して、CLIを修正する

## 配列ごとのチェック

ストロークの変換で詰まるところがあると思うので、一つずつ実行してみます。

間違った配列のIDを指定したときにクラッシュするので直さないと。引数のバリデーションとかやってないのかな。

- [x] qwerty
- [x] oonisi
- [x] tsuki-2-263
- [x] hana
- [x] buna
- [x] mizunara
- [x] yukika
- [x] fumiduki
- [x] hideduki_v4.1
- [ ] hybrid-tsuki
- [ ] tukiringo
- tsukimisou
- burichutoro-20221015


```bash
bun run cli stroke data/texts/mekurabudou.txt qwerty
bun run cli stroke data/texts/mekurabudou.txt oonisi
```

```bash
bun run cli export --corpus mekurabudou --layout qwerty
```

## 探索と指標の計算のリファクタリング

## メモ

文章はどうやって準備しようかな。

小説は、青空文庫で入手できる。漢字かな変換できるサイトがありそうなのでそれを使おう。

- [めくらぶどうと虹](https://www.aozora.gr.jp/cards/000081/files/1077.html)
- [芥川龍之介 羅生門](https://www.aozora.gr.jp/cards/000879/files/127_15260.html)
- [日本国憲法](https://www.shugiin.go.jp/internet/itdb_annai.nsf/html/statics/shiryo/dl-constitution.htm#zen)
- [アーサー・コナン・ドイル　Arthur Conan Doyle 大久保ゆう訳 緋のエチュード A STUDY IN SCARLET](https://www.aozora.gr.jp/cards/000009/files/55881_50044.html)


[漢字カナ変換・rubyタグ（ruby要素）マークアップ【LSツール】WEB制作・運用・サポートの道具箱](https://www.lsx.jp/converter/kana/)

めくらぶどうは`（読み）`を削除してからサイトで変換。

羅生門は、

揉烏帽子 -> 揉えぼし

に変換されてしまう。これはcodexに丸投げして`scripts/convert-text-to-hiragana.ts`を作ってやってもらった。

日本国憲法前文は手動で、現代仮名遣いにしつつ変換しました。

緋のエチュードは、挿絵1~24と、［.+］を削除してから、サイトで変換。

---

配列を追加する場合と、コーパスを追加する場合があることを考えると、JSONファイルは(配列名,コーパス)の組み合わせごとに作った方がいいかもしれない。

↑これは配列を追加した場合はJSONを読み込んで新しい配列をpushしたらいいので、別に大丈夫そうだ。
