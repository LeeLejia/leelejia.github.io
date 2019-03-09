
---
layout: post
title: "页面提取生词"
date: 2018-7-05 14：09
comments: false
reward: false
toc: true
tags: 
	- 前端
	- tools
---

英语单词api：

    https://blog.csdn.net/chemmuxin1993/article/details/52588074

```javascript
var ignoreWords = [
    "",
]
var words = document.body.innerText.match(/[a-z]{3,15}(-[a-z]{3,15})?/ig).map(item=>item.toLowerCase()).sort()
var wordsStruct = [],tmp = {}
words.forEach(word=>{
    if(tmp.word===word){
        tmp.count = tmp.count+1
        return
    }
    tmp = {word,count:1,len: word.length}
    wordsStruct.push(tmp)
})
wordsStruct.sort(function(a,b){
    return (b.len - a.len) || (b.count - a.count)
})
console.log(wordsStruct)
```