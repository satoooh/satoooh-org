---
title: "GPT-4oを使ってWeb記事や論文をラジオ番組風に解説する"
description: "GPT-4o を使って、Web記事や論文のリンクを投げると、ラジオ番組風に解説するスクリプトを書いて動かしてみたメモ。"
pubDatetime: 2024-05-19
modDatetime: 2024-05-19
author: "satoooh"
slug: "create-llm-radio-with-gpt-4o"
featured: false
draft: false
tags:
  - "やってみた"
  - "ChatGPT"
---

GPT-4o を使って、Web記事や論文のリンクを投げると、ラジオ番組風に解説するスクリプトを書いて動かしてみたメモ。
元ネタは [AIラジオ『zenncast』の技術構成（プロンプトつき）](https://zenn.dev/himara2/articles/db054d81b05d19) です。
ここに載っている技術構成を参考にしつつ、手元で GPT-4o を使って同じようなことをやってみました。

簡単な流れは以下のようになっていて、この一連の処理をコマンド1つで実行できるように実装してみました。

- 記事のリンクをいくつか指定して投げる
- [Jina Reader API](https://jina.ai/reader/) を用いてリンクから記事のコンテンツを取得
- GPT-4o に記事のコンテンツを投げて要約を生成
- いくつかの記事の要約を与え、GPT-4o にラジオ番組風のスクリプトを生成させる
- 生成されたスクリプトを OpenAI の Text-to-Speech API で音声に変換
- 音声とBGMを合成し、最終的な音声データを生成

試してみたい方は記事下にコード例を載せました。
また元ネタの著者さんが開発中のサービスで、かんたんなGUIで同じようなことができるそうなのでチェックしてみてください。

## 成果物

### 1: 5つのWeb記事を紹介するラジオ番組

コマンドを実行して、記事を5つほど投げて1分ほど待つと、こんなものができます。8分半ほどの音声データです。

<audio controls="controls">
  <source type="audio/mp3" src="/assets/20240519_llmradio-test.mp3"></source>
  <p>Your browser does not support the audio element.</p>
</audio>

与えた記事

- [Hard Evidence That Please And Thank You In Prompt Engineering Counts When Using Generative AI](https://www.forbes.com/sites/lanceeliot/2024/05/18/hard-evidence-that-please-and-thank-you-in-prompt-engineering-counts-when-using-generative-ai/)
- [Apple announces new accessibility features, including Eye Tracking - Apple](https://www.apple.com/newsroom/2024/05/apple-announces-new-accessibility-features-including-eye-tracking/)
- [【風吹けば名無し】GPT-4o が獲得した日本語の語彙を調べる](https://zenn.dev/hellorusk/articles/27684d0ed96c4c)
- [AIラジオ『zenncast』の技術構成（プロンプトつき）](https://zenn.dev/himara2/articles/db054d81b05d19)
- [MIT Tech Review: クジラの言語構造、想像以上に人間の言語に近かった](https://www.technologyreview.jp/s/335765/the-way-whales-communicate-is-closer-to-human-language-than-we-realized/)

ときどき日本語が怪しいところがあるので、スクリプトも載せておきます。

<details>
<summary>GPT-4oが生成した番組スクリプト(クリックして展開)</summary>

GPT-4oが生成した番組スクリプト

> 皆さん、おはようございます！サイモンです。今日もLLM Radioをお聴きいただきありがとうございます。
> さて、今日は2024年5月19日、日曜日ですね。
> みなさん、どんな週末をお過ごしでしょうか？
> お天気もちょうどいい感じで、まさにラジオ日和ってところですかね。
> さて、今日も忙しいあなたのために、役立つ記事をピックアップしてご紹介していきますので、どうぞお楽しみに！
>
> それでは、早速最初の記事に参ります。
> 今日最初にご紹介するのは「Impact of Politeness in Prompt Engineering for Generative AI」についてです。
> この話題は最近ますます注目されていますね。
>
> この研究では、プロンプト、すなわちAIシステムに対する指示文のトーンが、結果にどのように影響するかを調査しています。
> 具体的には、礼儀正しい（ポライト）プロンプト、ニュートラル（中立的な）プロンプト、そして失礼な（インポライト）プロンプトによって、AIがどのような反応をするかを見るわけです。
> そしてなんと、礼儀正しいプロンプトは、質の高い、かつ長い応答を引き出す可能性があることがわかりました。
> ただし、あまりにも礼儀正しすぎると必ずしもいい結果にはならないようです。
>
> また、失礼なプロンプトについてですが、これは一般的にパフォーマンスが低下する傾向があります。
> これは人間とのコミュニケーションにも似ていますよね。
> 失礼な態度では、相手から十分な情報を引き出すのが難しいというわけです。
> その一方で、今日のAIシステムはあからさまに失礼な反応をすることは少ないようにデザインされています。
>
> これらの研究成果は、特にエンジニアや研究者にとって非常に有用です。
> プロンプトのトーンを少し変えるだけで、AIとのやり取りが大きく改善される可能性があるのですからね。
> さらに文化的・言語的な違いも考慮する必要があり、具体的な実験結果や事例も豊富に紹介されています。
>
> では次に移りましょうか。次の話題は「Appleが発表した新しいアクセシビリティ機能」についてです。
> Appleはユーザーの利便性をさらに高めるため、さまざまな新機能を導入しました。
> これには、物理的な障害を持つユーザー向けの眼球トラッキング、聴覚障害者向けの音楽ハプティクス、そしてカスタム音声コマンドを使用するボーカルショートカットなどがあります。
>
> 特に注目すべき点として、AppleのiPadやiPhoneでの視線操作が可能になる「Eye Tracking」機能があります。
> これにより、障がいを持つ方々がデバイスをより自由に操作できるようになりますね。
>
> そして「Music Haptics」という機能もすごいです。
> 聴覚障害者がTaptic Engineを通じて音楽の振動を感じることができるのです。
> 音の振動を感じるなんて、まるで新しい世界が広がるようです。
>
> もう一つ、ユニークな機能として「Vocal Shortcuts」も紹介されています。
> これはカスタム音声コマンドを使って複雑なタスクをSiriによって実行するものです。
> このように、Appleの新機能は全ユーザーに向けた使いやすさを追求しています。
>
> 次は、「GPT-4oが獲得した日本語の語彙」のお話です。
> 最近公開されたGPT-4oは、日本語処理がこれまで以上に優れています。
> 特に注目すべきは、1.4倍少ないトークンで日本語を表現できる点です。
> また、「ありがとうございました」や「お問い合わせ」などの挨拶・礼儀・依頼の語彙、そして「VIP」といったネット用語、さらには「レディース」や「ランキング」などの外来語が顕著に見られます。
> 新しいトークナイザ「o200k_base」により、このような改善が実現しています。
>
> 興味深いのは、アダルト関係の用語がほとんど含まれておらず、学習コーパスからうまく取り除かれている可能性がある点です。
> これにより、よりクリーンなデータで訓練が行われ、質の高い成果が得られていますね。
>
> さて、次の話題は「AIラジオ『zenncast』の技術構成」です。
> zenncastは、毎日AIがZennのトレンド記事を要約して10分のラジオにして配信するWebサービスです。
> このサービスの技術構成をちょっと見てみましょう。
>
> まず、トレンド記事の取得から要約、スクリプト生成、音声合成の流れはCloud Functionsを使用して自動化されています。
> 毎朝7時にCloud Schedulerが起動して一連のプロセスが始まります。
> そして要約はJina Reader APIを使って行われ、800文字程度になります。
> その後、GPT-4oを使ってラジオの読み上げ原稿が生成され、最後にOpenAIのTTS APIで音声に変換されます。
>
> さらに、BGMはPydubを使って合成されます。そしてGoogleフォームからのリスナーのお便りも反映されるという仕組みです。
> 保存されたデータもFirestoreに保管され、ベクトル検索機能も利用されています。
> これだけの技術を駆使して、一エピソードあたり約1ドルというコストパフォーマンスの高さも魅力ですね。
>
> 最後にご紹介するのは、「クジラの言語構造が人間の言語に似ている」という話題です。
> MITのプラティウシャ・シャルマさんが率いる研究チームが、非営利団体プロジェクトCETIと協力して、クジラの「コーダ」と呼ばれる発声を分析しました。
> その結果、クジラの発声にはランダムでなく構造化されたパターンが存在することがわかったのです。
> これ、すごい発見ですよね。
>
> この研究は、2005年から2018年にかけて収集された8719のコーダデータを分析したもので、古典的な分析手法を使用しています。
> さらに、コーダに余分なクリック音が含まれることがわかり、クジラ同士のコミュニケーションにおいて重要な情報を伝達している可能性が示唆されています。
> 研究チームは次のステップとして、クジラの鳴き声の言語モデルの構築に取り組んでおり、これは他の動物のコミュニケーションの解明にも役立つと期待されています。
>
> いやあ、今日もいろんな記事がありましたね。それでは、今日紹介した内容をおさらいしましょう。
> まずは「プロンプトの礼儀正しさがAIの応答に与える影響」について。礼儀正しいプロンプトが質の高い応答を引き出すことがわかりましたね。
> 次に「Appleが発表した新しいアクセシビリティ機能」。眼球トラッキングや音楽ハプティクスなど、デバイス操作が一層便利になりました。
> そして、「GPT-4oが獲得した日本語の語彙」。日本語処理が大幅に改善され、より効率的に情報を処理できるようになりました。
> 続いて、「AIラジオ『zenncast』の技術構成」。毎日のトレンド記事を要約し、音声合成でラジオ番組として配信する仕組みが興味深いですね。
> 最後に、「クジラの言語構造」。人間の言語に似た構造が発見され、自然界のコミュニケーションの新しい理解へとつながっていきます。
> 今日も最後までお聞きいただき、ありがとうございました！次回もまた、面白くてためになる記事をお届けしますので、お楽しみに。
> そして、番組の感想やリクエストがありましたら、ぜひお気軽にお寄せください。
> それでは、皆さん素敵な一日をお過ごしください。サイモンでした。さようなら～。

</details>

思ったより全然聞けてびっくり。

### 2: 3つの論文を紹介するラジオ番組

ちょっとスクリプトを改良して、男女2人の会話形式にするスクリプトにし、arXiv の論文を3つほど投げてみて会話させてみました。

<audio controls="controls">
  <source type="audio/mp3" src="/assets/20240519_voyager.mp3"></source>
  <p>Your browser does not support the audio element.</p>
</audio>

与えた論文

- [[2305.16291] Voyager: An Open-Ended Embodied Agent with Large Language Models](https://arxiv.org/abs/2305.16291)
- [[2404.15676] Beyond Chain-of-Thought: A Survey of Chain-of-X Paradigms for LLMs](https://arxiv.org/abs/2404.15676)
- [[2404.15166] Pixels and Predictions: Potential of GPT-4V in Meteorological Imagery Analysis and Forecast Communication](https://arxiv.org/abs/2404.15166)

<details>
<summary>GPT-4oが生成した番組スクリプト(クリックして展開)</summary>

GPT-4oが生成した番組スクリプト

> サイモン: 皆さん、おはようございます！毎週お馴染みの『LLM Radio』が始まります。今日は2024年5月19日、日曜日ですね。私はサイモンです。そして、エリも一緒にいます。
>
> エリ: おはようございます、エリです！
>
> サイモン: いやー、天気も良くて気持ちのいい朝ですね。今日は面白い記事をいくつか紹介します。まずは『Voyager: An Open-Ended Embodied Agent with Large Language Models』、次に『Beyond Chain-of-Thought: A Survey of Chain-of-X Paradigms for LLMs』、そして最後に『Pixels and Predictions: Potential of GPT-4V in Meteorological Imagery Analysis and Forecast Communication』です。どれも興味深い内容ですので、じっくりと解説していきます！
>
> エリ: 今日はどれも技術的に高度そうな内容ですね。では、まず最初の記事からいきましょう。
>
> サイモン: はい、最初は『Voyager』です。研究者たちはMinecraft内で探索、スキル習得、新発見を人間の介入なしで自動で行う初のLLMベースのエージェントを開発しました。Voyagerと呼ばれるこのエージェントは、GPT-4とやりとりし、ブラックボックスクエリを通じてスキルを学習します。つまり、モデルのパラメータを微調整することなく動作するわけです。
>
> エリ: おもしろいですね。どうやってこれを実現しているんですか？
>
> サイモン: Voyagerには三つの主要なコンポーネントがあります。まず一つ目は、自動カリキュラムで探索を最大限に促進すること。二つ目は、複雑な行動を記憶および再利用するスキルライブラリ。そして三つ目は、環境からのフィードバックや実行エラー、自己検証を使用してプログラムを改善する新しい反復プロンプティングメカニズムです。この仕組みによって、VoyagerはMinecraft内で非常に高い長期学習能力を発揮し、他の最先端技術を大幅に上回る成果を示しています。
>
> エリ: 具体的にはどのような成果が出ているんですか？
>
> サイモン: 具体的には、他の技術と比較して3.3倍多くのユニークなアイテムを取得し、2.3倍遠くまで移動し、重要な技術ツリーマイルストーンを最大15.3倍速くアンロックするなどの成果があります。さらに、新しいMinecraftの世界でも習得したスキルライブラリを利用して新しいタスクをゼロから解決できるんです。これにより、他の技術が一般化に苦労する場面でも対応可能です。
>
> エリ: エンジニアや研究者が興味を持つポイントは何ですか？
>
> サイモン: まずは自動カリキュラム、スキルの連続的な拡張、反復的なフィードバックによるプログラムの改善、自動学習における高度な一般化能力、LLMのプランニングへの応用などが挙げられますね。
>
> エリ: これはゲームの世界だけでなく、ロボティクスなど他の分野にも応用できそうです。
>
> サイモン: はい、まさにその通りです！さて次は『Beyond Chain-of-Thought: A Survey of Chain-of-X Paradigms for LLMs』について話しましょう。この研究は、Chain-of-Thought(チェイン・オブ・ソート、CoT)手法を基に、LLMのさらなる能力を引き出すために開発された複数のChain-of-X(CoX)手法についての調査です。
>
> エリ: 具体的にはどのような手法があるんですか？
>
> サイモン: CoTは複雑な問題を一連のステップに分解することで、性能向上と透明な論理プロセスを提供します。これに基づいて、Chain-of-Feedback、Chain-of-Instructions、Chain-of-Historiesといった手法が開発されています。それぞれが異なるタスクに対応し、LLMの推論能力や計画能力を向上させることが目的です。
>
> エリ: なるほど、具体的な効果はどうなんでしょうか？
>
> サイモン: 調査によれば、CoXはマルチモーダルな相互作用、事実性、安全性、推論および計画能力の向上に効果的です。今後の研究課題として、因果分析、推論コストの削減、知識蒸留、エンドツーエンドのファインチューニングが挙げられます。これにより、CoX手法の効率と信頼性がさらに向上すると期待されています。
>
> エリ: 研究が進むことで、さまざまな応用が考えられるわけですね。さて、最後の記事に行きましょうか。
>
> サイモン: そうですね。最後は『Pixels and Predictions: Potential of GPT-4V in Meteorological Imagery Analysis and Forecast Communication』についてです。この研究は、OpenAIのGPT-4Vの能力を評価し、気象チャートの解釈や天候ハザードのコミュニケーションに役立つかどうかを検討しています。
>
> エリ: 具体的にはどんな結果が出ているんですか？
>
> サイモン: 研究によると、GPT-4Vは気象チャートの解釈や適切な天候アウトルックの生成に関して、人間の予報に近い結果を示しました。しかし、時折誤った情報を含む『幻覚』が発生することがあるんです。また、スペイン語への翻訳では直訳に近く、文化的なニュアンスを欠いているため、最適なコミュニケーションには不十分とされています。
>
> エリ: 誤った情報が発生するとなると、信頼性に課題がありそうですね。
>
> サイモン: そうですね。これらの結果から、研究では人間の監視と説明可能なAIの必要性が強調されています。GPT-4Vはツールとして有望ですが、高い一貫性と信頼性を持ったアウトプットを確保する必要があると結論づけられています。今後の研究課題としては、応答の論理的一貫性の向上、翻訳の最適化、具体的な用語の使用に焦点を当てることが挙げられています。
>
> エリ: どれも興味深い記事でしたね。それぞれ発展性もありますし、これからの研究が楽しみです。
>
> サイモン: はい、本日ご紹介した記事をおさらいします。まずは、Minecraft内での自動探索・スキル習得を行うVoyagerの話題。次に、Chain-of-Thoughtを基にしたChain-of-X手法についての調査。そして最後に、GPT-4Vの気象チャート解析の潜在能力についての研究でした。
>
> エリ: そうですね。どの記事も新しい可能性を感じさせるものでした。
>
> サイモン: それでは、また次回も楽しみにしていてくださいね！番組へのご感想やご意見もぜひお寄せください。ここまでのお相手はサイモンと...
>
> エリ: エリでした。ありがとうございました！

</details>

## 難しい点

日本語TTSモデルはまだ精度が微妙なものが多いイメージで、手っ取り早く使えるモデルで一番マトモそうだったのが OpenAI のものでした。
ただ、これも日本語ノンネイティブが話すカタコトな感じがして、少し違和感がありますね。
あとは OpenAI の TTS モデルは多言語に対応していて、リクエスト時に明示的に言語を指定することがおそらくできないため、日本語を読み上げているはずなのに突然未知の言語が出現することがあります。かなり驚きます。

![openai-create-speech](/assets/20240519_openai-create-speech.png)
_[API Reference - OpenAI API](https://platform.openai.com/docs/api-reference/audio/createSpeech?lang=python)より_

このあたりは、日本語の音声合成技術がもう少し進んでくれるといいなと思います。
何かいいモデルをご存じの方は教えていただけると嬉しいです。

[ホリエモンのこちらの動画](https://youtu.be/QpNmxx93RZQ?si=zX1AWcW_E96HFtxF)のAI音声はどうやって合成してるんでしょうかね...（もしかして声質変換だけ？）イントネーションとかけっこう自然な気がする。
軽く調べた感じだと、日本語TTSモデルだと [litagin02/Style-Bert-VITS2](https://github.com/litagin02/Style-Bert-VITS2) が出てきますが、イントネーションが自然というわけでもないんですよね。

## 技術詳細

そんなに難しい処理ではないので、技術的な詳細・コード例を以下にまとめておきます。

### step1: 記事の内容取得

[Jina Reader API](https://jina.ai/reader/) というWeb情報をLLMに与えやすい形式に変換してくれるAPIを使って、URLから記事の内容を取得します。

```python
def fetch_article_content(article_url: str) -> str:
    response = requests.get(f"https://r.jina.ai/{article_url}")
    return response.text
```

### step2: GPT-4o による要約

取得した記事を GPT-4o に投げて要約を生成します。

```python
def get_summary(article_text: str) -> dict:
    client = OpenAI()
    user_prompt = f"""
    与えられたドキュメントを、原理の理解ができ、要点を逃さない形で要約してください。
    要約は日本人のエンジニアや研究者に向けた、専門的かつわかりやすい内容であることが望ましいです。
    出力はJSON形式で、記事のタイトル title と要約 summary からなるオブジェクトを出力してください。

    {article_text}
    """
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": user_prompt}],
        response_format={"type": "json_object"},
        max_tokens=2000
    )
    summary = json.loads(response.choices[0].message.content)
    return summary
```

### step3: GPT-4o によるラジオ番組スクリプト生成

得られた要約をもとに、GPT-4o にラジオ番組風のスクリプトを生成させます。
プロンプトは元記事の内容をかなり参考にしています。

````python
def generate_script(summaries: list) -> dict:
    client = OpenAI()
    current_date = datetime.datetime.now().strftime("%Y-%m-%d")
    user_prompt = f"""
    あなたはプロの放送作家です。与えられる情報をもとに、ラジオでMCが読み上げる日本語のスクリプトを作成します。
    ラジオは楽しい雰囲気で、スピーカーは日本のFMラジオのような喋り方をします。
    ラジオのMCは2人で、「サイモン」と「エリ」です。
    サイモンは知識豊富で、気さくで陽気な人物です。口調は優しく丁寧で、フレンドリーです。サイモンが基本的に解説を行います。
    エリは真面目で、口調は落ち着いています。サイモンの話を補足したり、質問をしたりします。エリが基本的に質問を行います。
    番組名は「LLM Radio」です。この番組では、忙しい人向けに記事の内容を詳細にかつ分かりやすく紹介する情報ラジオ番組です。

    今日の日付: {current_date}

    ## 構成

    1. 最初に挨拶し、今日の日付（月、日、曜日）を添えながら、今日の注目記事を紹介することを伝えます。
    2. 「今日紹介する内容」を紹介します。複数の記事がある場合は、境目をわかりやすくします。適宜コメントを加え、聞き手がより論理的に理解しやすいようにします。
    3. 「今日紹介する内容」からより発展させられそうな点を具体的に提示します。具体的な内容に着目し、独創的で建設的なコメントを加えるのが理想です。
    4. 最後に締めの挨拶で、今日伝えた記事を簡潔におさらいし、次回会えるのを楽しみにしていること、番組の感想を募集していることを伝えます。

    ## 制約

    - 出力フォーマットは、JSON形式で、放送タイトル title と、放送内容 script の2つのキーからなるオブジェクトです
    - eri が話す必要がない場合は simon のみでもOKです
    - MCが読み上げるセリフ部分だけを出力します
    - 自然な話し言葉になるように、適宜フィラーなどを挿入します
    - 難しい漢字は読み手が間違えないように、ひらがなで書きます
    - 読み上げ用の原稿なので、URLは含めないでください
    - 紹介する内容は、以下で指定する内容に留め、誤った情報を追加しないでください
    - 事実と意見・感想を明確に区別し、聞き手が理解しやすい内容の発言をするようにしてください
    - script の文字数の下限: 3000文字
    - script の文字数の上限: 6000文字

    JSON形式の例:
    ```json
    {{
        "title": "クジラの言語構造についての最新研究",
        "script": {{
            "0": {{
                "simon": "皆さん、おはようございます！本日も始まりました「LLM Radio」。今日は2024年5月19日、日曜日ですね。お相手はサイモンと...",
                "eri": "エリです。"
            }},
            "1": {{
                "simon": "ということで、本日は3つの注目記事をピックアップしました！まずは『Please and Thank You in Prompt Engineering: Its Impact on Using Generative AI』、次に『GPT-4o が獲得した日本語の語彙を調べる』、そして最後に『クジラの言語構造、想像以上に人間の言語に近かった』を紹介します。",
                "eri": "へぇー、どれも面白そうですね。"
            }}
        }}
    }}
    ```

    ## 紹介する内容

    タイトル: {summary["title"]}
    {summary["content"]}
    """

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": user_prompt}],
        response_format={"type": "json_object"},
        max_tokens=4096
    )
    script = json.loads(response.choices[0].message.content)
    return script
````

### step4: OpenAI TTS による音声生成

発言ごとに TTS で音声を生成し、順番に結合していきます。

```python
def generate_voice(script: dict) -> None:
    client = OpenAI()
    voices = {
        "simon": "echo",
        "eri": "nova"
    }
    combined_audio = AudioSegment.empty()

    for turn in script.values():
        for speaker, text in turn.items():
            audio_response = client.audio.speech.create(
                model="tts-1-hd",
                voice=voices[speaker],
                input=text
            )
            audio_file = f"{speaker}.mp3"
            audio_response.stream_to_file(audio_file)
            audio_segment = AudioSegment.from_file(audio_file)
            combined_audio += audio_segment
            os.remove(audio_file)

    combined_audio.export("out/voice.mp3", format="mp3")
```

### step5: BGM の合成

Pydub を使って BGM を合成します。
自然な感じを演出するために、BGM を前後に入れたり、フェードアウトさせたりします。

```python
from pydub import AudioSegment

def generate_audio() -> None:
    voice = AudioSegment.from_file("out/voice.mp3")
    bgm = AudioSegment.from_file("bgm.mp3") - 15  # BGMの音量を少し下げて読み込む

    # BGMをvoiceの長さに合わせる
    if len(bgm) < len(voice) + 10000:
        bgm = bgm * ((len(voice) + 10000) // len(bgm) + 1)  # ループ再生
    bgm = bgm[:len(voice) + 10000]

    # 終了時にBGMをフェードアウト
    bgm = bgm.fade_out(4000)

    # BGMが始まってから5秒後にvoiceを重ねる
    combined_audio = bgm.overlay(voice, position=5000)

    combined_audio.export("out/llm_radio.mp3", format="mp3")
```

という感じで、比較的かんたんな処理でラジオ番組を作成することができます。
GPT-4oの利用料が比較的安くなったおかげで、かなり試行錯誤した自分でもそこまでコストはかかっていないので、興味がある方はぜひ試してみてください。

![gpt-usage](/assets/20240519_gpt-usage.png)
_めちゃくちゃリクエスト投げたんですが合計$13でなんとか済みました_
