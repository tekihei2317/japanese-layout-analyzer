# プロジェクトのセットアップ

## タスク一覧

- [x] `bun init`
- [x] 各パッケージのpackage.jsonとtsconfigを設定する
- [x] webパッケージにAstroをインストールする
- [x] 各パッケージに検証用にコードを少し書いておく

## メモ

標準ライブラリにテストが入っているので、bunを使います。

ディレクトリ構成は次のようにします。

```
docs/ ドキュメント
tasks/ タスク一覧
layouts/ 配列の定義ファイル（ローマ字テーブル）一覧
corpora/ コーパス一覧
packages/
  web/ Webサイト
  cli/ コマンドラインツール
  core/ コアロジック
package.json
```
