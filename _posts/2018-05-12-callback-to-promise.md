---
layout:     post
title:      Callback or Promise？
subtitle:   异步处理该如何选择？
date:       2018-05-12 10:15
author:     Youga
header-img: img/post-bg-ios9-web.jpg
catalog: 	 true
tags:
  - web
---

前端开发中有一些Api需要通过回调处理一些异步操作，但是对于我，更愿意是使用类似*Promise*的调用方式。那么什么时候我们使用回调函数什么时候使用*Promise*呢？

<!--more-->

## 将*callback*函数转换为*Promise*

> 假设我需要计算文件**sha256**值,由于读取文件是异步操作，我需要在*onloadend*的回调结果中处理*reader.result*

```javascript
uploadFile(file){
  let reader = new FileReader()
  reader.readAsBinaryString(file)
  reader.onloadend = () = >{
    let hashCode = this.SHA256.convertToSHA256(reader.result)
    // todo 
  }
}
```

> 使用*async*函数，*await*转换

```javascript
async uploadFile(file) {
  let fileBlob = await new Promise((resolve,reject)=>{
    let reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onloadend = () = >{
      resolve(reader.result)
    }
  })
  this.SHA256.convertToSHA256(fileBlob)
  // todo
}
```

## 自定义*Sleep*函数

```javascript
function Sleep (micsec) {
  return new Promise((resolve)=>{
    setTimeout(resolve, micsec)
  })
}
```

### 使用*Promise*避免多层嵌套的回调

```javascript
// 处理前
()=>{
  A.callback = (B)=>{
    B.callback = (C)=>{
      C.callback = (D)=>{
        // .....
      }
    }
  }
}
// 处理后
async ()=>{
  let B = await new Promise((resolve,reject) => { 
    A.callback = resolve 
  })
  let C = await new Promise((resolve,reject) => { 
    B.callback = resolve 
  })
  // ...
}
```

## *callback*一定可以转化成*Promise*写法？

答案是 no！回调函数和Promise本质上不是一回事，能够相互转化的场景是因为两者都能处理异步场景。

回调函数和Promise的区别至少在于：

- *callback*可以多次被回调并传入不同值

- *promise*拥有不可逆状态

从pending->fulfilled, pending->rejected的状态是不可逆的。譬如：

```javascript 
new Promise(res=>{
  console.log('only printed once.')
  res('finish.')
}).then(res=>{
  console.log(1,res)
}).then(res=>{
  console.log(2,res)
})
// 依次打印的值是：
// only printed once.
// 1 finish.
// finish.
```
可知，单个*Promise*状态是不能改变的（链式调用过程中可以改变promise状态），并且value或者error会被缓存下来。这个特性在需要设计中可以被利用。

而*callback*是可以被多次执行的，其参数相当于传递给下一层的value或error却是可以被多次改变的。例如：
```javascript 
function loadData(callback) {
  let finishLoad = false
  // 从缓存加载数据,一般比网络加载要快
  loadAtStorage().then(data=>{
    if (finishLoad || !data) {
      return
    }
    callback(data)
  })
  // 从网络加载
  loadAtNetwork().then(data=>{
    finishLoad = true
    callback(data)
  })
}
```
按正常情况看，加载数据函数中*callback*函数会先后被回调两次。第一次先使用本地数据同时等待网络数据加载完毕，更新网络数据。