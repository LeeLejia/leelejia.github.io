---
layout: post
title: "css基础"
date: 2017-11-02 15:20
comments: false
reward: false
toc: true
tags: 
	- 前端
---

css 选择器，导入方式以及盒子模型。

<!--more-->

## 选择器Selectors

### 基本选择器

- 标签名选择器（tag selectors）：

```css
p{
    color: blue;	/*声明部分*/
  	text-decoration: underline;
}
```

- 类选择器（最常用）（class selectors）：

```css
.className{
  color: red;
  font-size: 18px;
}
```

- ID选择器（ID selectors）：
   - id选择器比较少用，一般样式是可复用的，而同个页面id是唯一的，这样就降低了样式的复用率。但是一般类似`header`，`footer`，`banner`，`content`可设置成ID选择器，因为相同的样式在同一页面里不可能有第二次。

```css
#idName{
    color: black;
    font-size: 18px;
}
```

- 伪类选择器：

   - CSS伪类（[pseudo-class](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Pseudo-classes)）是加在选择器后面的用来指定元素状态的关键字。比如，[`:hover`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:hover) 会在鼠标悬停在选中元素上时应用相应的样式。伪类和伪元素（pseudo-elements）不仅可以让你为符合某种文档树结构的元素指定样式，还可以为符合某些外部条件的元素指定样式：浏览历史(比如是否访问过 ([`:visited`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:visited))， 内容状态(如 [`:checked`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:checked) ), 鼠标位置 (如[`:hover`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:hover)). 

   ```css
   a:link {color: #FF0000}		/* 未访问的链接 */
   a:visited {color: #00FF00}	/* 已访问的链接 */
   a:hover {color: #FF00FF}	/* 鼠标移动到链接上 */
   a:active {color: #0000FF}	/* 选定的链接 */
   ```

- 通配符选择器（*）：

   *选择所有元素。

```css
*{
  marigin: 0;
  padding: 0;
}
```

### 扩展选择器

- 后代选择器：

后代选择器实际上是使用多个选择器中间加上空格来找到具体要定位的标签。选择器之间的空格是一种结合符。以下的例子可以解释为`em`在`h1`中找到，`em`作为`h1`的后代。

```css
h1 em{
    color: red;
}
```

- 群组选择器：

实际上是css标签名选择器的一种简化写法。把有相同定义的不同选择器放在一起，节省代码。

```css
div,span{
    color: green;
}
```

## 在HTML中引入css

包括行内式，内嵌式，导入式，链接式。

注：在标签内写入`style=“”`的方式，应该是css的一种引入，而不是选择器。

- 行内式

在标签内的style属性设定css样式，这种方式本质上没有体现处css的优势，因此不推荐使用。

`<h2 style="color: blue">在html引入css--行内式</h2>`

- 嵌入式

在对页面中各种元素的设置集中写在`<head></head>`之间，对单个页面来说，这种方式很方便。

```html
<style>
    h2{
        color: aqua;
    }
</style>
```

- 导入式

```html
<style type="text/css"> @import "style.css";</style>
```

- 链接式

`<link href="style.css" rel="stylesheet" type="text/css"/>`

### 导入式和链接式的区别

- **链接式：**会在装载页面主体部分之前装载css文件，这样显示出来的网页从一开始就是带有样式效果的。

- **导入式：**会在整个页面装载完成之后在装入css文件，对于有的浏览器来说，在一些情况下，如果网页文件的体积比较大，则会显示无样式的页面，闪烁一下之后再出现设置样式后的效果。从用户的角度看，这是导入式的一个缺陷。

- 对于一些比较大的网站，为了便于维护，可能会希望把所有的css样式分类别放到几个CSS文件中，这样如果使用链接式引入，就需要几个语句分别导入CSS文件。如果要调整CSS文件的分类，就需要同时调整HTML文件，这对于维护工作来说，是一个缺陷，如果使用导入式，则可以只引进一个总的CSS文件，在这个文件中再导入其他独立CSS文件；而连接则不具备这个特性。

    因此给大家的建议是：如果仅需要引入一个CSS文件，则使用连接方式，如果需要引入多个CSS文件，则首先用连接方式引入一个“目录”CSS文件，这个“目录”CSS文件中再使用导入式引入其他CSS文件。如果希望用javascript来动态决定引入哪个css文件，则必须使用连接式才能实现。[reference--在html中引入CSS的方法。](http://www.cnblogs.com/suzongwei/archive/2008/05/28/1209431.html)   

## 盒子模型（box-model）

- CSS框模型是Web上布局的基础 - 每个元素都表示为一个矩形框，框的内容(content)，填充(padding)，边框(border)和边距(margin)彼此相似，如洋葱层。作为浏览器呈现网页布局，它制定了应用于每个框的内容的样式，周围的洋葱层有多大，以及盒子相对于彼此的位置。

1. `width`和`height`：`width`和`height`的可以设定content的宽度和高度。
2. `padding`：`padding（填充）`是指css框的`content`的外边缘和`border`的内边缘之间的部分。`padding-top`，`padding-bottom`，`padding-right`，`padding-left`。
3. `border`：`boder（边框）`位于`padding`的外边缘和`margin`的内边缘之间。`border`的默认大小为0，使其不可见。`border`可一次设置所有四面体，也可分开设置：
   - `border-top`，`border-right`，`border-bottom`，`border-left`：设置厚度，款式和边境一侧的颜色。
   - `border-width`，`border-style`，`border-color`：设置仅厚，样式或颜色独立，但边界的所有四个侧面。
   - 您还可以设置单独的边框的单面的三个属性之一，使用`border-top-width`，`border-top-style`，`border-top-color`，等。 
4. `margin`：`margin`围绕一个CSS框，并向上推动布局中的其他CSS框。它的行为很像`padding`; 速记属性`margin`和个人属性是`margin-top`，`margin-right`，`margin-bottom`，和`margin-left`。

### 2种盒子模型

#### w3c标准盒子模型

![image.png](http://upload-images.jianshu.io/upload_images/7166236-a0a6011d6365e58a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 从上图可以看到标准 w3c 盒子模型的范围包括 margin、border、padding、content，**并且 content 部分不包含其他部分**。

#### IE盒子模型

![image.png](http://upload-images.jianshu.io/upload_images/7166236-8445cc1d8e68e43b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

从上图可以看到 ie 盒子模型的范围也包括 margin、border、padding、content，和标准 w3c 盒子模型不同的是：**ie 盒子模型的 content 部分包含了 border 和 pading**。

[reference -- CSS盒子模型理解](https://github.com/shinygang/Article/blob/master/CSS%E7%9B%92%E5%AD%90%E6%A8%A1%E5%9E%8B%E7%90%86%E8%A7%A3.md)