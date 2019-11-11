---
layout: post
title: glut，运行在chrome的小程序框架
subtitle: Glut 字面意思是供大于求的,反过来则是需要的都可以被满足,期望做一个价值取决于想象的项目。
date: 2019-11-01 10:36
author: Youga
header-img: https://source.unsplash.com/900x400/?google,chrome&a=1232
catalog: true
tags:
  - javascript
  - web
---

## 介绍

Glut 是一款[Chrome 插件](https://chrome.google.com/webstore/detail/glut/baggadcfggenanhadoapjamongmhjpla), 字面意思是供大于求的，反过来则是需要的都可以被满足。

项目的初衷是让前端开发者可以通过熟悉的技术栈，快速的开发一些小工具，并在团队中分享使用。是`"写个脚本处理下"`的进阶方案。因为它可以做一些浏览器脚本做不到的事，是比`Tampermonkey`更强大的工具。

这里 Glut 相当于一个[**小程序容器**](https://github.com/LeeLejia/glut/), 前端开发可以在自己的前端项目中导入 sdk，在 glut 中调试、发布，同步给团队的其它成员。而不需要单独开发一个 chrome 拓展，等待漫长的审核。

glut 小程序和页面脚本关系：

![](/img/2019-11-01/glut-1.png)

可以通过 glut 小程序实现的功能：

![](/img/2019-11-01/glut-2.png)

## 技术细节

如果不想在官网教程上沙里淘金，chrome 插件开发可以参考[小茗同学博客](http://blog.haoji.me/chrome-plugin-develop.html),博客也提供了 vscode 插件开发教程,内容少但是比较容易看。

**chrome 拓展相关的概念如下：**

![详情目录](/img/2019-11-01/glut-3.png)

在 chrome 拓展中包括了 5 种类型的 js，这几种 js 都是环境隔离的，并且运行的时机不同。  
glut 同时使用到了 injected,background,popup 3 种。这几种脚本在不同阶段发挥着作用。

- 1.当浏览器启动时，background 脚本被运行。插件激活状态下，脚本一直运行在后台, 并且 background 脚本拥有无限跨域的能力，可以调用 devtools 以外所有的 Chrome 扩展 API。glut 小应用的跨域能力正源于此。  
  从服务器更新配置和小程序上传下载也由 background 脚本负责。

- 2.当用户点击浏览器右上角图标时在 manifest.browser_action 配置的页面和脚本被加载，即 popup 脚本。  
  popup 脚本的周期在点插件图标的时候开始，当鼠标点击页面时，popup 脚本的周期结束。popup 展示插件的功能面板。 通过一对 chrome.runtime 消息通道封装成远程调用方法，popup 和 background 得以通信，当在 popup 面板上选中一个未被下载的小程序时，popup 远程调用 background 的下载方法。同样的，更新和发布小程序时 popup 都依靠 background 来完成。

- 3.popup 在打开小程序时，首先通过 chrome.tabs.executeScript 向页面注入一小段代码，检查页面是不是曾经加载过小程序。这里注入页面的代码实际上和页面脚本是不同的环境来的，但共享了 document 对象。如果没有，则在页面环境加载一份 inject 代码和小程序的公共样式文件。inject 代码包括了所有小程序的公共代码，在页面加载多个小程序时，只加载一份。此外，inject 通过创建 script 标签的方式往页面脚本环境注入一份包含封装消息通道实现的远程调用实例，从而达到小程序和页面脚本的通信，小程序可以通过 sdk.runAtPage，在页面脚本环境执行代码。

### glut 应用对高权限 Api 的访问

在`background`和`inject`之间存在`chrome.runtime.onMessage`和`chrome.runtime.sendMessage`两个消息通道,将其封装成一个远程方法调用的实例。从而, `inject`可以调用部分`background`的方法。

```javascript
// inject
function RMI(name, ...args) {
  const method = rmiMap[name];
  if (method) {
    return Promise.resolve(rmiMap[name](...args));
  }
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: "invoke",
        name,
        args
      },
      resolve
    );
  });
}

// invoke
RMI("loadScript", key).then((res) => {
  if (res.status !== 0) {
    console.log(`load script failed: status=${res.status}`);
    return;
  }
});
```

```javascript
// background
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // 调用方法
  if (message.type === "invoke") {
    const method = remoteMethods[message.name];
    if (!method) {
      console.log(`unfounded method: ${message.name}`);
      sendResponse({
        status: -1,
        msg: "远程方法不存在"
      });
      return;
    }
    const result = method.apply(remoteMethods, message.args);
    if (result instanceof Promise) {
      result
        .then((res) => {
          sendResponse({
            status: 0,
            result: res
          });
        })
        .catch((err) => {
          sendResponse({
            status: -1,
            result: err
          });
        });
      return;
    }
    sendResponse({
      status: 0,
      result
    });
  }
});
```

### glut 应用的更新策略

每次打开浏览器或者手动选择更新时, glut 向服务器请求最新的小程序清单。清单列表包括了每个小程序的 appId 和更新时间。程序 diff 新的旧的列表,将待更新和已删除的小程序从本地删除。在用户第一次打开小程序的时候，小程序被下载并记录到清单。

### glut 应用的样式隔离和环境隔离

每个 glut 应用都包含了一系列公共选择器和私有选择器,使用 appId 标志。
在开发 Glut 应用时应使用`scoped style`,避免应用样式污染全局样式。由于一些框架是根据源码的文件名和路径名`hash`生成组件 id。多个小程序同时打开的时候可能因为 id 相同,本应该是隔离的样式互相影响了。可以通过使用小程序的 appId 作为 css 根选择器。appId 在 glut-app-sdk 中获取,然而小程序是在发布的时候后天才会分配一个 appId,调试阶段的 appId 只是一个占位字符串。

将全局样式和小程序样式隔离比较难。目前是通过 glut 公共选择器复写一遍默认样式,这样可以隔绝大部分的样式覆盖,并无法完全避免问题。

### 相关链接

- [商店下载](https://chrome.google.com/webstore/detail/glut/baggadcfggenanhadoapjamongmhjpla)
- [Github 仓库](https://github.com/LeeLejia/glut/)
- [SDK 用法](https://www.npmjs.com/package/glut-app-sdk)
- [Glut 应用模板](https://github.com/LeeLejia/glut-vue-demo)
