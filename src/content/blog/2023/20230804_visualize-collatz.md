---
title: "コラッツ予想を眺める"
description: "コラッツ予想の可視化をしてみました。"
pubDatetime: 2023-08-04
modDatetime: 2023-08-04
author: "satoooh"
slug: "visualize-collatz"
featured: false
draft: false
tags:
  - "Python"
  - "math"
  - "やってみた"
ogImage: "/assets/visualize_collatz_1.webp"
---

夜更かししてしまったので、ツイッターでコラッツ予想について見かけた [^tweet] 際に遊んで眺めた様子をメモしておきます。眺めるだけで特に示唆や気付きはありません。

コラッツ予想というのは、どんな正の整数も次のルールに従って値を更新していくとやがて1になるというもの。凄くシンプルなのに、まだ証明はされていないらしい。

$$f(n) = \left\{ \begin{array}{ll} n/2 & \text{(nが偶数)} \\ 3n+1 & \text{(nが奇数)} \end{array} \right.$$

気になる方は[コラッツの問題 - Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%A9%E3%83%83%E3%83%84%E3%81%AE%E5%95%8F%E9%A1%8C)を参照してください。

こういうのはプログラムで書くと色々と遊べて楽しい。

```python
def collatz(x: int) -> int:
    if x % 2 == 0:
        return x // 2
    else:
        return 3 * x + 1
```

例えば、コラッツの式で更新をして、何ステップで1に到達するかを数えてみます。

```python
def collatz_count(n: int) -> int:
    """nから始まって何回のステップで1に到達するかを数える"""
    count: int = 0
    while n != 1:
        n = collatz(n)
        count += 1
    return count
```

これを1〜500くらいで動かしてプロットしてみると

```python
import matplotlib.pyplot as plt
plt.style.use("ggplot")

n_max: int = 500

collatz_count_list: list = [collatz_count(i) for i in range(1, n_max+1)]

plt.figure(figsize=(16,8))
plt.plot(collatz_count_list)
plt.xlabel("n")
plt.ylabel("collatz_count(n)")
plt.title(f"collatz_count: n=1,...,{n_max}")
plt.show()
```

![collatz_count](/assets/visualize_collatz_2.webp)
_規則性、なさそ〜〜_

流石に折れ線だとグッチャグチャなので scatter でプロットします。

![collatz_count](/assets/visualize_collatz_3.webp)
_なんかきれい_

![collatz_count](/assets/visualize_collatz_4.webp)
_コラッツ模様とでも呼べそうなパターンが現れてきました_

DTMの打ち込み画面みたいなの出てきたな。
リズムに変換したら聴けなくも無かったりするんでしょうか。

1から10000くらいまで動かして、ステップ数が最大のものは何になるか計算してみます。

```python
import numpy as np

n_max: int = 10000
collatz_count_list: list = [collatz_count(i) for i in range(1, n_max+1)]

print(f"max count: {np.max(collatz_count_list)}, n: {np.argmax(collatz_count_list)+1}")
```

実行結果は `max count: 261, n: 6171` ということで、<u>**1から10000までの整数は全部261ステップ以内で1に到達する**</u>ということですね。

そこで試しに `n=6171` でのステップごとの値の変化をプロットして、1に近づいていく様子を観察してみます。

```python
def collatz_history(n: int) -> list:
    result: list = [n]
    while result[-1] != 1:
        result.append(collatz(result[-1]))
    return result

n_start = 6171

plt.figure(figsize=(16,8))
plt.plot(collatz_history(n_start))
plt.xlabel("step")
plt.title(f"collatz_history: start={n_start}")
plt.show()
```

![collatz](/assets/visualize_collatz_5.webp)
_いったんバカでかくなったあと一気に小さくなって、そこから1に行くまでには時間かかってますね_

---

一旦1e+6くらいまでデカくなってますね。具体的にどんなクソデカ整数が現れるかを見てみます。

```python
def collatz_max_val(n: int) -> int:
    """コラッツ更新中の最大値を返す"""
    res = n
    while n != 1:
        n = collatz(n)
        res = max(res, n)
    return res

collatz_max_val(6171)  # 975400
```

これを使って、コラッツ中（造語）に一番でかい整数を叩き出す初期値を探してみます。

```python
n_max: int = 100

collatz_max_val_list: list = [collatz_max_val(i) for i in range(1, n_max+1)]

plt.figure(figsize=(16,8))
plt.plot(collatz_max_val_list)
plt.xlabel("n")
plt.ylabel("collatz_max_val(n)")
plt.title(f"collatz_max_val: n=1,...,{n_max}")
plt.show()
```

![collatz_max_val](/assets/visualize_collatz_6.webp)
_ときどきでかい値が出てくる_

もっと `n_max` を大きくしてみましょう。

![collatz_max_val](/assets/visualize_collatz_7.webp)

![collatz_max_val](/assets/visualize_collatz_8.webp)

![collatz_max_val](/assets/visualize_collatz_9.webp)

オーダーを大きくするたびに桁違いにデカいやつがいくつか現れていますね。

---

他の数字からスタートするとどんな形になるか観察するために、ランダムにでかい整数を引っ張ってきます。

```python
n_starts = [np.random.randint(1e+9) for _ in range(5)]

for n_start in n_starts:
    plt.figure(figsize=(16,8))
    plt.plot(collatz_history(n_start))
    plt.xlabel("step")
    plt.title(f"collatz_history: start={n_start}")
    plt.show()
```

![collatz](/assets/visualize_collatz_10.webp)

![collatz](/assets/visualize_collatz_11.webp)

![collatz](/assets/visualize_collatz_12.webp)

![collatz](/assets/visualize_collatz_13.webp)

![collatz](/assets/visualize_collatz_14.webp)

全部クソデカ整数ですが、842592789なんかは挙動が大人しく、少ないステップ数で1に到達していますね。

う〜ん、色々やってみたけどやっぱりよく分からん。
受験生のころもコラッツ問題の計算式を紙にいろいろ計算したり、逆に1から辿ってみたりして遊んでいた記憶があるのだけど、なにか発見があるわけでも無かったんですよね。

なんかいい眺め方あったら教えてください。

---

[^tweet]: https://twitter.com/cicada3301_kig/status/1687054626309435393
