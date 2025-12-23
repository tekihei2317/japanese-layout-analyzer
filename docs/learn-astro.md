# 速習Astro

## [ディレクトリ構成 | Docs](https://docs.astro.build/ja/basics/project-structure/)

`pages`ディレクトリにAstroコンポーネントを置いて、ファイルベースルーティングができる。

この他Astroプロジェクトの慣習として、`layouts`、`components`、`styles`などのディレクトリがあるが、これは必須ではないので自由に変更して問題ない。

## ルーティングとナビゲーション

### [ページ | Docs](https://docs.astro.build/ja/basics/astro-pages/)

`pages/`ディレクトリには、`.astro`、`md`、`mdx`などを配置できる。

### [Routing | Docs](https://docs.astro.build/ja/guides/routing/#static-routes)

SSGする予定なので、SSGの部分だけを読む。

事前に全てのパラメータを決めておく必要があるので、`getStaticPath`関数をエクスポートする。

## UIの構築

### [コンポーネント | Docs](https://docs.astro.build/ja/basics/astro-components/)

Astroコンポーネントは、すべてビルド時にレンダリングされるか、サーバーサイドレンダリングされる。クライアント上でレンダリングされないことは重要。

Astroコンポーネントは、上部のコンポーネントスクリプトと、下部のコンポーネントテンプレートに分けられる。

スクリプトにはJavaScriptコードを書く。テンプレートにはHTMLなどを書く。テンプレートにはJSXのようにJavaScriptの式を書くこともできる。

propsも定義できる。propsの型は、スクリプトにTypeScriptで`Props`インターフェイスで定義できる。

slotはReactのchildrenより柔軟性がある。名前付きスロットで複数のスロットを定義したり、スロットを別のコンポーネントに渡したり。

### [Front-end frameworks | Docs](https://docs.astro.build/ja/guides/framework-components/)

React、Vue、Svelte等、様々なUIフレームワークに対応している。

UIフレームワークを使うためには、それぞれのintegrationをインストールする必要がある。React関連のパッケージも一緒にインストールしてくれた。

```bash
# integration
bunx astro add react
```

コンポーネントは、デフォルトでは静的なHTMLとしてレンダリングされる。クライアントサイドで動くようにするためには、`client:*`ディレクティブを使用する。

JavaScriptコードがクライアント側に送信されるタイミングを、ディレクティブで指定できる。

- `client:load` ロード時
- `client:idle` ？
- `client:visible` コンポーネントがスクロールして見えるようになったとき
- `client:media={QUERY}`
- `client:only={FRAMEWORK}` サーバーサイドレンダリングをスキップする場合に指定する。フレームワーク名を文字列で渡す必要がある。

## メモ

やりたいこと

- AstroファイルからReactコンポーネントを使う方法
  - ReactコンポーネントはSSGされるのか、それともクライアントで動くのか
  - →基本的にはSSGされるだけ。`client:`ディレクティブを指定するとクライアント側でも動くようになる
- JSONファイルのインポート→コンポーネントの上部（コンポーネントスクリプト）でimportすればよい
- 画像の扱い方
  - 結構複雑そうなのでまた使うときに確認する。[Images | Docs](https://docs.astro.build/en/guides/images/) 

わからなかったこと

- `.astro`ファイルのフォーマットは何を使えばいいんだろう？
- 404ページのカスタマイズもおいおいやっておきたい
