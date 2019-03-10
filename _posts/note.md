

- css文档中后边的样式会覆盖前边的样式

<div class="a b"></div>

a{
   prop1: xxx;
}
B{
   prop1: xxx;
}

prop1为 B样式.


- 防抖
```javascript
refresh: throttle(async function () {
     // ....
    }, 10000, { leading: true, trailing: true })
```

- css calc()

- 第三方组件click事件不起效时可以试试,@click.native

- vue css style避免影响组件外元素可以加scope限制作用范围


- git 高频操作

删除本地分支
git branch -D xxx

删除远程分支
git push origin :xxx

合并分支
git merge xxx

缓存修改
git stash

恢复缓存到当前分支
git stash pop

切换到分支
git checkout xxx

新建并切换到分支
git checkout -b xxx


- 使用 slot="xxx" 不会显示,除非父组件进行处理,安排



vue的单例问题
vuex如何实现对象共享
await将异步结果拆包
const { width, height } = await new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.src = window.URL.createObjectURL(file)
    })


- 接口重演
删除的记录会发回，有event属性包括了[insert，update，insert]

- 对不能操作的延时
  insert(objs) {
    if (this.prepare) {
      setTimeout(this.insert(objs), 0)
      return
    }
    // ...
  }

- function.bind不仅可以bind调用对象，还能bind调用参数

var a = function(a,b,c){console.log(a+b+c)}
a.bind(this,1,2)(3) // 6

- 获取function定义的参数数量
var a = function(a,b,c,d,e){}
a.length // 5

//十进制转其他
var x=110;
w(x);
w(x.toString(8));
w(x.toString(32));
w(x.toString(16));

//其他转十进制
var x='110';
w(parseInt(x,2));
w(parseInt(x,8));
w(parseInt(x,16));