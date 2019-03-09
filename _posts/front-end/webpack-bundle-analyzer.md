---
layout: post
title: "使用analyzer分析项目依赖"
date: 2018-5-8 15:10
toc: true
tags: 
	- 前端
	- tools
---
使用webpack-bundle-analyzer分析项目依赖的尺寸，进而有选择的对项目进行优化。
<!--more-->
添加依赖
```bash
yarn add webpack-bundle-analyzer
// 或者
npm i -D webpack-bundle-analyzer
```
在webpack.config.js或者webpack.prod.js中引入
```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// 在配置plugins项中添加
plugins: [
    new BundleAnalyzerPlugin() // 使用默认配置，启动127.0.0.1:8888
],
```
当运行`npm run build`可以看到新开的窗口，能够分析项目各个模块的尺寸。  
![示例](http://www.cjwddz.cn/static/blog/img/webpack-analyzer.png)  
此外，查看端口占用
```bash
lsof -i:8888
```