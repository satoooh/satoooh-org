---
title: "NotionとGoogleを同時検索するChrome拡張機能「Notion Enhancer for Google Search」を作った"
description: "Google検索結果のサイドバーにNotionの検索結果が表示されるやつを作りました。"
pubDatetime: 2024-06-22
author: "satoooh"
slug: "create-notion-enhancer-for-google-search-extension"
featured: false
draft: false
tags:
  - "Notion"
---

![demo](/assets/2024/notion-enhancer-for-google-search-setup.gif)

Google検索結果のサイドバーにNotionの検索結果が表示されるやつを作りました。

- chromeウェブストア: [Notion Enhancer for Google Search](https://chromewebstore.google.com/detail/notion-enhancer-for-googl/idmnlikmdlobiejklmkhapchenhmanbo)
- GitHub: [satoooh/notion-enhancer-for-google-search](https://github.com/satoooh/notion-enhancer-for-google-search)

Notion を使っている方は便利だと思うのでぜひ使ってみてください。
Notion 初心者でまだ挙動を理解しきれていないところがあるため、感想やバグ・改善点も積極的に教えていただけると嬉しいです（GitHub の Issue に書いていただけると助かります）。

NotionのDBの設計は人によって大きく異なるため、私の環境でうまく動作しても、皆さんの環境で動作するかイマイチわからないところがあります。

参考まで、私のNotionは以下のような設計で運用しています。

- 検索対象のページはすべて memos 配下にある
- コネクトは memos ページに設定している
  - インテグレーションは読み取り権限のみ
- memos 下のページ内にサブのDBがある場合、そのサブページも検索対象となる
  - memos/page_1 にDBがあり、 memos/page_1/page_a がある場合 page_a も自動で検索対象に含まれる
