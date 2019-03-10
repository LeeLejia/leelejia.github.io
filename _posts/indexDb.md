---
layout: post
title: "从网盘存储学indexDb"
date: 2018-05-02 17:20
comments: false
reward: false
toc: true
tags: 
	- 前端
---

由于公司的im客户端是桌面版的 web App，通过electron我们可以将许多的数据缓存到本地，比如聊天记录，用户头像，图片小视频等。我负责网盘插件，网盘部分包括了私有空间和公有空间以及群共享空间。私有盘的数据记录一般不会特别多，但是公有空间和群空间的记录是非常多的。在需求中，我们的网盘插件需要提供给用户分类和搜索功能。作为一个被高频使用到的插件，我想把大量的数据缓存到本地，以此减轻服务器压力，加快页面响应速度。由于前期对indexDb还不熟悉，我临时用了 localStore做为存储。  
localStory只允许简单的key-value存储，以房间作为key，每次存取将越来越多的大量数据序列化，然后写入。这是特别糟糕的设计。选用 indexDb对业务和功能实现要合适得多。
<!--more-->

### indexDb

indexDb在使用上包括了以下特点：

- 支持链式调用
- 仍然是key-value（object）方式存储，每个记录可以被多个index（相当于keys）索引
- 允许通过 index或者store对记录进行条件筛选
- 操作事务时如果进行延时操作，则事务会失效
- 可以直接存取对象，不需要手动序列化
- indexDb除了 keyPath指定的属性外，对象不需要有固定的成员

缺点：

- 不支持排序，要在数据拿出来之后手动排序
- 多属性查询好像只能是 only查询相等记录，不支持更多的表达式
- 感觉兼容不好，许多 Api在 electron测试是不起作用的
- 当然了，以上只是我的学习使用后的感受，可能有好的解决方案，而我缺乏了解 = =


### indexDb回调函数

- onupgradeneeded
    调用indexedDB.open,如果**指定数据库不存在**，**数据库版本不同**，则先调用onupgradeneeded,而后才可能调用onsuccess
```javascript
let request = window.indexedDB.open('testdb')
request.onerror = ()=>{console.log('error')}
request.onsuccess = () =>{console.log('success')}
request.onupgradeneeded = ()=>{console.log('upgrade')}
/*
第一次运行（数据库不存在的情况下）：
    upgrade
    success
第二次运行（数据库存在，不再调用onupgradeneeded）:
    success
**/
```

### indexDb初始化

```javascript
  // 打开数据库
  var DBOpenRequest = window.indexedDB.open("toDoList", 4)
  
  // 打开失败，在用户不授权或者隐身模式下发生
  DBOpenRequest.onerror = function(event) {
    note.innerHTML += '<li>Error loading database.</li>'
  };
  
  DBOpenRequest.onsuccess = function(event) {
    note.innerHTML += '<li>Database initialised.</li>'
    // 保存数据库对象
    db = DBOpenRequest.result
    // 处理业务
    displayData()
  };
 
  // 数据库未被创建或版本号不同时回调该函数
  DBOpenRequest.onupgradeneeded = function(event) {
    var db = event.target.result;
    
    db.onerror = function(event) {
      note.innerHTML += '<li>Error loading database.</li>'
    };

    // 创建objectStore
    var objectStore = db.createObjectStore("toDoList", { keyPath: "taskTitle" })
    // db.createObjectStore('chart',{ keyPath:"goodId", autoIncrement:true })
          
    // 定义字段
    objectStore.createIndex("hours", "hours", { unique: false })
    objectStore.createIndex("minutes", "minutes", { unique: false })
    objectStore.createIndex("day", "day", { unique: false })
    objectStore.createIndex("month", "month", { unique: false })
    objectStore.createIndex("year", "year", { unique: false })
    objectStore.createIndex("notified", "notified", { unique: false })
    
    note.innerHTML += '<li>Object store created.</li>'
  }
```

### indexDb 索引index

indexDb被设计于存储大量数据，为迅速定位数据，提高搜索速度，便需要在indexDb中加入索引。
在indexedDB中有两种索引，一种是自增长的int值，一种是keyPath：自己指定索引列，我们重点来看看keyPath方式的索引使用.

```javascript
var store=db.createObjectStore('students',{keyPath: 'id'})
store.createIndex('nameIndex','name',{unique:true})
store.createIndex('ageIndex','age',{unique:false})
/*
createIndex 参数分别指：索引名称，索引属性字段名，索引属性值是否唯一
**/
```

**通过多个属性索引和多条件查询**

如果不建立索引，就只能直接查出所有数据再做过滤，那就完全没办法利用 IndexedDB的性能优势了。

```javascript
// In onupgradeneeded
var store = db.createObjectStore('mystore');
store.createIndex('myindex', ['prop1','prop2'], {unique:false});

// In your query section
var transaction = db.transaction('mystore','readonly');
var store = transaction.objectStore('mystore');
var index = store.index('myindex');
// Select only those records where prop1=value1 and prop2=value2
var request = index.openCursor(IDBKeyRange.only([value1, value2]));
// Select the first matching record
var request = index.get(IDBKeyRange.only([value1, value2]));
```

### indexDb 事务和数据操作

- 添加记录
  store.add(newItem[0])
  例如store除了keyPath，同时有两个key：id（unique）和type （not unique）
  插入数据时，**允许没有type和id属性，除非其中一个是keyPath**
  如果 **id或者keyPath相同**则替换记录，如果 type相同则添加记录

- 删除记录 
  store.delete(2) - delete方法的参数是数据的 keyPath值

- 更新记录 
  store.put(o) - put 参数名称需与add 参数名称一样
  当键值相同时，整个记录进行替换而非仅仅替换更改的属性
  如： 
    store.put({id:1,a:1,b:2})
    store.put({id:1,a:2})       // 最终结果不只修改了 a同时删除了 b
    
```javascript
// 等待插入的数据
var newItem = [ { taskTitle: "Walk dog", hours: 19, minutes: 30, day: 24, month: "December", year: 2013, notified: "no" } ]

// 判断Store是否存在
if(!db.objectStoreNames.contains('toDoList')){
    // ...
}

// 打开一个read/write 事务
var transaction = db.transaction(["toDoList"], "readwrite")
// 或者
// db.transaction('info', 'readonly');
// var store = tx.objectStore('info');

// 打开事务成功回调
transaction.oncomplete = function(event) {
    // ...
}
// 失败回调
transaction.onerror = function(event) {
    // ...
}

// 在事务中创建 object store
var objectStore = transaction.objectStore("toDoList")

// 添加记录
var objectStoreRequest = objectStore.add(newItem[0])
// 删除记录 objectStore.delete(2) - delete方法的参数是数据的键值
// 更新记录 var request = objectStore.put(o) - put 参数名称需与add 参数名称一样

// 添加到事务成功，**并不代表已经存储到 Db**
objectStoreRequest.onsuccess = function(event) {
// report the success of the request (this does not mean the item
// has been stored successfully in the DB - for that you need transaction.oncomplete)
note.innerHTML += '<li>Request successful.</li>';
}
```

### indexDb 查询

indexDb提供对 store或 store.index进行查询的方法，可以通过游标和指定游标范围

游标方法：
  - openKeyCursor()
  - IDBKeyRange.only(value): 只获取指定值
  - IDBKeyRange.lowerBound(value,isOpen)
  - IDBKeyRange.upperBound(value,isOpen)
  - IDBKeyRange.bound(value1,value2,isOpen1,isOpen2) // isOpen 指开闭区间

```javascript
var trans = db.transaction(["chart"], "readonly") 
var store = trans.objectStore("chart")    

// 通过迭代遍历
var cursor = store.openCursor()
// 设置游标遍历条件，可以从 store.index('XX')获取游标
// var request=index.openCursor(IDBKeyRange.bound('B','F',false,true));
cursor.onsuccess=function(e){
    var cursor=e.target.result;
    if(cursor){
        var student=cursor.value;
        console.log(student.id);
        cursor.continue();
    }
}
// 索引查询
var t = db.transaction(["o"],"readonly");
var store = t.objectStore("o");
var index = store.index("M");

var request = index.get(x);
```

### 完整例子

```javascript
class IndexDbHelper {
  constructor() {
    this.dbName = 'fino-netdisk'
    this.dbVersion = 3
    this.StoreName = 'netFile'
    this.prepare = false
    this.init = () => new Promise((resolve, _) => {
      const request = window.indexedDB.open(this.dbName, this.dbVersion)
      request.onerror = () => {
        resolve({ status: false, msg: Error('连接数据库失败！请检查是否已经授权页面访问存储') })
      }
      request.onupgradeneeded = (event) => {
        // create db
        const db = event.target.result
        const store = db.createObjectStore(this.StoreName, { keyPath: 'key' })
        // store.createIndex('name', 'name', { unique: false })
        store.createIndex('roomId', 'roomId', { unique: false })
        // store.createIndex('type', 'type', { unique: false })
        // store.createIndex('origin', 'origin', { unique: false })
        // store.createIndex('labels', 'labels', { unique: false })
        // store.createIndex('uploadTime', 'uploadTime', { unique: false })
      }
      request.onsuccess = (event) => {
        this.db = event.target.result
        resolve({ status: true })
      }
    })
    this.init().then((result) => {
      this.prepare = result.status
      if (!result.status) {
        console.error(result.msg)
      }
    })
  }
  insert(objs) {
    if (!this.prepare) {
      console.log('warn: indexDb has no prepare')
      setTimeout(() => { this.insert(objs) }, 0)
      return
    }
    const objStore = this.db.transaction([this.StoreName], 'readwrite').objectStore(this.StoreName)
    if (!Array.isArray(objs)) {
      const tObj = objs
      tObj.key = `${objs.roomId}-${objs.id}`
      objStore.put(tObj)
      return
    }
    objs.forEach((element) => {
      const tObj = element
      tObj.key = `${element.roomId}-${element.id}`
      const result = objStore.put(tObj)
      result.onsuccess = () => {
        // console.log('insert: +1')
      }
      result.onerror = () => {
        console.log('insert: -1')
      }
    })
  }
  delete(objs) {
    if (!this.prepare) {
      console.log('warn: indexDb has no prepare')
      setTimeout(() => { this.delete(objs) }, 0)
      return
    }
    const objStore = this.db.transaction([this.StoreName], 'readwrite').objectStore(this.StoreName)
    if (!Array.isArray(objs)) {
      objStore.delete(`${objs.roomId}-${objs.id}`)
      return
    }
    objs.forEach((obj) => {
      const result = objStore.delete(`${obj.roomId}-${obj.id}`)
      result.onsuccess = () => {
        // console.log('delete: +1')
      }
      result.onerror = () => {
        console.log('delete: -1')
      }
    })
  }
  query(indexName, { min, max, value }, callback) {
    if (!this.prepare) {
      console.log('warn: indexDb has no prepare')
      setTimeout(() => { this.query(indexName, { min, max, value }, callback) }, 0)
      return
    }
    const index = this.db.transaction([this.StoreName], 'readonly').objectStore(this.StoreName).index(indexName)
    if (min && max) {
      index.openCursor(IDBKeyRange.bound(min, max, true, true)).onsuccess = callback
    } else if (min) {
      index.openCursor(IDBKeyRange.lowerBound(min, true)).onsuccess = callback
    } else if (max) {
      index.openCursor(IDBKeyRange.upperBound(max, true)).onsuccess = callback
    } else if (value) {
      index.openCursor(IDBKeyRange.only(value)).onsuccess = callback
    } else {
      index.getAll().onsuccess = callback
    }
  }
}

export default IndexDbHelper
```
