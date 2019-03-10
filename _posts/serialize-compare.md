---
layout: post
title: "js几种序列化/反序列化方法比较"
date: 2018-05-29 15:31
realDate: 2018-05-29 15:31
toc: true
tags: 
	- 前端
	- 性能
---

公司IM项目是桌面应用，在运行期间同时存在服务进程和页面渲染进程。数据从服务进程接收，处理到传递给页面进程，期间至少需要2次反序列化和一次序列化。这使得项目在运行期间占用的资源非常多，4G的机器很容易峰值可以刷上90%+。
刚好同事分享了fast-json的文章，我自己写了简单的测试代码对几种序列化下比较。
<!-- more -->
方法包括：原生的JSON，fast-json和protobuf
其中，fast-json和protobuf都需要提前指定对象结构。

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

结果特别特别出乎意料。。  
原生的JSON表现是最好的，当测试次数为1000或者更多的时候，在单次用时比例会快速下降，由此猜测，nodejs底层对原生JSON处理应该是做了很大优化的。  
fast-json表现稳定，但是各方面还是远远比不上原生JSON,而且使用上更为不方便，项目没有体现优势。  
protobuf在脚本语言的表现却很让人失望，好在序列化后的字节不到json的一半。仍有很大的优势。  

