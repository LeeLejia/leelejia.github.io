---
layout: post
title: "webpack4.0基础"
date: 2018-04-23 18:14
comments: true
reward: false
toc: true
tags: 
	- 前端
	- webpack
---

## webpack

工欲善其事,必先利其器.选择和使用好的工具可以让工作事半功倍.webpack于前端项目构建便是这样一把瑞士军刀.  

webpack是一个前端资源加载/打包工具，可以根据模块依赖关系进行静态分析，并依据规则生成对应的静态资源。

<!-- more -->

### 使用条件

- 要求本地存在node环境

### 打包

- 通过命令 webpack main.js --output bundle.js 可以将main.js文件打包为bundle.js文件  
  此时，main.js如果**通过require依赖其他文件，其它文件会同时被打包**

- 通过安装loader加载器，**可以将静态的样式文件一同打包到bundle.js文件**中
  通过 npm install css-loader style-loader 安装加载器
  ```javascript
    require('!style-loader!css-loader!./style.css')
    // !!!./style.css 其中，style-loader和css-loader顺序不能变。
  ```
  
### 使用package.json文件

- 使用命令行 npm init 生成package.json
- 同目录下，npm install moduleName 将写入package.json

### 通过配置文件，简化打包

- 新建命名 webpack.config.js文件
    ```javascript
    module.exports ={
        entry: './src/js/show.js', 
        output:{
            path:__dirname+'/dist'
            filename:'bundle.js'
        },
        module:{
            loaders:[
                {
                    test:/\.css$/,
                    loader:'style-loader!css-loader'
                }
            ]
        }
    }
    // entry(输入): 配置输入的文件
    // output: 配置打包输出的文件目录和文件名
    // module: 指定对 entry输入文件的各种依赖文件类型使用哪种加载器
    ```
    目录下直接运行 webpack即可完成打包
    通过 webpack --watch 当所依赖文件被修改时将重新打包

### 安装第三方库

- 例如安装jQuery第三方库

    - npm install jquery --save--dev
    - 在代码中
        ```javascript
            var $=require('jquery')
            $('div').css({background:'blue'})
        ```

### 服务端环境安装

- 安装 webpack-dev-server 模块
- npm install webpack-dev-server --save-dev
- package.json scripts成员用于定义命令别名，用npm启动

- 服务端启动命令 webpack-dev-server --entry ./src/inputFile.js --output-filename ./dist/target.js
- 通过 webpack-dev-server --watch 当文件被修改时将重新打包到服务器
- 通过 webpack --watch 则不会被同步到服务器，需要手动刷新页面
- 在 webpack.config.js文件中可以配置该模块参数,如端口号等
    ```javascript
    module.exports ={
        entry: './src/js/show.js', 
        output:{
            ...
        },
        module:{
            ...
        },
        devServer:{
            port:8081
        }
    }
    ```

## webpack4.0


### 常规配置

- loader配置
        
    ```javascript
    module: {
        rules: [
          {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/,
            include: path.resolve(__dirname, 'src')
          }
        ]
    }
    // use: 'babel-loader?cacheDirectory'
    //       使用cacheDirectory,缓存loader执行结果发现打包速度明显提升了
    // exclude 排除不处理的目录
    // include 精确指定要处理的目录
    ```

- 优化resolve配置
    
    在 js里出现 import 'vue'这样不是相对、也不是绝对路径的写法时，会去 node_modules 目录下找。  
    但是默认的配置，会采用向上递归搜索的方式去寻找，为了减少搜索范围，可以直接写明 node_modules的全路径  
    同样，对于别名(alias)的配置，亦当如此.
    
    ```javascript
    const path = require('path')
    function resolve(dir) { // 转换为绝对路径
      return path.join(__dirname, dir)
    }
    resolve: {
      modules: [ // 优化模块查找路径
        path.resolve('src'),
        path.resolve('node_modules') // 指定node_modules所在位置 当你import 第三方模块时直接从这个路径下搜索寻找
      ]
    }
    // 对 src/util/add.js进行导入 
    import add from 'util/add'
    ```
    
- resolve.alias 配置路径别名
    
    创建 import或 require的路径别名。  
    配置项通过别名来把原导入路径映射成一个新的导入路径  
    通过设置别名,可以简化常用模块的导入方式.  
    或者通过**精确匹配**,简化常用文件的导入
    
    例如，一些位于 src/ 文件夹下的常用模块：
    ```javascript
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      Templates: path.resolve(__dirname, 'src/templates/')
    }
    // 此时,两种导入方式相同
    import Utility from '../../utilities/utility'
    import Utility from 'Utilities/utility'
    
    // 使用精确导入
    alias: {git 
      util$: resolve('src/util/add.js')
    }
    // 精确匹配, src/util/add.js 被解析和导入
    import Test1 from 'util'
    // 触发普通解析, util/dep1.js 被解析和导入
    import Test2 from 'util/dep1.js' 
    ```

- resolve.extensions 配置省略文件名
  
  当引入模块时不带文件后缀 webpack会根据此配置自动解析确定的文件后缀  
  后缀列表尽可能小,频率最高的往前放,导出语句尽可能带上后缀  
  ```javascript
  resolve: {
    extensions: ['.js', '.vue']
  }
  ```

- module.noParse
    
    用了noParse的模块将不会被loaders解析，所以当我们使用的库如果太大，并且其中不包含import require、define的调用，我们就可以使用这项配置来提升性能, 让 Webpack 忽略对部分没采用模块化的文件的递归解析处理。
    
    // 忽略对jquery lodash的进行递归解析
    ```javascript
    module: {
      // noParse: /jquery|lodash/
      
      // 从 webpack 3.0.0 开始
      noParse: function(content) {
        return /jquery|lodash/.test(content)
      }
    }
    ```

- HappyPack
    
    HappyPack是让webpack对loader的执行过程，从单一进程形式扩展为多进程模式，也就是将任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。从而加速代码构建 与 DLL动态链接库结合来使用更佳。
    
    ```javascript
    npm i happypack@next -D
    webpack.config.js
    
    const HappyPack = require('happypack');
    const os = require('os'); // node 提供的系统操作模块
    
     // 根据我的系统的内核数量 指定线程池个数 也可以其他数量
    const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().lenght})
    
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'happypack/loader?id=babel',
          exclude: /node_modules/,
          include: path.resolve(__dirname, 'src')
        }
      ]
    },
    plugins: [
      new HappyPack({ // 基础参数设置
        id: 'babel', // 上面loader?后面指定的id
        loaders: ['babel-loader?cacheDirectory'], // 实际匹配处理的loader
        threadPool: happyThreadPool,
        // cache: true // 已被弃用
        verbose: true
      })
    ]
    
    ```
    happypack提供的loader，是对文件实际匹配的处理loader。这里happypack提供的loader与plugin的衔接匹配，则是通过id=happypack来完成。

- 执行压缩

webpack --mode production

- Tree Shaking

剔除JavaScript中用不上的代码。它依赖静态的ES6模块化语法，例如通过impot和export导入导出

- commonJS模块 与 es6模块的区别（后面会整理，见下一篇）
    
  - commonJS模块：
  
      - 动态加载模块 commonJS 是运行时加载 能够轻松实现懒加载，优化用户体验
      
      - 加载整个模块 commonJS模块中，导出的是整个模块
      
      - 每个模块皆为对象 commonJS模块被视作一个对象
      
      - 值拷贝 commonJS的模块输出和函数的值传递相似，都是值得拷贝
  
  - es6模块
  
      - 静态解析 es6模块时 编译时加载 即在解析阶段就确定输出的模块的依赖关系，所以es6模块的import一般写在被引入文件的开头
      
      - 模块不是对象 在es6里，每个模块并不会当做一个对象看待
      
      - 加载的不是整个模块 在es6模块中 一个模块中有好几个export导出
      
      - 模块的引用 es6模块中，导出的并不是模块的值得拷贝，而是这个模块的引用
  
  - 保留ES6模块化语法

    ```javascript
    // .babelrc
    {
      "presets": [
        [
          "env", {
            modules: false // 不要编译ES6模块
          },
          "react",
          "stage-0"
        ]
      ]
    }
    ```
  
  - 执行生产编译 默认已开启Tree Shaking
  
    webpack --mode production
    
    什么是Tree Shaking?
    
    有个funs.js 里面有两个函数
    
    ```javascript
    // funs.js
    export const sub = () => 'hello webpack!';
    export const mul = () => 'hello shaking!';
    main.js 中依赖funs.js
    
    // main.js
    import {sub} from './funs.js'
    
    sub();
    // 在main.js只使用了里面的 sub函数 默认情况下也会将funs.js里面其他没有的函数也打包进来, 如果开启tree shaking 生产编译时
    
    webpack --mode production //此时funs.js中没有被用到的代码并没打包进来 而被剔除出去了
    ```
    