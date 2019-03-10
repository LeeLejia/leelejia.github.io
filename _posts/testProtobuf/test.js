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