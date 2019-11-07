---
layout: post
title: glut，运行在chrome的小程序框架
subtitle: 使用用命令行和android对话
date: 2019-11-01 10:36
author: Youga
header-img: https://static.cjwddz.cn/blog/img/post-bg-ios9-web.jpg
catalog: true
tags:
  - javascript
  - web
---

## 介绍

Glut 是一款[Chrome 插件](https://chrome.google.com/webstore/detail/glut/baggadcfggenanhadoapjamongmhjpla)。字面意思是供大于求的,反过来则是需要的都可以被满足,期望做一个价值取决于想象的项目。

项目的初衷是让前端开发者可以通过熟悉的技术栈，快速的开发一些小工具，并在团队中分享使用。

这里 Glut 相当于一个<span style="color: blue">**小程序容器**</span>, 前端开发可以在自己的项目中通过 npm 导入 glut-app-sdk，开发一个小程序。并在 glut 中调试，发布，同步给团队的其它成员。而不需要单独开发一个 chrome 拓展，等待漫长的审核。

了解 Glut 插件和开发细则可以参考[**仓库链接**](https://github.com/LeeLejia/glut/) , 顺便求 star~

glut 小程序和页面脚本关系：

![](https://user-gold-cdn.xitu.io/2019/11/6/16e3fc72d7a7676c?w=1812&h=1002&f=png&s=204971)

可以通过 glut 小程序实现的功能：
![](https://user-gold-cdn.xitu.io/2019/11/6/16e3fc7827db5c04?w=1596&h=856&f=png&s=155330)

## 技术细节

如果不想在官网教程上沙里淘金，chrome 插件开发可以参考[小茗同学博客](http://blog.haoji.me/chrome-plugin-develop.html),博客也提供了 vscode 插件开发教程,内容少但是比较容易看。

**chrome 拓展相关的概念如下：**
![详情目录](https://user-gold-cdn.xitu.io/2019/11/6/16e3faaffbb55e8c?w=1099&h=551&f=png&s=72956)

我们可以在 chrome 拓展中使用应用 5 种类型的 js,这 5 种类型的 js 都是环境隔离的，并且运行的时机不同。  
glut 同时使用到了 injected,background,popup 3 种。这几种脚本在不同阶段发挥着作用。

1.当浏览器启动时，background 脚本被运行。插件激活状态下，脚本一直运行在后台, 并且 background 脚本拥有无限跨域的能力，可以调用 devtools 以外所有的 Chrome 扩展 API。glut 小应用的跨域能力正源于此。  
从服务器更新配置和小程序上传下载也由 background 脚本负责。

2.当用户点击浏览器右上角图标时在 manifest.browser_action 配置的页面和脚本被加载，即 popup 脚本。  
popup 脚本的周期在点插件图标的时候开始，当鼠标点击页面时，popup 脚本的周期结束。popup 展示插件的功能面板。 通过一对 chrome.runtime 消息通道封装成远程调用方法，popup 和 background 得以通信，当在 popup 面板上选中一个未被下载的小程序时，popup 远程调用 background 的下载方法。同样的，更新和发布小程序时 popup 都依靠 background 来完成。

3.popup 在打开小程序时，首先通过 chrome.tabs.executeScript 向页面注入一小段代码，检查页面是不是曾经加载过小程序。这里注入页面的代码实际上和页面脚本是不同的环境来的，但共享了 document 对象。如果没有，则在页面环境加载一份 inject 代码和小程序的公共样式文件。inject 代码包括了所有小程序的公共代码，在页面加载多个小程序时，只加载一份。此外，inject 通过创建 script 标签的方式往页面脚本环境注入一份包含封装消息通道实现的远程调用实例，从而达到小程序和页面脚本的通信，小程序可以通过 sdk.runAtPage，在页面脚本环境执行代码。
