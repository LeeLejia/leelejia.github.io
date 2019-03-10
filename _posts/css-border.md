---
layout: post
title: "border的更多用法"
date: 2017-11-02 15:20
comments: false
reward: false
toc: true
tags: 
	- 前端
	- css
---

**border**属性有个特别的地方，在一个width，height为0的区域，通过设置任意一对横向纵向的border即可构建一个有面积的区域。并且可以依据这个特性绘制三角形和锥形。

<!--more-->

### 绘制锥形
通过设置**border**为透明色，提供横轴纵轴的尺寸。再指定一个任意方向带色彩的border，便构成了有色区域。
```html
<!-- html -->
<div class="outer"></div>
<!-- css -->
.outer{
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-radius: 40px;
  border-left: 20px solid grey;
}
```

### 制作一个尖角对话框

制作尖角对话框要求对position，还有before，after能
