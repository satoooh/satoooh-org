---
title: "再帰的な品質向上プロンプトと、その実験"
description: "fladdict 先生の ChatGPT に再帰的に品質向上させるプロンプトを試してみたメモ"
pubDatetime: 2023-03-22
modDatetime: 2023-03-22
author: "satoooh"
slug: "chatgpt-recursive-quality-enhancement"
featured: false
draft: false
tags:
  - "ChatGPT"
  - "LLM"
  - "やってみた"
ogImage: "/assets/chatgpt-recursive-quality-enhancement_1.webp"
---

note のエラい人で、僕が勝手に尊敬してやまない @fladdict 先生がツイートしていた、ChatGPT に再帰的に品質向上させるプロンプト。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">GPT4内のプログラム、地味に特許とろうと温めてたけど、間に合わなさそうなのでもう出しちゃお。<br><br>以下みたいに書くと、雑なプロンプトでも勝手に高品質になる。 <a href="https://t.co/6drQpUbKEl">pic.twitter.com/6drQpUbKEl</a></p>&mdash; 深津 貴之 / THE GUILD (@fladdict) <a href="https://twitter.com/fladdict/status/1637346314165035008?ref_src=twsrc%5Etfw">March 19, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<details>
<summary>ツイートの内容(上の埋め込みがうまく表示されない場合用)</summary>

> GPT4内のプログラム、地味に特許とろうと温めてたけど、間に合わなさそうなのでもう出しちゃお。
> 以下みたいに書くと、雑なプロンプトでも勝手に高品質になる。
> ![image](/assets/fladdict_tweet_1.png) ![image](/assets/fladdict_tweet_2.png) > _(https://x.com/fladdict/status/1637346314165035008)_

</details>

もちろん ChatGPT の出力は「返答としてもっともらしい表現」を逐次的に生成しているだけなので、再帰的に処理をしているわけではないのだが、仮想的にでもこれが出来てしまえば「実際に処理をしているかどうか」は些細な問題であって。

ということで、興味深かったのでこれを自分なりに試しながらテンプレートとしてまとめ直しました。

プロンプトのテンプレート:

```python
以下の擬似コードで書かれたプログラムを言語的に実行し、再帰的に品質を上げつつ文章を生成しなさい。
必ず常体で出力し、出力には擬似コードからの出力以外を含めないこと。

def create_text(THEME):
  text = generate_text(THEME)
  review = review_text(text)
  while True:
    text = update_text_based_on_review(text, review)
    review = review_text(text)
    update_count += 1
    print(f"count: {update_count}")
    print(f"text: {text}")
    print(f"review: {review}")

THEME =

update_count = 0
create_text(THEME)
```

このプロンプトには使って分かった凄さがあります。
それは、ループの出力をしている途中で、<u>**自分の好きなように自然言語でアラインメント出来る**</u>という点です。まるで人間と壁打ちしているような気分。

ここからはいくつか実際に GPT-4 と行った具体例を紹介します。

## 実際に品質を向上させる実験

![gpt-4-screenshot](/assets/chatgpt-recursive-quality-enhancement_2.webp)

今回取り扱うテーマは「GPT-4を使ったバックオフィスの業務効率化ツールを作成したケーススタディ研究のAbstract」です。即興で考えたのですが、Abstract になりそうな感じで10回ほどループを回しながら様子を見てみましょう。

![gpt-4-screenshot](/assets/chatgpt-recursive-quality-enhancement_3.webp)

`count:1` では Abstract から程遠い文章でしたが、少しずつ肉付けをして改善している様子が分かります。

![gpt-4-screenshot](/assets/chatgpt-recursive-quality-enhancement_4.webp)

なんだかそれっぽい文章ができましたね。ここでこちらからコメントを入れてみます。

![gpt-4-screenshot](/assets/chatgpt-recursive-quality-enhancement_5.webp)

と。このように、ある程度コメントの内容を反映しつつ処理の続きを出力してくれました。人間、最初から仕様を完璧に記述して支持を出すのは難しいので、このように途中で要望や方向性を追加して修正できるのはすごいと思います。まさに human-in-the-loop 的。

![gpt-4-screenshot](/assets/chatgpt-recursive-quality-enhancement_6.webp)
_network error で生成に失敗することが多く、何度か regenerate してます_

内容についても、その場で考えたネタを入れてみるようアドバイスしてみると、しっかり次のステップでは盛り込んだテキストを生成してもらうことができます。

![gpt-4-screenshot](/assets/chatgpt-recursive-quality-enhancement_7.webp)

このあたりで気づいたんですが、ですます調をなんとか直したいですね。形式的な微調整をしてもらいながらループを回していきます。

![gpt-4-screenshot](/assets/chatgpt-recursive-quality-enhancement_8.webp)
_常体が伝わらない_

![gpt-4-screenshot](/assets/chatgpt-recursive-quality-enhancement_9.webp)

![gpt-4-screenshot](/assets/chatgpt-recursive-quality-enhancement_10.webp)

一応直った。が、まだまだ自然で論理的な表現に直したい。

![gpt-4-screenshot](/assets/chatgpt-recursive-quality-enhancement_11.webp)

お、いい感じ。

![gpt-4-screenshot](/assets/chatgpt-recursive-quality-enhancement_12.webp)

だいぶ仕上がってきたので、あとはこれをベースに人間が改善するとして、そろそろ終わりましょう。

![gpt-4-screenshot](/assets/chatgpt-recursive-quality-enhancement_13.webp)

かなりそれっぽくなりましたね！

結局、「GPT-4を使ったバックオフィスの業務効率化ツールを作成したケーススタディ研究のAbstract」というテーマから次の文章が生成されました。

> 本研究では、GPT-4を活用したバックオフィス業務効率化ツールの開発について述べる。近年のAI技術の進化に伴い、業務効率化を目指す取り組みが盛んに行われている。本研究では、GPT-4技術を用いてバックオフィス業務の効率化を図るツールを開発することを目的とする。提案手法では、GPT-4の自然言語処理能力を活用し、見積書や求人票の自動生成、会議議事録作成、顧客からのメール自動応答などのタスクに適用した。具体例として、見積書生成ではテンプレートに基づいて顧客情報やプロジェクト詳細を自動入力し、人材適正度評価では応募者の経験やスキルを自動抽出して評価指標を算出した。これらの業務プロセスにGPT-4を組み込むことで、効率化が達成された。結果として、見積書作成時間が30％削減され、人材適正度評価精度が10％向上するなど、作業時間の短縮やコスト削減が確認された。また、従業員の負担軽減やエラー率の低下も達成された。本研究で得られた知見は、他の業務効率化ツールとの比較やGPT-4の適用範囲の拡大に役立つことが期待される。今後の研究では、さらなる業務効率化やツールの適用範囲の拡大を目指すとともに、GPT-4の限界や課題についても検討していく予定だ。

ふむふむ。細かい論理性などは人力 & 他のプロンプトで調整するとして、まぁそれらしいひな形が出来上がる様子を見ることが出来ましたね。

ちなみに、ループ処理を回し続けると最終的にどのような出力に収束するのでしょう…？制限の関係で実際にループ処理を回し続けることは難しいですが、ここまでのやりとりをふまえて、仮想的に count: 100 まで回したときの出力はどうなりそうかを出力してもらいましょう。

![gpt-4-screenshot](/assets/chatgpt-recursive-quality-enhancement_14.webp)
_ちょうどこれで制限に引っかかったので、ほぼ出力して network error となったこいつを今回の実験の最終出力とします。_

> 本研究では、GPT-4を活用したバックオフィス業務効率化ツールの開発を検討し、その効果を評価する。近年、AI技術の進化により、業務効率化への期待が高まっている。そこで、GPT-4の自然言語処理能力を用いて、見積書や求人票の自動生成、会議議事録作成、顧客からのメール自動応答といったバックオフィス業務の効率化を実現するツールを開発した。具体的な実施例として、見積書生成ではテンプレートに基づいて顧客情報やプロジェクト詳細を自動入力し、人材適正度評価では応募者の経験やスキルを自動抽出して評価指標を算出した。これらの業務プロセスへのGPT-4の導入により、効率化が達成され、見積書作成時間の30％削減や人材適正度評価精度の10％向上など、作業時間の短縮とコスト削減が実現された。また、従業員の負担軽減やエラー率の低下も確認された。本研究で得られた知見は、他の業務効率化ツールとの比較やGPT-4の適用範囲の拡大に貢献するものと期待される。今後の研究では、さらなる業務効率化やツールの適用範囲の拡大を検討するとともに、GPT-4の限界や課題にも焦点を当てて取り組む予定である。

だいぶ良いのではないでしょうか！ほぼ無からここまで作れたのはすごいですね。ChatGPTと共同で作った感じもしますし、適宜コメントでアラインメントすることで内容のオリジナリティも含めることが出来ると思います。

次の実験では、「品質を向上」させるではなく、再帰的に「〜〜度合い」を向上させるプロンプトに改善して実験してみたいですね。
