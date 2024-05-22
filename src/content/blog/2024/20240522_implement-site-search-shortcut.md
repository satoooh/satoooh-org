---
title: "スラッシュ(/)キーでブログのサイト内検索のショートカットを実装する"
description: "JavaScriptを用いて、スラッシュ(/)キーを入力するとサイト内検索が行えるショートカットを実装しました。"
pubDatetime: 2024-05-22
modDatetime: 2024-05-22
author: "satoooh"
slug: "implement-site-search-shortcut"
featured: false
draft: false
tags:
  - "やってみた"
  - "JavaScript"
---

以前 Web メディアサイトを実装した際に、参考として見ていた gori.me という Web メディアが `/` キーにサイト内検索のショートカットを実装していたのが印象的で、いつか自分でも実装してみたいと思っていました [^gori-me-search] 。

ショートカットってなんかコマンド感あってカッコいいですよね。
需要なんてほとんどないでしょうけど、自分のサイトにも実装してみたいと思います。

![image](/assets/implement-site-search-shortcut.gif)

### `/` キーを入力すると検索ページへ遷移する

```javascript
// Navigate to search page on pressing "/"
document.addEventListener("keydown", event => {
  if (event.key === "/") {
    event.preventDefault();
    window.location.href = "/search/";
  }
});
```

### `/search/` 遷移後に自動で検索フォームにフォーカスを当てる

さらに、キーボードショートカットで検索ページへ遷移する人はそもそもマウスで操作をしたくないと思うので、検索ページへ遷移したあとに自動で検索フォームにフォーカスを当てるようにしてみます。

```javascript
// Focus on search input after page load
if (window.location.pathname === "/search/") {
  window.addEventListener("load", () => {
    document.querySelector('input[name="search"]')?.focus();
  });
}
```

以上の2点の JavaScript コードを挿入することで、`/` キーによるサイト内検索ショートカットを実装することができます。

---

[^gori-me-search]: [ゴリミー、「/（スラッシュ）」キーで検索画面が表示されるように | ゴリミー](https://gori.me/blogging/119427)
