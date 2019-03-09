---
layout: post
title: "javascript事件监听"
date: 2018-02-02 12:20
toc: true
tags: 
	- 前端
---

javascript事件监听

<!-- more -->
```javascript
<div class="contain" onclick="alert('container')">
    <div class="out out1" onclick="alert('out1')">
        <div class="in in1" onclick="alert('in1')">in1</div>
        <div class="in in2" onclick="alert('in2')">in2</div>
    </div>
    <div class="out out2">
        <div class="in in3" onclick="alert('in3')">in3</div>
        <div class="in in4" onclick="alert('in4')">in4</div>
    </div>
</div>
```
![效果图](http://www.cjwddz.cn/static/blog/event.png)
如点击了**in1**区域，将会依次弹出信息：in1，out1，container，可见**onclick**绑定事件是在冒泡过程执行的。

如果此时添加脚本
```javascript
document.addEventListener('click', function(e){
  alert(e.target.innerText+'  BY CAPTURE')
}, true)
```
如点击了**in1**，则依次弹出信息：in1  BY CAPTURE，in1，out1，container
如点击了**container**，则依次弹出信息：in1 in2 in3 in4   BY CAPTURE，container
可见`addEventListener`响应一次，且事件来源为最小点击对象。

同时我们可以看到，点击了A对象的时候会先后执行其**捕获->冒泡**方法。
然而，如果我们将事件绑定在**container**上，对于子对象结论相同，但是对于**container**，执行顺序却是**冒泡->捕获**???

接着测试，我们把代码改成：
```javascript
// Write JavaScript here 
document.querySelector('.contain').addEventListener('click', function(e){
  alert(e.target.innerText+'  cature')
}, true)
// Write JavaScript here 
document.querySelector('.contain').addEventListener('click', function(e){
  alert(e.target.innerText+'  popppp')
}, false)
```
发现对子节点：cature -> onclick冒泡 -> popppp
对container节点：onclick -> cature -> onclick冒泡 -> popppp

猜测，同一个对象**addEventListener**的优先级要比onclick弱。

```javascript
document.querySelector('.contain').addEventListener('click', function(e){
  alert(e.target.innerText+'  cature')
  e.stopPropagation()
}, true)
```
使用`e.stopPropagation()`阻断捕获事件传播，点击**in1**: poppp 结束。

实现点击外框关闭
- 阻止冒泡的方法：event.stopPropagation();
```javascript
// 添加监听
document.removeEventListener('click', this.documentHandler)
// 取消监听
document.addEventListener('click', this.documentHandler)
documentHandler(event) {
    if (containerRef.contains(event.target)) {
        // return false可以阻止冒泡，不能阻止捕获
        return false
    }
    this.listMenuVisible = false
}
```

### 阻止冒泡
// 阻止冒泡事件的兼容性处理 
```javascript
function stopBubble(e) { 
if(e && e.stopPropagation) { // 非IE 
    e.stopPropagation(); 
} else { //IE 
    window.event.cancelBubble = true; 
} 
// 处理事件中
return false
```

### 取消默认行为
```javascript
//阻止浏览器的默认行为 
function stopDefault( e ) { 
  //阻止默认浏览器动作(W3C) 
  if ( e && e.preventDefault ) 
    e.preventDefault(); 
  //IE中阻止函数器默认动作的方式 
  else
    window.event.returnValue = false; 
  return false; 
}
```
所谓默认行为，包括a标签的跳转，右键的菜单等。
以a标签为例,阻止其自动跳转。
```javascript
<a href="http://www.cjwddz.com/" id="testA" >caibaojian.com</a>
var a = document.getElementById("testA");
a.onclick = function(e) {
    if(e.preventDefault){
    e.preventDefault();
}else{
    window.event.returnValue == false;
}
```

### stopImmediatePropagation() 和 stopPropagation()的区别在哪儿呢？

监听事件是可以有同时添加多个对象的。
stopPropagation只保证了其后元素的冒泡/捕获事件被截止。
而 stopImmediatePropagation则使**该元素绑定的后序相同类型事件**的监听函数的执行也将被阻止.