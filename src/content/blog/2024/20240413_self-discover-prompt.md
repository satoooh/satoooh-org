---
title: "SELF-DISCOVERというLLMプロンプト手法を実装して試してみた"
description: "Google DeepMindが提案したSELF-DISCOVERというLLMの推論精度を高める手法が面白かったので、手元で試したところ、2022年共通テスト英語リーディング問題で96%の正答率を達成することができました。"
pubDatetime: 2024-04-13
modDatetime: 2024-04-13
author: "satoooh"
slug: "self-discover-prompt"
featured: false
draft: false
tags:
  - "LLM"
  - "ChatGPT"
ogImage: "/assets/Zhou2024SelfDiscover.jpg"
---

ひとこと: 2024年2月に提案された SELF-DISCOVER という LLM の推論精度を高める手法を手元で再現し、以前チャレンジした共通テスト英語の推論問題 [^posts-chatgpt-exam] に適用してみた結果、プロンプトテクニックを用いない場合と比較して正解率が向上することがわかりました。

![Zhou2024SelfDiscover](/assets/Zhou2024SelfDiscover.jpg)
_今回取り上げる論文のかんたんなまとめ。arXiv: https://arxiv.org/abs/2402.03620_

## Table of contents

## はじめに

2022年11月30日のChatGPTのリリース以降、大規模言語モデル(LLM, Large Language Model)は研究者だけでなく、ビジネスや日常生活などあらゆる場面で人間に大きな影響を与えています。
しかし、LLMは複雑な推論問題を解くにはまだ課題があると言われており、<u>**推論能力を最大限引き出すためにプロンプト(LLMに与える自然言語の指示)の様々な工夫が提案されています**</u>。

私自身も、[2023年1月に共通テストの英語をChatGPTに解かせる実験結果を記事にまとめた](/posts/chatgpt-exam)のですが、基本的な読解力はあれど、少しレベルの高い推論になると解けなくなることが確認されました。

### これまで提案されたプロンプトの主要な工夫について

プロンプトの様々な工夫として、人間の認知のしくみから着想を得た様々な手法が提案されてきました。

最もシンプルな工夫は「<u>**例を与える**</u>」ことでしょう。
これは In-context Learning, Few-shot/One-shot Prompting と呼ばれ、プロンプト内でいくつかの例を与えることで、LLMのモデル自体を更新しなくとも精度を改善し、さも追加で学習したかのような効果を得ることができる手法です。

![few-shot-prompting](https://i.gyazo.com/fad024495d7db4f756bacbe265e5a5bc.png)
_Few-Shot Promptingの例。過去にChatGPT勉強会を開催した際のスライドより_

また、CoT (Chain of Thought) と呼ばれる有名な手法は、LLMに推論結果だけでなく、その推論過程も出力させることで、推論自体の精度を向上させる手法です。
「プロンプトの末尾に <u>**"Let's think step by step."**</u> (順を追って考えてみよう) と追記するだけで精度が向上する」と報告した Zero-shot-CoT という手法 [^kojima2023large] は、そのシンプルさから多くの人に注目された東京大学の研究成果です。

![zero-shot-cot](https://i.gyazo.com/380b3edd9f4723c72198a16ff35457f3.png)
_Zero-shot-CoTの例。図は論文[^kojima2023large]より引用。過去にChatGPT勉強会を開催した際のスライドより_

他にも、Least-to-Most Prompting という手法 [^zhou2023leasttomost] では、問題を小さな部分問題に分割し、それらを順に解くように指示する手法で、「<u>**困難は分割せよ**</u>」というデカルトの考え方に通じるものがあります。

![least-to-most](https://i.gyazo.com/42285d2b48dcd0626bc9f2964b3143f8.png)
_Least-to-Most Promptingの模式図。図は論文[^zhou2023leasttomost]より引用。過去にChatGPT勉強会を開催した際のスライドより_

### 今回取り上げる手法: SELF-DISCOVER

といったように、プロンプトに関する手法は数多く提案されているのですが、2024年2月に arXiv に投稿された <u>**"SELF-DISCOVER: Large Language Models Self-Compose Reasoning Structures"**</u> [^zhou2024selfdiscover] という論文で提案された手法が興味深かったので、この記事ではその手法を実装・検証した内容をまとめます。

## SELF-DISCOVER 論文の概要

人間は複雑な推論をするとき、過去の推論に関する知見から応用できそうなものを探し、それを適用することで問題を解決すると言われています。
SELF-DISCOVER ではこれを模倣し、LLMが複雑な推論問題を解くために、そのタスクに固有の推論構造をプロンプトで自動的に発見します。

より具体的には、SELF-DISCOVER は下図のように、大きく2つのステージから構成されます。

![Self-Discover-fig2](https://i.gyazo.com/b7487490b3252962af0760c94f678231.png)
_SELF-DISCOVER手法の概要。論文[^zhou2024selfdiscover] Figure 2. より_

### Stage 1: 推論構造の発見

Stage 1では、<u>**推論モジュール RM (Reasoning Module) と SELECT、ADAPT、IMPLEMENT の3つのステップを通じて、タスクに適した推論構造を発見します**</u>。
推論モジュールというのは、普遍的な推論に関する知見のことで、次のようなものが挙げられます。

- 問題を単純化して解きやすくする方法はあるだろうか？
- 対処する必要のある中心的な問題や課題は何だろうか？
- どのような指標やメトリクスを使用できるだろうか？

先ほど述べた Zero-shot-CoT ("Let's think step by step.") も推論モジュールの一つとして考えられます。
SELECTでは、39の推論モジュールのリストから問題解決に役立つ推論モジュールを選択します。
ADAPTでは選択されたモジュールをタスクに適する形で言い換えて具体化します。
IMPLEMENTでは適応されたモジュールをJSON形式の構造化されたデータとしてまとめます。

このようにして得られた推論構造をもとに問題を解くことで、より高精度な推論が期待されるというのが本手法のアイデアです。

### Stage 2: 推論構造を使用したタスク解決

Stage 2では、Stage 1で発見された推論構造を使用して、具体的な問題を解決します。
この段階では、推論構造に従ってJSONの値を埋めていくことで、推論に取り組みます。

## 本題: SELF-DISCOVER を実装して試してみる

ここまで紹介した SELF-DISCOVER 手法ですが、私の知る限り公式実装が公開されていなかったため、論文の内容をもとに自分で実装して再現してみることにしました [^self-discover-github] 。

Python で再現するために LangChain[^langchain] というライブラリを使用しました。
プロンプトもすべて論文中に載っているわけではありませんが、図を参照するなどして論文の内容に忠実に再現しています。下にはコードの概要（一部省略。完全なコードはGitHub [^self-discover-github] を参照）

```python
def self_discover(task_description: str):
    llm = ChatOpenAI(model="gpt-4-turbo", temperature=0)

    # SELECT
    select_prompt = PromptTemplate(input_variables=["task_description"], template=SELECT_PROMPT)
    select_chain = select_prompt | llm

    # ADAPT
    adapt_prompt = PromptTemplate(input_variables=["selected_modules"], template=ADAPT_PROMPT)
    adapt_chain = adapt_prompt | llm

    # IMPLEMENT
    implement_prompt = PromptTemplate(input_variables=["adapted_modules"], template=IMPLEMENT_PROMPT)
    implement_chain = implement_prompt | llm

    # REASONING
    reasoning_prompt = PromptTemplate(input_variables=["reasoning_structure"], template=REASONING_PROMPT)
    reasoning_chain = reasoning_prompt | llm

    # ANSWERING (推論後に回答のみを抽出)
    answering_prompt = PromptTemplate(input_variables=["reasoning_result"], template=ANSWERING_PROMPT)
    answering_chain = answering_prompt | llm

    overall_chain = select_chain | adapt_chain | implement_chain | reasoning_chain | answering_chain
    result = overall_chain.invoke(task_description)

    return result.content
```

以下がプロンプトです。

```python
SELECT_PROMPT = """
Select several reasoning modules that are crucial to utilize in order solve the given task:

## All reasoning module descriptions

1. How could I devise an experiment to help solve that problem?
2. Make a list of ideas for solving this problem, and apply them one by one to the problem to see if any progress can be made.
3. How could I measure progress on this problem?
4. How can I simplify the problem so that it is easier to solve?
5. What are the key assumptions underlying this problem?
6. What are the potential risks and drawbacks of each solution?
7. What are the alternative perspectives or viewpoints on this problem?
8. What are the long-term implications of this problem and its solutions?
9. How can I break down this problem into smaller, more manageable parts?
10. Critical Thinking: This style involves analyzing the problem from different perspectives, questioning assumptions, and evaluating the evidence or information available. It focuses on logical reasoning, evidence-based decision-making, and identifying potential biases or flaws in thinking.
11. Try creative thinking, generate innovative and out-of-the-box ideas to solve the problem. Explore unconventional solutions, thinking beyond traditional boundaries, and encouraging imagination and originality.
12. Seek input and collaboration from others to solve the problem. Emphasize teamwork, open communication, and leveraging the diverse perspectives and expertise of a group to come up with effective solutions.
13. Use systems thinking: Consider the problem as part of a larger system and understanding the interconnectedness of various elements. Focuses on identifying the underlying causes, feedback loops, and interdependencies that influence the problem, and developing holistic solutions that address the system as a whole.
14. Use Risk Analysis: Evaluate potential risks, uncertainties, and tradeoffs associated with different solutions or approaches to a problem. Emphasize assessing the potential consequences and likelihood of success or failure, and making informed decisions based on a balanced analysis of risks and benefits.
15. Use Reflective Thinking: Step back from the problem, take the time for introspection and self-reflection. Examine personal biases, assumptions, and mental models that may influence problem-solving, and being open to learning from past experiences to improve future approaches.
16. What is the core issue or problem that needs to be addressed?
17. What are the underlying causes or factors contributing to the problem?
18. Are there any potential solutions or strategies that have been tried before? If yes, what were the outcomes and lessons learned?
19. What are the potential obstacles or challenges that might arise in solving this problem?
20. Are there any relevant data or information that can provide insights into the problem? If yes, what data sources are available, and how can they be analyzed?
21. Are there any stakeholders or individuals who are directly affected by the problem? What are their perspectives and needs?
22. What resources (financial, human, technological, etc.) are needed to tackle the problem effectively?
23. How can progress or success in solving the problem be measured or evaluated?
24. What indicators or metrics can be used?
25. Is the problem a technical or practical one that requires a specific expertise or skill set? Or is it more of a conceptual or theoretical problem?
26. Does the problem involve a physical constraint, such as limited resources, infrastructure, or space?
27. Is the problem related to human behavior, such as a social, cultural, or psychological issue?
28. Does the problem involve decision-making or planning, where choices need to be made under uncertainty or with competing objectives?
29. Is the problem an analytical one that requires data analysis, modeling, or optimization techniques?
30. Is the problem a design challenge that requires creative solutions and innovation?
31. Does the problem require addressing systemic or structural issues rather than just individual instances?
32. Is the problem time-sensitive or urgent, requiring immediate attention and action?
33. What kinds of solution typically are produced for this kind of problem specification?
34. Given the problem specification and the current best solution, have a guess about other possible solutions.
35. Let's imagine the current best solution is totally wrong, what other ways are there to think about the problem specification?
36. What is the best way to modify this current best solution, given what you know about these kinds of problem specification?
37. Ignoring the current best solution, create an entirely new solution to the problem.
38. Let's think step by step.
39. Let's make a step by step plan and implement it with good notation and explanation.

## Your task

{task_description}

Select several modules that are crucial for solving the tasks above:
"""
```

```python
ADAPT_PROMPT = """
Rephrase and specify each reasoning module so that it better helps solving the task:

## Reasoning module description
{selected_modules}

## Your task
{task_description}

Adapt each reasoning module description to better solve the tasks
"""
```

```python
IMPLEMENT_PROMPT = """
Operationalize the reasoning modules into a step-by-step reasoning plan in JSON format:

## Reasoning module description
{adapted_modules}

## Your task
{task_description}

Implement a reasoning structure for solvers to follow step-by-step and arrive at correct answers:
"""
```

```python
REASONING_PROMPT = """
Follow the self-discovered reasoning structure to solve the task by filling in the values in JSON step-by-step.

Reasoning Structure:
{reasoning_structure}

Task:
{task_description}

Task Solution:
"""
```

```python
ANSWERING_PROMPT ="""
Based on the reasoning results, return the final answer.

## Reasoning Result
{reasoning_result}

## Your task
{task_description}

Final Answer:
"""
```

### SELF-DISCOVER 検証: SVG path element の描画形状を推論する

実装した SELF-DISCOVER 手法を検証するために、下図の論文 Figure 7. で例として挙げられているSVGの形状推論の問題を解いてみました。

![Self-Discover-fig7](https://i.gyazo.com/205d3669d0e6cacfb6ece15c29379091.png)
_SELF-DISCOVER手法を用いてSVGの形状推論問題を解かせ、それをCoT, Plan-nad-Solveと比較した図。論文[^zhou2024selfdiscover] Figure 7. より_

この図では、CoT 手法と Plan-and-Solve 手法と比較して、SELF-DISCOVER 手法のみが正しい推論結果を出力していることがわかります。

私の実装した SELF-DISCOVER 手法で検証しても、同様に正しい推論結果を出力することができました。

![my-self-discover-result](https://i.gyazo.com/71468e148d4c8fc6246fa682748d81e3.png)

参考までに、出力した推論構造は以下のようになりました。

```json
{
  "reasoning_plan": [
    {
      "step": 1,
      "module": "Decomposition into Manageable Components",
      "description": "Break down the SVG path into individual commands and segments. Identify the start and end points of each segment.",
      "actions": [
        {
          "action": "parse",
          "details": "Extract and list all commands from the SVG path."
        },
        {
          "action": "identify",
          "details": "Determine the start and end points for each segment."
        }
      ]
    },
    {
      "step": 2,
      "module": "Utilization of SVG Path Command Knowledge",
      "description": "Understand the meaning of each SVG path command used in the path data.",
      "actions": [
        {
          "action": "research",
          "details": "Look up the definitions of SVG path commands such as 'M' (move to) and 'L' (line to)."
        },
        {
          "action": "apply",
          "details": "Apply the knowledge of these commands to interpret how each segment is formed."
        }
      ]
    },
    {
      "step": 3,
      "module": "Simplification of SVG Path Analysis",
      "description": "Convert the SVG path commands into a more understandable format, such as a visual diagram or a list of points and their connections.",
      "actions": [
        {
          "action": "transform",
          "details": "Create a visual diagram or list that represents the SVG path commands and their connections."
        }
      ]
    },
    {
      "step": 4,
      "module": "Technical Expertise in SVG and Geometry",
      "description": "Use technical knowledge of SVG path syntax and geometric principles to analyze the shape formed by the path.",
      "actions": [
        {
          "action": "analyze",
          "details": "Analyze the SVG path using knowledge of geometry and SVG syntax to determine the shape."
        }
      ]
    },
    {
      "step": 5,
      "module": "Analytical Modeling of the Shape",
      "description": "Model the geometric shape from the path data by creating a representation of the connections and angles between segments.",
      "actions": [
        {
          "action": "model",
          "details": "Create a geometric model that represents the connections and angles between the segments of the SVG path."
        }
      ]
    },
    {
      "step": 6,
      "module": "Step-by-Step Path Analysis",
      "description": "Analyze each segment of the SVG path in sequence to understand how each contributes to the overall shape.",
      "actions": [
        {
          "action": "sequence analysis",
          "details": "Examine each segment in sequence and determine how it contributes to the overall shape."
        }
      ]
    }
  ]
}
```

また、ChatGPTのWeb上で<u>**プロンプトの工夫無しで解かせてみると、間違った答え（G:Pentagon）を出力してしまう**</u>ことも確認できました。
モデルにはGPT-4を使用しており、2024年4月13日時点でWeb UI上で利用可能なモデルを使用しています。

![ChatGPT4-WebUI](https://i.gyazo.com/213632bbe4ed0c6ae9ea7dcb50a7bf4c.png)
_ChatGPTに問題文だけ与えて解かせた図_

### さらなる検証: 共通テスト英語の問題にチャレンジ

本記事の冒頭で、ChatGPTに共通テストの英語を解かせる実験を行ったことを述べましたが、SELF-DISCOVER手法を使用して共通テストの英語の推論問題に取り組んでみることで、当時解けなかったレベルの問題が解けるようになるかどうかを検証してみます。

試しにまず、2022年共通テスト英語の第1問Aを、SELF-DISCOVER手法を用いた場合とそうでない場合（BASELINEとする）のそれぞれについて `gpt-4-turbo-2024-04-09` を用いて解かせてみました。
第1問Aは2つの4択の読解問題であり、BASELINEでは "solve the task: 問題文" というシンプルなプロンプトのみを与えています。
問題の正答は <1>: (1) a cake 、<2>: (3) jabuticaba [^kyotsu2022EnRAns] です。

```md
BASELINE:
解答 <1>: (1) a cake
解答 <2>: (4) pitanga
```

```md
SELF-DISCOVER:
解答 <1>: (1) a cake
解答 <2>: (3) jabuticaba
```

このように、 <u>**<2> の問題については SELF-DISCOVER 手法を用いた場合にのみ正解を出力することができました**</u>。

参考までに、SELF-DISCOVER 手法によって出力された推論構造は次のようになりました。

```json
{
  "reasoning_plan": [
    {
      "module": "Identification of Key Task",
      "description": "Identify the primary challenge of the task, which is to correctly match the fruits to their appropriate uses in desserts as described in the text."
    },
    {
      "module": "Detailed Analysis",
      "description": "Examine the text thoroughly to understand the characteristics and culinary uses of each Brazilian fruit mentioned."
    },
    {
      "module": "Systematic Problem-Solving",
      "description": "Create a structured list of the fruits and their described uses, then methodically verify each fruit against the requirements of the quiz questions to ensure precise answers."
    },
    {
      "module": "Step-by-Step Reasoning",
      "steps": [
        {
          "step": 1,
          "description": "Review the descriptions of cupuaçu and buriti from the text to determine which desserts they can be used to make.",
          "action": "Check the text for mentions of 'cake', 'chocolate', 'ice cream', and 'yogurt' in relation to cupuaçu and buriti."
        },
        {
          "step": 2,
          "description": "Identify which fruit is suitable for making a sour cake based on the text descriptions.",
          "action": "Look for mentions of sourness and suitability for cake making in the descriptions of jabuticaba and pitanga."
        }
      ]
    }
  ]
}
```

他の問題も同様に回答させ、2022年共通テスト英語リーディングの得点を集計してみました。以下の表では間違えた箇所が太字で示されています。

#### BASELINE の2022年共通テスト英語リーディング結果:

| 問題  | BASELINE 得点 | BASELINE 回答                           |
| ----- | ------------- | --------------------------------------- |
| 第1問 | 8/10          | 1, <u>**4**</u>, 2, 2, 1                |
| 第2問 | 18/20         | 5, 3, 1, 3, 1, <u>**4**</u>, 4, 2, 4, 2 |
| 第3問 | 15/15         | 1, 1, 1-4-3-2, 2, 2                     |
| 第4問 | 12/16         | 3, 3, 2, 1, <u>**3**</u>, <u>**2**</u>  |
| 第5問 | 12/15         | 1, 4-5, <u>**4-1-3-5**</u>, 3, 3        |
| 第6問 | 21/24         | 3, 3, 1, 6-3, 2, 2, 1, <u>**4-4**</u>   |
| 合計  | 86/100        | -                                       |

#### SELF-DISCOVER の2022年共通テスト英語リーディング結果:

| 問題  | SELF-DISCOVER 得点 | SELF-DISCOVER 回答                     |
| ----- | ------------------ | -------------------------------------- |
| 第1問 | 10/10              | 1, 3, 2, 2, 1                          |
| 第2問 | 20/20              | 5, 3, 1, 3, 1, 2, 4, 2, 4, 2           |
| 第3問 | 15/15              | 1, 1, 1-4-3-2, 2, 2                    |
| 第4問 | 12/16              | 3, 3, 2, 1, <u>**3**</u>, <u>**1**</u> |
| 第5問 | 12/15              | 1, 4-5, 2-5-4-1, 3, 3                  |
| 第6問 | 24/24              | 3, 3, 1, 6-3, 2, 2, 1, 3-4             |
| 合計  | 96/100             | -                                      |

```md
正答:
第1問: 1, 3, 2, 2, 1
第2問: 5, 3, 1, 3, 1, 2, 4, 2, 4, 2
第3問: 1, 1, 1-4-3-2, 2, 2
第4問: 3, 3, 2, 1, 2, 4
第5問: 1, 4-5, 2-5-4-1, 3, 3
第6問: 3, 3, 1, 6-3, 2, 2, 1, 3-4
```

結果、<u>**SELF-DISCOVER 手法を用いた場合、合計得点が 96 点となり、BASELINE よりも 10 点高い 96% の正答率を達成することができました**</u>。
LLMの出力は不安定であるため、この結果はあくまで一例に過ぎず、共通テスト英語の得点能力を断定することはできませんが、上振れの場合でも96%の得点率を達成できたのは素晴らしい結果です。

## まとめ

論文を参考に実装した SELF-DISCOVER を用いて、通常のプロンプトでは解けなかった問題に対して正答を導くことが確認できました。
去年自分が取り扱った共通テスト英語の問題に対しても、SELF-DISCOVER 手法を適用することで正答率が向上することが確認できたのは理解を深める有意義な体験になりました。

また、1年間で ChatGPT のモデル自体が大きく進化しているというのもあり、記事 [^posts-chatgpt-exam] 当時の ChatGPT である GPT-3.5 では 77% の正答率だった共通テスト英語の問題に対して、GPT-4 を利用するだけで 86% の正答率も達成できるようになっていることも興味深いところです。

GPT-5 がいつ出るのか分かりませんが、GPT-4では画像入力もできるので、ARグラスで問題入力して回答を表示するような GPT カンニングメガネを作ることもできちゃいそうですね（私の手元では gpt-4-vision への画像入力での共通テスト英語リーディングは 76% の得点を記録しています。これも機会があれば記事にまとめます）。
また、英語でこれくらいの精度が出るのであれば国語でもある程度得点が期待できるかもしれませんね。

LLM の未来がより楽しみになりました。
今後もプロンプトの手法は改善の余地があると思うので、興味深いものがあればまた検証してみたいと思います。

---

[^posts-chatgpt-exam]: [ChatGPTに共通テストの英語を解かせてみたら77%取れた | satoooh.org](/posts/chatgpt-exam)
[^zhou2024selfdiscover]: Zhou, P., Pujara, J., Ren, X., Chen, X., Cheng, H. T., Le, Q. V., Chi, E. H., Zhou, D., Mishra, S., & Zheng, H. S. (2024). Self-Discover: Large Language Models Self-Compose Reasoning Structures. arXiv preprint arXiv:2402.03620.
[^kojima2023large]: Kojima, T., Gu, S. S., Reid, M., Matsuo, Y., & Iwasawa, Y. (2022). Large Language Models are Zero-Shot Reasoners. In Advances in Neural Information Processing Systems (Vol. 35, pp. 22199-22213).
[^zhou2023leasttomost]: Zhou, D., Schärli, N., Hou, L., Wei, J., Scales, N., Wang, X., Schuurmans, D., Cui, C., Bousquet, O., Le, Q., & Chi, E. (2023). Least-to-Most Prompting Enables Complex Reasoning in Large Language Models. arXiv preprint arXiv:2205.10625.
[^self-discover-github]: [satoooh/SELF-DISCOVER: UNOFFICIAL Python implementation of the SELF-DISCOVER method (https://arxiv.org/abs/2402.03620)](https://github.com/satoooh/SELF-DISCOVER) に実装を公開しています
[^langchain]: https://www.langchain.com/
[^kyotsu2022EnRAns]: [共通テスト2022 リーディング解答｜共通テスト解答速報2022｜予備校の東進](https://www.toshin.com/kyotsutest/2022/answer_reading.html) で確認
