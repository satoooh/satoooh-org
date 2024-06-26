---
title: "オープンソースLLMアプリ開発フレームワーク「Dify」を触ってみる"
description: "オープンソースのLLMアプリ開発フレームワークのDifyを触ってみた感想を書きます。"
pubDatetime: 2024-05-28
modDatetime: 2024-05-28
author: "satoooh"
slug: "first-impressions-of-dify"
featured: false
draft: false
tags:
  - "日記"
  - "LLM"
---

Dify [^dify] というオープンソースの LLM アプリ開発フレームワークがあります。
「ワークフロー」機能が追加されてから話題になることが多く、ずっと気になっていたサービスでした。
今回初めて Dify を触ってみたので、その感想を書いてみます。

## Google 検索結果を要約してくれるワークフローを作成

とりあえずこの手のツールは実際に動くものを作ってみるのが一番理解に役立つと思うので、Google検索をして、その結果を要約してくれる Perplexity.ai のようなワークフローを作成してみました。

![dify_googler](/assets/2024/dify_googler.png)

ワークフローは非常に単純で、以下の4ステップから構成されています。
直感的に操作ができるため、Difyを初めて触る人や、LLMアプリ開発にあまり詳しくない人でも、これくらい単純なワークフローは10~15分程度あれば作成できると思います。

- input: ユーザーの質問を受け付ける
- GoogleSearch: SerpApi を使って `input` でGoogle検索を実行する
- LLM: 検索結果の内容をもとにユーザーの質問への回答を生成する
- 終了: ユーザーに回答を返す

作成したアプリはAPIドキュメントが自動生成されるため、それを参考に実際にリクエストを送ることも可能です。
Difyで作成したアプリケーションどうしを連携させることも簡単になっています。

![dify_googler_api_log](/assets/2024/dify_googler_api_log.png)
_POSTリクエストを送信しAPIを叩くと、その処理の履歴がダッシュボードに記録されます_

API として利用することも可能ですし、アプリを実行できる Web インターフェースも提供されています。
さらにバッチ処理も可能なので、LLMを用いた簡単な自動化は Dify を使えば簡単に実現できそうですね。

![dify_application_option](/assets/2024/dify_application_option.png)

## LLM Radio を Dify で作成

先日書いた記事 [GPT-4oを使ってWeb記事や論文をラジオ番組風に解説する](/posts/create-llm-radio-with-gpt-4o) で作成した LLM Radio を Dify で作成してみました。

![dify_llm_radio_workflow](/assets/2024/dify_llm_radio_workflow.png)

現時点で workflow に TTS を入れる方法がわからず、一旦はラジオスクリプトを生成させるところまで自動化してみました。
TTS モデルも設定できるので、きっとやり方があるはず...わかったら追記します。

JSON プロパティ抽出のところだけはコードを書きました。
このブロックでは、GPT-4o が json 形式で返すテキストをパース（必要なデータの抽出）しています。GPT-4o が返す json は、末尾にコンマが付いていることがあり、そのまま読み込もうとするとエラーを吐くため、正規表現で末尾コンマを削除する処理も入れています。

```json
{
  "key1": "value1",
  "key2": "value2" // この末尾コンマのせいでエラーが出るので、文字列置換で削除
}
```

![dify_llm_radio_output](/assets/2024/dify_llm_radio_output.png)
_左のフォームに記事のURLを入れると、それを紹介するスクリプトが生成できる。_

以下が生成したスクリプト（入力には [GPT-4oを使ってWeb記事や論文をラジオ番組風に解説する](/posts/create-llm-radio-with-gpt-4o) を与えた）

> 皆さん、おはようございます！本日も始まりました「LLM Radio」。今日は2024年5月28日、火曜日ですね。MCのサイモンです。今日も楽しく、ためになる情報をお届けしますよ！
>
> さて、今日の注目記事は「GPT-4oを使ってWeb記事や論文をラジオ番組風に解説する」という内容です。ちょっと難しそうに聞こえるかもしれませんが、心配しないでくださいね。一緒に詳しく見ていきましょう。
>
> まず、この「GPT-4o」という名前ですが、これはOpenAIが開発した最新の言語モデルのことです。このモデルを使うと、文章の要約や生成が非常に簡単になるんです。特に今回の記事では、このGPT-4oを使ってWeb記事や学術論文をラジオ番組風に解説する方法について詳しく説明しています。
>
> 具体的な手順としては、まずJina Reader APIというツールで記事のコンテンツを取得します。このAPIは、ウェブ上の記事からテキストデータを抽出してくれるんですね。次に、その抽出したテキストデータをGPT-4oに渡して要約を生成します。この要約生成が非常に強力で、長い文章でも短く分かりやすくまとめてくれるんです。
>
> そして、その要約された内容からさらにラジオ番組風のスクリプトを作成します。この部分が一番面白いところですよね。単なる要約ではなく、リスナーが楽しめるような会話調のスクリプトに仕上げるわけです。そして最後には、OpenAIのText-to-Speech APIでそのスクリプトを音声に変換します。このAPIも非常に優秀で、人間らしい自然な音声を生成してくれます。
>
> さらに、その生成された音声とBGM（バックグラウンドミュージック）を合成して最終的な音声データを作成します。これでプロフェッショナルなラジオ番組風の音声コンテンツが完成するわけですね。
>
> ここまで聞いて、「自分でもできるかな？」と思った方もいるかもしれません。でも大丈夫です。この記事では技術的な詳細やコード例も提供されているので、エンジニアや研究者だけでなく、興味がある方なら誰でも試せるようになっています。
>
> また、日本語TTSモデルの精度向上が望まれる点にも触れています。現在の技術では英語のTTSモデルが非常に高精度ですが、日本語の場合はまだまだ改善の余地があります。しかし、それでも十分実用的なレベルには達していますので、この技術を使ってみる価値は大いにあります。
>
> さて、この技術についてもう少し深掘りしてみましょう。例えば、このGPT-4oとTTS技術を使えば教育分野でも大きな可能性がありますよね。オンライン授業やリモート学習で、生徒たちがより理解しやすい形で教材内容を提供することができます。また、視覚障害者向けの情報提供にも役立つでしょう。視覚的な情報取得が難しい方々にも音声で情報を伝えることで、多くの人々に新しい知識や情報へのアクセス機会が広がります。
>
> さらに考えられる応用としては、企業内での研修資料作成なんかもありますね。社員向けの教育コンテンツをこの技術で作成すれば、多忙なビジネスマンたちも移動中などに効率よく学習することができます。また、自動化されたカスタマーサポートシステムにも応用できそうです。お客様からのお問い合わせ内容に対して、自動的に適切な回答を音声で提供することで、サポート業務の効率化にもつながります。
>
> このように、一見すると複雑そうな技術ですが、その応用範囲は非常に広く、多岐にわたりますね。今後ますます進化していくことでしょう。
>
> それでは、本日の内容を簡単におさらいしましょう。「GPT-4o」を使ってWeb記事や論文の内容をラジオ番組風に解説する方法についてご紹介しました。その具体的な手順として、Jina Reader APIでコンテンツ取得→GPT-4oで要約生成→ラジオ風スクリプト作成→Text-to-Speech APIで音声変換→BGMと合成、と進めていきました。また、日本語TTSモデルの精度向上についても触れましたね。
>
> 皆さん、本日も「LLM Radio」をお聴きいただきありがとうございました！次回もまた面白い話題をご用意していますので、お楽しみに。それではまたお会いしましょう！そしてぜひ、番組への感想やご意見もお寄せくださいね。それでは皆さん、ごきげんよう！

## 感想

一連の処理を（ほとんど）コードを書くことなく実現でき、その体験もスムーズであったのは予想外に良かったです。

現時点での Dify の感想としては、ワークフローの作成が非常に直感的で、初心者でも簡単に作成できる点が良いと思いました。
GPTs よりもカスタマイズ性も高く、かつオープンソースでセルフホストできる点が魅力です。
LLM アプリ開発がかなり身近なものになったような気がします。
LLM アプリ開発や、LLM を使った検証に興味がある方は、かなり簡単に構築できるので選択肢として検討する価値があると思います。

---

[^dify]: [Dify.AI · The Innovation Engine for Generative AI Applications](https://dify.ai/)
