---
layout: post
title: "vue源码,从第一个Commit开始"
date: 2018-05-05 18:00
comments: true
tags: 
	- 前端 
	- vue源码
---

今天算是第一天吧.虽然一直在写着代码,可是感觉很空很空,觉得做的大部分东西都是花时间就可以做好的,并没有什么深度.
那就看看源码了吧,学习下那些炙手可热的!从手边的工具开始,决定了就看vue.按知乎上说的,从第一个commit,从第一个版本开始看.

给自己的目标:

- 第一,加强javascript编程
- 第二,学习vue设计思想
- 第三,在学习完毕尝试参与项目,提交代码.

阅读方式,自顶而下,尽量从**项目结构设计到细微实现**.

<!--more-->
### vue 从第一个commit开始

作为一个'将大有作为'的项目,在第一个commit的往往包含了项目的灵魂.在第一个版本也一定包含了项目最核心的东西.

vue的第一个commit叫'init',没有什么特别的,作者是yyx990803.

#### .babelrc
**利用 Babel把 ES2015语法编译成 ES5.**  
es5,es6分别指ECMAScript第几版修改,es2015,es2016指哪年完成的标准化,而es6就是es2015不要搞混.
**.babelrc文件**
```javascript
{
  "env": {
    "development": {
      "presets": ["es2015", "stage-2"]
    },
    "production": {
      "presets": ["es2015-rollup", "stage-2"]
    }
  }
}
```

#### src/index.js文件 [0]
获取 vue实例,安装全局Api
同时定义了 vue的版本**Vue.version**
延迟检测并初始化 **vue-devtools**,不存在并且不处于生产模式的情况下控制台会提示下载.
```javascript
import Vue from './instance/vue'
import installGlobalAPI from './global-api'
import { inBrowser, devtools } from './util/index'
import config from './config'

installGlobalAPI(Vue)

Vue.version = '1.0.28-csp'

export default Vue

// devtools global hook
/* istanbul ignore next */
setTimeout(() => {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue)
    } else if (
      process.env.NODE_ENV !== 'production' &&
      inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)
    ) {
      console.log(
        'Download the Vue Devtools for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      )
    }
  }
}, 0)

```

#### 从[0]跳转,查看 installGlobalAPI实现

结合**vue.js**发现,作者在设计Vue的过程通过**以下类似方法**一层层的赋予vue对象各种属性,方法.  
层次清晰明了,并且不同功能块拆分解耦的特别好.  
installGlobalAPI定义了大部分Vue的**全局方法和属性**,这里后面会写一篇细讲.  
// **src/global-api.js**文件
```javascript
export default function (Vue) {
    Vue.a = {}
    Vue.b = function(){
        // ...
    }
    // ...
}
```

#### src/instance/vue.js [1]
定义了 vue对象的内部方法和对象Api    
其中每个部分争取后边拆开讲.    
**此外**,该文件定义了,对于**全局方法属性添加前缀'$'**  
**内部方法和属性使用前缀'_'**  
**没有前缀**的方法和属性被假定为用户数据.这里用户应该是指当前的vue对象.  

-- 疑问:从下方代码发现**this._init(options)**,调用的主体还不知道.后边答疑.    
-- 答疑,在initMixin,Vue原型链被添加了_init方法  

```javascript
function Vue (options) {
  this._init(options)
}

// install internals
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
miscMixin(Vue)

// install instance APIs
dataAPI(Vue)
domAPI(Vue)
eventsAPI(Vue)
lifecycleAPI(Vue)
export default Vue
```

### 从[1],src/instance/internal/init.js

代码定位在[1]**initMixin(Vue)**  

该文件在 vue原型链添加了**_init**方法,option被设置为可选参数,对**每个vue实例,包括从拓展的构造函数产生的实例**,该方法都会被调用.  
- 每个vue对象都包含一个**_uid**的标志,按创建的顺序递增
- 在我们平常操纵的生命周期外,vue存在其它私有的周期函数和状态
- 添加自身到父组件 $children
- 在**_init**中调用各个声明周期函数

```javascript
let uid = 0
export default function (Vue) {
  Vue.prototype._init = function (options) {
    options = options || {}
    // ....略
    this._uid = uid++
    // 添加自身到父组件 $children
    if (this.$parent) {
      this.$parent.$children.push(this)
    }
    // **调用各个声明周期函数**
  }
}
```

-- 疑问:对象分别声明了**this._context**,**this._scope**,**this._frag**,对于他们各自的作用还不是很清楚,后面答疑.

```javascript
// context:
// if this is a transcluded component, context
// will be the common parent vm of this instance
// and its host.
this._context = options._context || this.$parent

// scope:
// if this is inside an inline v-for, the scope
// will be the intermediate scope created for this
// repeat fragment. this is used for linking props
// and container directives.
this._scope = options._scope

// fragment:
// if this instance is compiled inside a Fragment, it
// needs to register itself as a child of that fragment
// for attach/detach to work properly.
this._frag = options._frag
if (this._frag) {
  this._frag.children.push(this)
}
```

### 详讲

[State](/xxx)
