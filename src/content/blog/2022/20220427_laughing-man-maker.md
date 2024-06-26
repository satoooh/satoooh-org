---
title: "笑い男メーカー"
description: "p5.js と ml5.js を利用して、Web カメラからリアルタイムで顔の検出 +笑い男化するクソアプリを作りました。"
pubDatetime: 2022-04-27T00:00:00Z
modDatetime: 2023-01-11T00:00:00Z
author: "satoooh"
slug: "laughing-man-maker"
featured: false
draft: false
tags:
  - "2022"
  - "p5.js"
  - "ml5.js"
  - "クソアプリ"
ogImage: "https://gyazo.com/db6c86088916925337c1379cf64ed869.jpeg"
---

## 概要

p5.js と ml5.js を利用して、Web カメラからリアルタイムで顔の検出 + 笑い男化するクソアプリを作りました。
デモを用意しているので、ぜひ実際にやってみてください。

![image](https://gyazo.com/db6c86088916925337c1379cf64ed869.jpeg)

demo: https://editor.p5js.org/bighope-lumiere/sketches/CcOtWZA-e

## コード

処理自体は顔の検出と、検出した顔の四角形に対して gif 画像を載せて描画するだけなので非常にかんたんです。
顔になんかする系のクソアプリを作成する際に使えると思いますので、ぜひ試してみてください。

```js
let faceapi;
let video;
let detections;

const detection_options = {
  withLandmarks: true,
  withDescriptors: false,
};

let mask;
function preload() {
  mask = loadImage("waraiotoko.gif");
}

function setup() {
  createCanvas(360 * 2, 270 * 2);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  faceapi = ml5.faceApi(video, detection_options, modelReady);
  textAlign(RIGHT);
}

function modelReady() {
  console.log("ready!");
  console.log(faceapi);
  faceapi.detect(gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  detections = result;

  background(255);
  image(video, 0, 0, width, height);
  if (detections) {
    if (detections.length > 0) {
      drawBox(detections);
    }
  }
  faceapi.detect(gotResults);
}

function drawBox(detections) {
  for (let i = 0; i < detections.length; i++) {
    const alignedRect = detections[i].alignedRect;
    const x = alignedRect._box._x;
    const y = alignedRect._box._y;
    const boxWidth = alignedRect._box._width;
    const boxHeight = alignedRect._box._height;

    noFill();
    stroke(161, 95, 251);
    strokeWeight(2);
    rect(x, y, boxWidth, boxHeight);
    image(mask, x, y, boxWidth, boxHeight);
  }
}
```
