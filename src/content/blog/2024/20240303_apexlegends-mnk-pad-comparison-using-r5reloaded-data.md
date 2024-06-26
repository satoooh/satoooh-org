---
title: "R5Reloaded 1v1 のデータを利用して Apex Legends のキーマウPAD論争の情報源として使えそうなデータ可視化を試みる"
description: "Apex Legends 非公式 Mod である R5Reloaded の 1v1 データを取得し、キーマウとPADの実力を比較しました。"
pubDatetime: 2024-03-03
author: "satoooh"
slug: "apexlegends-mnk-pad-comparison-using-r5reloaded-data"
featured: false
draft: false
tags:
  - "2024"
  - "Apex Legends"
  - "Data Analysis"
ogImage: "https://i.gyazo.com/a1e88cce7b5878328f7c158936cdc037.png"
---

PC 版の Apex Legends というゲームには古来より「キーマウ・PAD 論争」と呼ばれる論争が存在します。
ここでいうキーマウ[^キーマウ]とはキーボード&マウスのことで、PAD[^PAD]はコントローラーのことを指します。

この議論の中心にあるのが、<u>**PAD（コントローラー）がキーマウ（キーボード&マウス）よりも強いという主張**</u>です。
私自身も両方を試した経験がありますが、PAD の方が強力なように感じます。

背景には、「エイムアシスト」という要素があります。
キーマウは多くのボタンと腕による直感的な視点操作が可能な一方で、PADは操作が比較的不利な面があるとされています。
そのため、PADでは射撃時に照準が自動的に敵に少し吸い付くように「アシスト」がかけられています。

しかし、この「エイムアシスト」があまりにも強力すぎて、それに蹂躙され萎えて引退するキーマウプレイヤーが、アマチュアからプロ選手まで後を絶たないのです。

開発者も次のように発言しています。
「エイムアシストは、アクセシビリティのためにあるのです。また、誤って “良すぎる “ものにすることは簡単で、その境界線がどこにあるかは議論の余地があります」
「数年かけて調整する予定」[^Respawn-Yardbarker]
しかし、もうリリースから5年も経ち、キーマウ戦士たちの多くが消えていったこのゲームで、今更エイムアシストを弱体化しても...という諦めもあります。

とまぁ、面倒な論争があるんですが、今回は<u>**PADが強いことをデータからも示せるのは面白い**</u>と思い、データを取得して可視化し、眺めてみました。

## Table of contents

## 1. 経緯

先日、キーマウと PAD を比較してデータを分析し、 PAD が強いことを示したうえで<u>**バランスを欠いている**</u>と問題提起した Reddit の記事 [^Reddit-giraffes] が界隈で話題になりました。

![画像出典は Reddit 元記事より](https://i.gyazo.com/55c1b98d14b124af58d588ed77be9a5c.png)

K/D[^K/D] については少し見づらいですが、Accuracy[^Accuracy] については特に、ここまできれいに差が可視化されているのは興味深いです。
同時に、「<u>**本当にここまで明確に差が出るものなのか？**</u>」と疑問に思い、自分も元データにアクセスして集計することにしました。

## 2. データ収集

データは [R5Reloaded Stats Tracker](https://r5r.dev/) の leaderboard から 2024-03-03 時点のものを取得しました。
[R5Reloaded](https://r5reloaded.com/) は Apex Legends の非公式 Mod で、1v1 などのモードができることから、射撃の実力を競い、練習する場としてプレイヤーの間で注目されています。

## 3. 上位N人のNの値を大きくしてみる

Reddit 元記事の画像ではキーマウ、PAD それぞれの TOP 500 までのデータが可視化されていました。
しかし、上位 500 人の超人のデータを比較しても、私のような中堅プレイヤーに役立つデータが得られるか不明です[^comment-algs]。
そこで、TOP 2500 までのデータを抽出し、元記事と同様に K/D と Accuracy を比較してみました。

![n2500](https://i.gyazo.com/7ab25a0d06ac6317df30fcae857d96c2.png)
上図はキーマウ(MnK)、PAD(Controller)それぞれの Score 上位 2500 人を抽出し、K/D（キルデス比）と Accuracy（命中率）をプロットしたものです。Scoreはプレイヤーのパフォーマンスを示す指標で、K/Dはキル数とデス数の比率、Accuracyは射撃の命中率を示します。
横軸が Score の順位で、1 が最上位、2500 が最下位を表します。
グラフには30点の移動平均を載せています。

<u>**基本的にPADが強い**</u>ことが読み取れます。
こんなにきれいに差が出ると、もはや清々しいですね。
ただ、K/D は下の方にいくと MnK が上回る傾向があるかもしれません。
特に2000位以降が気になります。
Accuracy に関しては PAD > MnK と理解して文句なさそうです。

### 比較の課題: キーマウの2000位とPADの2000位は同じ熟練度なのか？

しかし、この比較には課題もあります。
R5 Reloadedのプレイ人口がキーマウ約5000、PAD約3000と差があります。
キーマウの2000位とPADの2000位は同じ「中級者」なのでしょうか？

## 4. 上位X%に標準化して比較してみる

そこで、次に「上からX%のプレイヤー」を同程度の熟練度とみた比較を行いました。
例を挙げて説明すると、上から40%の実力のキーマウプレイヤーと、上から40%の実力のPADプレイヤーが横軸で同じ位置に来るように標準化して比較しました。

### 前処理を追加: プレイ時間が短いノイズを除外

また、前回の比較では行いませんでしたが、今回は前処理を追加しました。
具体的には、`Games Played <= 4` のデータを除外することで、プレイ時間が極端に短いことで生じる Accuracy が 100% のユーザーなどのノイズデータを除外しました。

![percentage](https://i.gyazo.com/a1e88cce7b5878328f7c158936cdc037.png)

上図が分析結果です。
横軸が Score 順位の累積割合で、左端が上位、右端が下位を表します。
他の指標は同じです。
先ほどよりも PAD > MnK の構図がはっきりと可視化されてきました。

## 5. TOP500, MID500, BOTTOM500 を比較してみる

最後に、熟練度ごとにより細かく分析するため、上から500人、中央500人、下から500人をそれぞれ抽出して比較してみました。

### 5.1. TOP500 の比較

![top500](https://i.gyazo.com/f54ceb992ccbebc39823ee19087284f5.png)

K/D については MnK が頑張ってなんとか食らいついているように見えます。
しかし PAD がめちゃくちゃ強いです。
Accuracy については残念ながら 10% 近い差がついています。
キーマウの命中率 27% もすごいですが、PADの命中率 35% はとんでもないですね。

### 5.2. MID500 の比較

![mid500](https://i.gyazo.com/f439a9dba8dd77d25f20ccd8e33392a7.png)

相変わらず PAD が強いです。

### 5.3. BOTTOM500 の比較

![bottom500](https://i.gyazo.com/53268bb011f36cc02037071ef55ac314.png)

K/D は TOP, MID よりも PAD > キーマウにかなり差が出ました。
平均がキーマウ 0.464 に対して PAD 0.732 です。
命中率も 10% 近い差があります。
特に PAD の BOTTOM500 平均の 28.65% はキーマウの TOP500 平均 27.68% より高いです（つらい...）。

## 6. 結論・課題

R5Reloaded のデータを可視化した結果、<u>**いずれの熟練度においても PAD > MnK となる**</u>ことがわかりました。
Accuracy については顕著に差が出ており、いずれの熟練度においてもおよそ 10% の差が見られます。
K/D についても、基本的に PAD がキーマウより優れていることがわかります。
「PADにはエイムアシストがあるがキーマウにはキャラコンがある」という意見もありますが、上位の一部を除く大半のケースでは、キャラコンをしてもエイムアシストの前では無力となるのでしょうか...

私も Apex Legends をキーマウで約 5000 時間、PAD で約 50 時間程度プレイしていますが、近距離の 1v1 におけるエイムに関しては PAD の自分の方が安定して射撃ができると感じています。

とはいえ、この分析には課題もあります。
最大の課題は、<u>**元データを Apex Legends ではなく、非公式 Mod の R5Reloaded から取得していること**</u>でしょう。
R5Reloaded Mod を入れようと考える層はそもそも Apex Legends に対する熱が高い層であり、その中に Apex の初心者がいるのかどうか疑問です（おそらくいないでしょう）。
実際の Apex Legends のプレイデータにアクセスすることは私の知る限り不可能なので、本当のキーマウとPADの比較は公式にしてもらうしかありません。

最後に、エイムアシストに疲れたキーマウ戦士のみんな。
一緒に Overwatch2 をしようね！

---

[^キーマウ]: MnK (=Mouse and Keyboard), KbM (=Keyboard Mouse) とも表記される
[^PAD]: プレステのコントローラーを想像してくれればOK。Controller と表記される
[^Reddit-giraffes]: [I charted out the KbM vs Controller accuracy & K/D stats of the top 500 players on R5 Reloaded 1v1s. Do you think Respawn will ever address this lack of balance? : r/CompetitiveApex](https://www.reddit.com/r/CompetitiveApex/comments/1azzuch/i_charted_out_the_kbm_vs_controller_accuracy_kd/)
[^Respawn-Yardbarker]: [Respawn is “not happy” with aim assist in Apex Legends | Yardbarker](https://www.yardbarker.com/video_games/articles/respawn_is_not_happy_with_aim_assist_in_apex_legends/s1_17144_39443750)
[^K/D]: Kill/Death ratio, キルデス比
[^Accuracy]: 命中率
[^comment-algs]: 最上位プレイヤーの比較をしたいならALGSのデータを比較すればよくて、ALGSのデータ比較はすでに行われています [Statistical Analysis of Controller/M&K at ALGS London 2023 : r/CompetitiveApex](https://www.reddit.com/r/CompetitiveApex/comments/10ywjdq/statistical_analysis_of_controllermk_at_algs/)。
