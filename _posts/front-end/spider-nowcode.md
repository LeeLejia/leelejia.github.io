---
layout: post
title: "使用js爬取多个页面数据"
date: 2018-04-02 14:20
realDate: 2018-05-18 14:12
toc: true
tags: 
	- 前端
	- 爬虫
---

使用 js写一个简单爬虫，爬取牛客网前端题目。
在牛客网的任意页面，打开控制台拷贝代码运行即可。
<!--more-->
```javascript
async function getNowCodeQuestions() {
    let curPage = 1
    let pageCount = 10000
    let questions = []
    while (pageCount>=curPage){
        let result = await new Promise((resolve,reject)=>{
            $.get(`/ta/review-frontend/review?page=${curPage}`,function(result){
                resolve(result)
            })
        })
        const parser=new DOMParser()
        const html = parser.parseFromString(result, "text/html")
        let ul = html.querySelector('.final-pagination ul')
        pageCount = +ul.children[ul.childElementCount-2].innerText
        var question = html.querySelector('.final-question').outerHTML
        var answer = html.querySelector('.design-answer-box').outerHTML
        questions.push({
            id: curPage,
            question,
            answer
        })
        console.log('爬取进度：'+curPage+'/'+pageCount)
        curPage+=1
    }
	return questions
}
getNowCodeQuestions().then(questions=>{
	let result = questions.reduce((txt,item)=>{
		return txt+=`题目${item.id}:${item.question}\n答案：${item.answer}\n`
	},"<div class=\"title\">牛客网前端题目</div>\n")
	console.log(result)
})
```
运行过程  
![爬取内容](spider-nowcode1.png)  
爬取内容  
![爬取内容](spider-nowcode.png)
