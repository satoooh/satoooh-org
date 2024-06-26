---
title: "@next/font で初回読み込み時にフォントが適用されない"
description: "@next/font で初回読み込み時にフォントが適用されない問題について"
pubDatetime: 2023-01-13T03:00:00Z
modDatetime: 2023-01-14T03:00:00Z
author: "satoooh"
slug: "next-font-display"
featured: false
draft: false
tags:
  - "Next.js"
ogImage: "https://gyazo.com/b960ef7e491f7bf8f2210102465767d5.png"
---

Next.js 製の本サイトでは執筆時点で [M PLUS 2 (Google Fonts)](https://fonts.google.com/specimen/M+PLUS+2) という和文フォントを使用しているのですが、サイトの初回読み込み時にフォントが適用されない問題が生じていました。

和文フォントが重いことが原因として想定されるのですが、フォント読み込みで利用している @next/font が Next.js v13（2022 年 10 月リリース） で追加された比較的新しい技術で、あまりインターネット上に知見がありませんでした。

## 解決策

@next/font の FontModule で、`display: 'swap'` を指定し、 font-display をデフォルト値の optional から swap に変更。

以下の例は本サイトで利用している M PLUS 2 を使う場合です。

```js {7}
import { M_PLUS_2 } from '@next/font/google'

...

const mplus2 = M_PLUS_2({
  subsets: ['japanese'],
  display: 'swap',  // set font-display to 'swap'
})
```

## 原因

@next/font がデフォルトで `font-display: optional` を指定しているため。

## 解説

@next/font ではパフォーマンスおよびゼロ・レイアウトシフトの観点から、デフォルトで `font-display: optional` の設定になっています。
この設定では、Web フォントの読み込みに時間がかかるとき、次の読み込みまではフォールバックフォントを表示します。
和文フォントのような重いフォントだと、100ms 以上の読み込み時間がかかってしまうため、フォントが適用されなくなってしまいます。

レイアウトシフトの値は少し悪化しますが、`font-display: swap` を指定することでフォントの読み込みが完了次第反映されるようになります。

以下は[公式ドキュメント](https://nextjs.org/docs/basic-features/font-optimization#choosing-font-display)より:

> font-display lets you to control how your font is displayed while it's loading. @next/font uses font-display: optional by default. When the primary font used by @next/font does not load within 100ms, the auto generated fallback font will be displayed in the browser. While it is automatically generated to be as visually similar to the primary font as possible to reduce layout shift, it does come with the tradeoff that your intended font might not be shown on slower networks unless it's cached.
>
> If you want guarantees around your intended font always showing, and accept the tradeoff of minimal layout shift from swapping your fallback font for the primary font, you can use font-display: swap.

font-display の設定については [@next/font の公式リファレンス](https://nextjs.org/docs/api-reference/next/font)を参考にしてください。
