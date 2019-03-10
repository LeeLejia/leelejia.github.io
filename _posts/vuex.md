---
layout: post
title: "vue项目中的状态管理"
date: 2018-04-06 21:15
comments: true
toc: true
tags: 
	- 前端 
	- vue
---

目前,前端开发的三大框架都是基于组件式的开发,将不同的功能拆开分别开发,能最大程度的复用代码,也利于并行开发.
然而,在整个项目构建的过程中,当我们各个独立开发的组件协同合作的时候,我们需要到组件之间,组件和服务之间进行通信,共享状态,
对状态的变化进行及时的通知.  
简单的,我们大可以将**state和action**都挂载到window,document等全局对象上,以此共享给全部组件.当然,这是不理想.在我们的项目足够大的时候,
变量名容易重复,状态难以分类管理.所以我们需要一些良好的设计,这也是**vuex**的产生的原因.

<!--more-->

### 关于vuex

React最主要的状态管理框架是Redux,它是可以和Vue一起使用的,但是更好的选择是Vuex.
它借鉴了Flux,Redux和The Elm Architecture,是专门为Vue.js设计的状态管理库.总而言之,我们有理由选择它.

- 什么情况下我们应该使用vuex?

官网是这样建议的:

    虽然 Vuex 可以帮助我们管理共享状态，但也附带了更多的概念和框架。  
    这需要对短期和长期效益进行权衡。  
    
    如果您不打算开发**大型单页应用**，使用 Vuex 可能是繁琐冗余的。  
    确实是如此——如果您的应用够简单，您最好不要使用 Vuex。  
    一个简单的 global event bus 就足够您所需了。  
    但是，如果您需要构建一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。  
    引用 Redux 的作者 Dan Abramov 的话说就是：**Flux 架构就像眼镜：您自会知道什么时候需要它。**
    
    
    
### store

Vuex应用的核心就是**store**,它包含了应用的大部分状态(**state**)  
vuex和全局对象的不同点:

- Vuex 的状态存储是**响应式**的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
- 你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

我们通过use来使用vuex:
```javascript
Vue.use(Vuex)
```
创建一个**Store**:
```javascript
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```
修改状态:  
我们只能通过commit一个mutations去改变状态,这样是为了让我们的操作有机会被记录,便于调试(在项目运行阶段,我们需要去寻找那里的代码更改了状态)
```javascript
store.commit('increment')
console.log(store.state.count) // -> 1
```

### 核心概念之 State

Vuex使用**单一状态树**,即一个对象包含全部应用层级状态,这意味着一个应用应该是**一个Store实例**.

- 如何获取vuex状态?
由于vuex状态存储是响应式的,所以从store中读取状态最简单的方法就是直接在**computed**中返回某个状态
```javascript
computed: {
    count () {
      return store.state.count
    }
}
```
从以上用法,发现我们需要在每个使用的组件导入**store**,这容易让人烦躁.当然有好的做法.  
首先,我们已经在一开始就向Vue注入了vuex了:
```javascript
Vue.use(Vuex)
```
通过vuex的一些机制,我们可以直接在根部组件Vue实例化的时候给予store选项,并且这个对象将被注入到每个子组件Vue中,以便于我们随处调用.
```javascript
const app = new Vue({
  el: '#app',
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```

在子组件中调用:
```javascript
computed: {
    count () {
      return this.$store.state.count
    }
  }
  
```

- 多数时候computed映射state的方法是类似的,有没有更简单的做法?

vuex提供了**mapState**,用于简化**state**映射到computed的过程:
```javascript
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'
computed: {
  localComputed () { /* ... */ },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

### 核心概念之 Getter

**Getter**类似于Vue中的**computed**,**Getter**属性的值在依赖被更改前将会缓存于vuex系统.  
当然了,Getter和State同样应该在vue的computed属性中被使用,除了分别在state,getter属性,其用法相同.    
由于相对与vue组件,vuex的Getter和State都是**响应式**的,所以它的值应该被缓存.
```javascript
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

- Getter 接受 state 作为其第一个参数：
```javascript
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```
- Getter 也可以**接受其他 getter **作为第二个参数：
```javascript
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
store.getters.doneTodosCount // -> 1
```

- 让 getter 返回一个函数，来实现给 getter 传参:  
*!!!!!注意，getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果。*
```javascript
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```
相同的,我们使用**mapGetters**映射Getter:
```javascript
computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // 映射 `this.doneCount` 为 `store.getters.doneTodosCount`
      doneCount: 'doneTodosCount',
      // ...
    ])
}
```
### 核心概念之 Mutation

更改 Vuex 的 store 中的状态的唯一方法是提交 mutation.  
如下例子,**increment**的第一个参数是state,是不需要在commit中提供的!
```javascript
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
     increment (state, n) {
        state.count += n
     }
  }
})

store.commit('increment', 10)
// 或者
store.commit({
  type: 'increment',
  amount: 10
})
```
更好的设计是,每个mutations仅包含两个参数**state**和**payload**,其中,payload相当于一个参数集合.

```javascript
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
store.commit('increment', {
  amount: 10
})
```
其它:  
- *使用常量替代 Mutation 事件类型* 
使用常量替代 mutation，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然.  
```javascript
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```
- Mutation 必须是同步函数

任何在回调函数中进行的状态的改变都是不可追踪的。这违背了vuex的设计初衷!

- 同样的,我们可以使用**mapMutations**,映射mutations到**methods**
```javascript
import { mapMutations } from 'vuex'
export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

### 核心概念之 Action

Action 类似于 mutation，不同在于：
- Action 提交的是 mutation，而不是直接变更状态。
- Action 可以包含任意异步操作。

```javascript
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
    // 或者
    increment ({ commit }) {
        commit('increment')
    }
  }
})
```
分发Action:  

Action 通过 store.dispatch 方法触发  

```javascript
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}

// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```
将actions映射到methods:  
```javascript
methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
}
```
组合多个**action**操作:
```javascript
actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```
### 核心概念之 Module

Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：
```javascript
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

命名空间:  

通过设置 **namespaced: true**,当模块被注册后，它的所有 getter、action 及 mutation 会自动根据模块注册的路径调整命名。  
```javascript
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 模块内容（module assets）
      state: { ... }, // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

### 常见问题

- 如果项目使用了 eslint,并且对 **...mapState({})** 等操作报错,需要配置 label,使其支持解构语法.

- 如果运行结果不正确,打印store对象发现state,mutations等某一个为空则需要检查下自己配置的options是否名字输入正确!
