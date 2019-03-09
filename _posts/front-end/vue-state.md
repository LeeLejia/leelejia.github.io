---
layout: post
title: "vue源码,$data的实现"
date: 2018-05-05 20:00
comments: true
tags: 
	- 前端 
	- vue源码
---

## vue-State

源码:**src/instance/internal/state.js**

从src/instance/vue.js定位**stateMixin(Vue)**跳转,开始看到我们熟悉的东西了.

<!--more--> 
#### **$data**的设计
添加 `$data`访问器到Vue原型链
```javascript
 Object.defineProperty(Vue.prototype, '$data', {
    get () {
      return this._data
    },
    set (newData) {
      if (newData !== this._data) {
        this._setData(newData)
      }
    }
  })
```
其中,**this._setData(newData)**实现如下:
```javascript
 Vue.prototype._setData = function (newData) {
    newData = newData || {}
    var oldData = this._data
    this._data = newData
    var keys, key, i
    // unproxy keys not present in new data
    keys = Object.keys(oldData)
    i = keys.length
    while (i--) {
      key = keys[i]
      if (!(key in newData)) {
        this._unproxy(key)
      }
    }
    // proxy keys not already proxied,
    // and trigger change for changed values
    keys = Object.keys(newData)
    i = keys.length
    while (i--) {
      key = keys[i]
      if (!hasOwn(this, key)) {
        // new property
        this._proxy(key)
      }
    }
    oldData.__ob__.removeVm(this)
    observe(newData, this)
    this._digest()
  }
```
大概就是在**$data**被设置的时候,要和oldData的**keys**做比较,
已经不存在的keys移除代理**this._unproxy(key)**,相反的,为增加的keys添加代理**this._proxy(key)**  
最后,将oldData和vue实例的绑定关系取消,已免内存泄漏.同时绑定newData和vue实例的关系.

以上,包括了**this._unproxy(key)**,**this._proxy(key)**,**observe**,如下:

- **isReserved(key)** 被设计来检测key是否包含'_','$'前缀,以此防止和全局定义冲突,所以我们在项目中也不要在单独实例中用到这两个前缀!

// proxy实现
```javascript
Vue.prototype._proxy = function (key) {
if (!isReserved(key)) {
  // need to store ref to self here
  // because these getter/setters might
  // be called by child scopes via
  // prototype inheritance.
  var self = this
  Object.defineProperty(self, key, {
    configurable: true,
    enumerable: true,
    get: function proxyGetter () {
      return self._data[key]
    },
    set: function proxySetter (val) {
      self._data[key] = val
    }
  })
}
}
Vue.prototype._unproxy = function (key) {
  if (!isReserved(key)) {
    delete this[key]
  }
}
```

// observe定义见下一篇.
