---
title: "ScrapboxとGoogleを同時検索するChrome拡張機能「Scrapbox Enhancer for Google Search」を作った"
description: "Google 検索結果のサイドバーに Scrapbox の検索結果が表示されるやつを作りました。"
pubDatetime: 2023-01-30T04:20:00Z
modDatetime: 2024-06-23
author: "satoooh"
slug: "create-scrapbox-chrome-extension"
featured: false
draft: false
tags:
  - "2023"
  - "scrapbox"
ogImage: "https://gyazo.com/ff42ad2596c9d5bf75d9b34ff0ef1754.png"
---

追記: 2024-06-23 chrome ウェブストアに公開しました。[Scrapbox Enhancer for Google Search - Chrome ウェブストア](https://chromewebstore.google.com/detail/scrapbox-enhancer-for-goo/fpbdlcgcacniolpniiciabdbndhmacmh)

---

GitHub: [satoooh/scrapbox-enhancer-for-google-search: a Chrome extension that displays Scrapbox search results alongside Google search results](https://github.com/satoooh/scrapbox-enhancer-for-google-search)

![demo](https://gyazo.com/5035274c522ce54ce05fe6b29b0f5d18.gif)

こんな感じで、Google 検索結果のサイドバーに Scrapbox の検索結果が表示されるやつを作りました。

> [@9Satoooh](https://twitter.com/9Satoooh/status/1619709848136081409): Google 検索すると同時に Scrapbox 内も検索してくれる Chrome 拡張作った

記事冒頭の GitHub repo [^github-repo] からソースコードをダウンロードし、お手元の Chrome ブラウザに展開してください。
Web Store への公開はめんどくさそうなので調べていません（詳しい人教えて）
まともに動作保証をしていませんので<u>**使用は自己責任で**</u>お願いします。
何かバグっぽい挙動があったら repo もしくは当記事までコメントください。

以下、特徴です。

- 複数プロジェクトを検索し、それぞれの結果を表示できる
- Private プロジェクトも検索できる

## 導入手順

- GitHub からソースコードのフォルダをダウンロード
- `chrome://extensions/` にアクセス
- 右上の「デベロッパーモード」をオンにする
- 「パッケージ化されていない拡張機能を読み込む」をクリック
- ダウンロードしたフォルダを選択

## 使い方

- 拡張機能「Scrapbox Enhancer for Google Search」のアイコン or 三点リーダをクリック
- 「オプション」をクリックして設定画面を開く
- Scrapbox のプロジェクト名と connect.sid の値を入力し、保存
- Google 検索する

![screenshot](https://gyazo.com/ff42ad2596c9d5bf75d9b34ff0ef1754.png)

connect.sid は外部から private な Scrapbox project にアクセスするときに必要な値です。
これを使って拡張機能から Scrapbox にリクエストを飛ばしてます。
ログアウトすると connect.sid の値が変わるらしいので、ログアウトした際は再設定が必要です[^connect-sid]。

## 開発経緯

そもそも今回初めて Chrome 拡張機能を作ったというのもあり、苦労したことが多かったです。
とりあえず動くものが欲しかったので、難しい技術は極力使わず、素の JavaScript で作っています。

結果的にシンプルなコードになりましたが、Chrome 拡張機能の勉強 [^start-chrome-extension-study] から含めると合計 10 時間くらい溶かしました。
CORS 回避の処理や、Options 画面の作り方、chrome.storage との値のやりとりなど、色々と勉強になりました。

### なぜ作ったのか

- 昔あった「Google・Scrapbox 同時検索」拡張機能が 2019 年頃から使えなくなっちゃって困ってた[^google-scrapbox-search-extension-1] [^google-scrapbox-search-extension-2]
- 復活の気配がなさそうだった（けど嘆いている人はちらほらいた）

当時の僕の嘆き 👇

> [@9Satoooh](https://twitter.com/9Satoooh/status/1113026161318125568): Scrapbox 同時検索の Chrome 拡張機能、いまも使えるのかこれ？なんか全くサイドバーに出てこなくなった

### 要件や実装ステップの整理

- Google 検索の検索結果ページサイドバーに、Scrapbox の検索結果を表示する
  - Scrapbox の検索結果は、プロジェクトごとに表示する
- 実装の流れを分解すると:
  - 検索クエリを取得（URL から？）
  - 検索クエリで、設定した Scrapbox project を検索[^scrapbox-search-api]
  - 検索結果を Google 検索結果のサイドバーに表示
  - スタイリングや設定 UI など

Scrapbox 使っている方は便利だと思うので、ぜひ使ってみてください。
ダメ出しや意見・感想大歓迎です。

[^github-repo]: [satoooh/scrapbox-enhancer-for-google-search](https://github.com/satoooh/scrapbox-enhancer-for-google-search) にソースコードがあります
[^connect-sid]: [connect.sid - 井戸端](https://scrapbox.io/villagepump/connect.sid) などに詳しい
[^start-chrome-extension-study]: [とほほの Chrome 拡張機能開発入門 - とほほの WWW 入門](https://www.tohoho-web.com/ex/chrome_extension.html) からはじめました
[^google-scrapbox-search-extension-1]: [Google・Scrapbox 同時検索（Chrome 拡張機能） - Scrapbox カスタマイズコレクション](https://scrapbox.io/customize/Google%E3%83%BBScrapbox%E5%90%8C%E6%99%82%E6%A4%9C%E7%B4%A2%EF%BC%88Chrome%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD%EF%BC%89)
[^google-scrapbox-search-extension-2]: [Google と Scrapbox を同時検索する Chrome 拡張 - Scrapbox 研究会](https://scrapbox.io/scrapboxlab/Google%E3%81%A8Scrapbox%E3%82%92%E5%90%8C%E6%99%82%E6%A4%9C%E7%B4%A2%E3%81%99%E3%82%8BChrome%E6%8B%A1%E5%BC%B5)
[^scrapbox-search-api]: [api/pages/:projectname/search/query - Scrapbox 研究会](https://scrapbox.io/scrapboxlab/api%2Fpages%2F:projectname%2Fsearch%2Fquery) が参考になる
