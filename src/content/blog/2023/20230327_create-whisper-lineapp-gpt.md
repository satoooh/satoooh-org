---
title: "ボイスメモをWhisperで文字起こししてChatGPTで整形するLINEbotを作った"
description: "ボイスメモをWhisperで文字起こししてChatGPTで整形するLINEbotを作りました。"
pubDatetime: 2023-03-27
modDatetime: 2023-03-27
author: "satoooh"
slug: "create-whisper-lineapp-gpt"
featured: false
draft: false
tags:
  - "Whisper"
  - "ChatGPT"
  - "やってみた"
---

kensuu さんのツイート [^kensuu-tweet] をみて、「<u>**音声入力→文字起こし→ChatGPTに整形してもらって原稿化**</u>」という流れが便利だし、これってAPIつなげるだけでできそうだなと思ったので LINE bot で動くように作りました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">1: 超おもしろい記事を頭の中で書く<br>2: それをそのまま言葉で話す<br>3:音声入力でテキストにする<br>4:ChatGPTで整形してもらう<br>5:noteに貼る<br>6:細かいところを修正<br><br>ブログ書くのがめちゃくちゃ楽になってしまった。文章書くのが苦手な人でも、これならブログを毎日書けたりするのでは！</p>&mdash; けんすう - きせかえNFTの「sloth」 (@kensuu) <a href="https://twitter.com/kensuu/status/1638911266931761152?ref_src=twsrc%5Etfw">March 23, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

ソースコードは GitHub [satoooh/whisper_gpt_lineapp_server](https://github.com/satoooh/whisper_gpt_lineapp_server) に載せました。AWS Lambda へデプロイする手順までめっちゃ丁寧に書いたつもりなので、ぜひ使ってみてください。わからないことあったら教えて下さい。

## 使用した技術

FastAPI[^FastAPI]

- PythonでモダンなAPIを構築するための高速なWebフレームワーク
- 高いパフォーマンス、拡張の容易さが特徴

LINE Messaging API[^LINE-Messaging-API]

- LINEのメッセージを送受信するためのAPIで、これにより bot の開発が可能になっている
- メッセージや画像、音声などさまざまなコンテンツを送受信できる

OpenAI Whisper API

- ChatGPT を作っている OpenAI が開発した音声認識システム
- 様々な言語への対応やノイズへの強さが特徴とされる
- ChatGPT API の発表と同時期に API 利用が可能になった

OpenAI ChatGPT API (gpt-3.5-turbo)

- ChatGPT（gpt-3.5-turbo）と同等の機能が使える API

## 自分で使ってみた感想

- 歩きながらメモができて便利！（歩きながらフリック入力は危険すぎてできないので）
- プロンプトを改善しないといけない、出力がイマイチ安定しない

![LINEbotの動作](/assets/create-whisper-lineapp-gpt_1.png)
_動作デモ画像_

---

[^kensuu-tweet]: https://twitter.com/kensuu/status/1638911266931761152
[^FastAPI]: https://fastapi.tiangolo.com/
[^LINE-Messaging-API]: https://developers.line.biz/ja/docs/messaging-api/overview/
[^OpenAI-Whisper-API]: https://platform.openai.com/docs/guides/speech-to-text
[^OpenAI-ChatGPT-API]: https://platform.openai.com/docs/guides/text-generation
