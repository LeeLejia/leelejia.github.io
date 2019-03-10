---
layout: post
title: "js实现任意组件拖拽"
date: 2018-06-08 10:29
comments: false
reward: false
toc: true
tags: 
	- 前端
---

使用js封装了对任意组件的拖拉效果。
- 源码  
<!-- more -->
```javascript
// node 为被拖拽对象，dragBar为可拖拽区域, exclude 为排除拖拉效果的组件
export default (node, dragBar = null, exclude = []) => ((() => {
  let flag = false
  let lastX
  let lastY
  const bar = dragBar || node
  const container = node
  const cursor = bar.style.cursor
  const parent = (container.parentNode && (container.parentNode.clientWidth > container.clientWidth)) ? container.parentNode : document.querySelector('body')
  dragBar && (bar.style.cursor = 'move')
  bar.onmousedown = (e) => {
    if (exclude.some(item => item === e.target)) return
    if (!dragBar) bar.style.cursor = 'move'
    flag = true
    const event = e || window.event
    lastX = container.style.left ? event.clientX - parseInt(container.style.left, 10) : event.clientX
    lastY = container.style.top ? event.clientY - parseInt(container.style.top, 10) : event.clientY
  }
  bar.onmouseup = () => {
    (!dragBar) && (bar.style.cursor = cursor)
    flag = false
  }
  bar.onmouseleave = () => {
    flag = false
  }
  bar.onmousemove = (e) => {
    if (!flag) return
    const event = e || window.event
    if (event.clientX > lastX && event.clientX < parent.clientLeft + parent.clientWidth - container.clientWidth + lastX) {
      container.style.left = `${event.clientX - lastX}px`
    }
    if (event.clientY > lastY && event.clientY < parent.clientTop + parent.clientHeight - container.clientHeight + lastY) {
      container.style.top = `${event.clientY - lastY}px`
    }
  }
})())

```

- 效果

