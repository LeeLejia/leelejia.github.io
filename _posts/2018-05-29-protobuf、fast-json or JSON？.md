---
layout: post
title:  protobuf、fast-json or JSON？
subtitle: js几种序列化/反序列化方法比较
date: 2018-05-29 15:31
author: Youga
header-img: https://source.unsplash.com/900x400/?computer,phone,cat,dog
catalog: 	 true
tags:
  - web
---


公司项目是electron应用，运行期间同时存在`node`进程和页面渲染进程, 数据从服务进程接收，处理到传递给页面进程，期间需要多次序列化和反序列化。由于IM系统对每个消息进行已读订阅回调。这使得项目在运行期间占用的cpu和内存较高，特别是进程间的数据通信方式，需要优化。

多次讨论，同事分享了fast-json的文章，我自己写了简单的测试代码对几种序列化下比较。

<!-- more -->
方法包括：`fast-json` 、 `protobuf` 和 原生`JSON`

其中，`fast-json` 、 `protobuf` 都需要提前确定对象结构，或者记录对象属性内存地址偏移值，这也是众多序列化库提速的关键。


### 相关链接

[fast-json](https://github.com/fastify/fast-json-stringify)  
[protobuf](https://developers.google.com/protocol-buffers/docs/reference/javascript-generated#singular-scalar-proto3)  

### protobuf使用

- 构造proto文件
```proto
syntax = "proto3";
message FinoMsg {
  message User {
	int32 id = 1;
	string name = 2;
	bool roomMaster = 3;
  }
  message Content {
    message Img {
      string url = 1;
      int32 width = 2;
	    int32 height = 3;
    }
	string text = 1;
	Img img = 2;
  }
  string id = 1;
  User user = 2;
  string roomId = 3;
  Content content = 4;
}
```

- 编译成javascript  

运行脚本之后得到finoMsg_pb.js

```bash
./protoc-3.5.1-1-windows-x86_64.exe --js_out=import_style=commonjs,binary:. finoMsg.proto
```

### 测试脚本
```javascript
// test.js
var protobuf = require("protobufjs")
var {FinoMsg} = require('./finoMsg_pb')
const fastJson = require('fast-json-stringify')
var testModal = {
    id: 123,
    user:{
        id:1,
        name: "滴滴",
        roomMaster: false
    },
    roomId: "sslaglsjflsjflsfsgfws",
    content: {
        text: "这是测试消息",
        img: {
        url: "www.baidu.com",
        width: 240
        }
    }
}
var msg = new FinoMsg()
var content = new FinoMsg.Content()
var img = new FinoMsg.Content.Img()
var user = new FinoMsg.User()
img.setUrl("www.baidu.com")
img.setWidth(240)
user.setId(1)
user.setName("滴滴")
user.setRoommaster(false)
content.setText("这是测试消息")
content.setImg(img)
msg.setId(123)
msg.setRoomid("sslaglsjflsjflsfsgfws")
msg.setContent(content)
msg.setUser(user)

const TEST_COUNT = 1000
console.time(`protobuf序列化${TEST_COUNT}次用时`)
for(let i = 0;i<TEST_COUNT;i++){
    var bitData = msg.serializeBinary()
}
console.log(`protobuf序列化后为：${bitData.length}字节`)
console.timeEnd(`protobuf序列化${TEST_COUNT}次用时`)

console.time(`protobuf反序列化${TEST_COUNT}次用时`)
for(let i = 0;i<TEST_COUNT;i++){
    FinoMsg.deserializeBinary(bitData)
}
console.timeEnd(`protobuf反序列化${TEST_COUNT}次用时`)

console.time(`JSON序列化${TEST_COUNT}次用时`)
for(let i = 0;i<TEST_COUNT;i++){
    var bitData = JSON.stringify(testModal)
}
console.log(`JSON序列化后为：${bitData.length}字节`)
console.timeEnd(`JSON序列化${TEST_COUNT}次用时`)
console.time(`JSON反序列化${TEST_COUNT}次用时`)
for(let i = 0;i<TEST_COUNT;i++){
    JSON.parse(bitData)
}
console.timeEnd(`JSON反序列化${TEST_COUNT}次用时`)

const stringify = fastJson({
    title: 'Example Schema',
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
      roomId: {
        type: 'string',
        default: ''
      },
      user: {
        type: 'object',
        properties: {
            id: {
              type: 'number'
            },
            name:{
                type: 'string'
            },
            roomMaster:{
                type: 'boolean'
            }
        },
      },
      content: {
        type: 'object',
        properties: {
            text: {
              type: 'string'
            },
            img:{
                type: 'object',
                properties: {
                    width: {
                      type: 'number'
                    },
                    url:{
                        type: 'string'
                    },
                },
            }
        },
      }
    }
  })

console.time(`fast-json序列化${TEST_COUNT}次用时`)
for(let i = 0;i<TEST_COUNT;i++){
    var bitData = stringify(testModal)
}
console.log(`fast-json序列化后为：${bitData.length}字节`)
console.timeEnd(`fast-json序列化${TEST_COUNT}次用时`)
```


运行


```bash
node .\test.js


```
### 结果比较

|方法|次数|用时（序列化/反序列化）|序列化后大小|
|--|--|--|--|--|
|protobuf|1|1.579ms/0.967ms|77字节|
|JSON|1| 0.194ms/0.029ms|160字节|
|fast-json|1| 0.946ms/--|160字节|
|protobuf|100|6.514ms/3.871ms|77字节|
|JSON|100|0.424ms/0.358ms|160字节|
|fast-json|100| 1.363ms/--|160字节|

没想到结果出乎意料。原生JSON的表现是最好的，当测试次数为1000或者更多的时候，在单次用时比例会快速下降，由此猜测，`js`底层对`JSON`处理做了优化。  
`fast-json`表现稳定，但是比不上原生JSON, 项目好像没有体现优势。  
`protobuf` 的表现差，但其优势在于序列化后的字节占用不到json的50%，有一定优势。分析，`protobuf`原本通过计算属性内存偏移量工作，但是在js中是无法直接操作对象内存的，于是处理速度上并没有优势。

