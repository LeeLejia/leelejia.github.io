---
layout: post
title: "跨域和同源策略"
date: 2017-11-21 12:12
comments: true
reward: false
toc: true
tags: 
	- 前端
---

## 跨域

在开发调试阶段由于端口或者域名不同，我们会触发跨域问题。
导致跨域的原因是**同源策略**。  

<!--more-->
通常我们使用的方法有：
- 关闭浏览器跨域限制
> 使用命令行打开浏览器  
**chrome为例**  
win:   
    "C:\Users\UserName\AppData\Local\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir  
mac:  
    open -a "Google Chrome" --args --disable-web-security  --user-data-dir  
linux：  
    chromium-browser --disable-web-security  
    
- 修改后端response
> Access-Control-Allow-Origin       允许访问的源
> Access-Control-Allow-Credentials  是否附带cookies
> Access-Control-Expose-Headers     附带哪些头

### 同源策略

- 条件：
    协议相同、域名相同、端口相同

- 目的：

    保证用户信息安全，防止恶意网站窃取数据。
    同源策略是必须的，否则cookie可以共享。

- 限制范围：

    cookie、localstorage、indexdb无法读取。
    DOM无法获取。
    ajax请求不能发送。

### 规避策略

* cookie
    设置`document.domain`共享cookie。
* DOM获取
    父子窗口通过 `window.opener.postMessage(content,origin)`实现跨窗口通信，无论这两个窗口是否同源。
* JSONP
    JSONP(JSON with Padding)是JSON的一种“使用模式”，用 JSONP抓到的资料并不是 JSON，而是任意的JavaScript，用 JavaScript直译器执行而不是用 JSON解析器解析。可以通过**ajax或者`<script>`**标签实现。**只支持Get请求方式**，更好的选择是CORS
```html
<body>
    <div id="divCustomers"></div>
    <script type="text/javascript">
        function onCustomerLoaded(result, methodName) {
            var html = '<ul>';
            for (var i = 0; i < result.length; i++) {
                html += '<li>' + result[i] + '</li>';
            }
            html += '</ul>';
            document.getElementById('divCustomers').innerHTML = html;
        }
    </script>
    <script type="text/javascript" src="http://www.yiwuku.com/myService.aspx?jsonp=onCustomerLoaded"></script>
</body>
```
```javascript
$.ajax({
    dataType:'jsonp',
    data:'id=10',
    jsonp:'jsonp_callback',
    url:'http://www.yiwuku.com/getdata',
    success:function(){
        // ...
    },
});
```
* WebSocket
    [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)是一种通信协议。使用`ws://`（非加密）和`wss://`（加密）作为协议前缀。该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。

* CORS
    CORS跨域资源共享（corss-origin resource sharing）:
    对于开发者来说，CORS通信与同源的AJAX通信没有差别，代码完全一样。
    浏览器一旦发现**AJAX请求跨源，就会自动添加一些附加的头信息**，有时还会多出一次附加的请求，但用户不会有感觉。
    因此，实现**CORS通信的关键是服务器**。只要服务器实现了CORS接口，就可以跨源通信。
    **验不验证主动权在前端(浏览器),是浏览器安全控制的一种方式,不是服务器!!!**
    浏览器将CORS请求分成两类：
        * 简单请求（simple request）和非简单请求（not-so-simple request）。
![CORS请求.png](http://upload-images.jianshu.io/upload_images/7166236-acd3c54d85bf38e5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)    
    * 简单请求
    如果浏览器发现跨源AJAX请求是简单请求，就自动在头信息之中，**添加一个`Origin`字段**。
    **服务器**根据`Origin`的值决定是否同意这次请求。
    如果`Origin`指定的源在不在后端的许可白名单范围内，服务器会返回一个正常的http回应。
    浏览器接收后发现，这个`response`的Header没有包含`Access-Control-Allow-Origin`字段，就知道出错了
    从而抛出一个错误，被`XMLHttpRequest`的**`onerror`**回调函数捕获。
    **这种错误无法通过状态码识别，因此HTTP response的状态码有可能是200。**
    > 如果`Origin`指定的域名在许可的范围内，则服务器返回的相应中，会多出几个头信息字段
    > Access-Control-Allow-Origin: http://easywork.xin（必须字段）
        它的值要么是请求时`Origin`的值，要么是`*`，表示接受任意域名的请求。
    > Access-Control-Allow-Credentials: true          （可选字段）
        它是一个bool值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
        设为true，表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。
        CORS请求默认不发送Cookie和HTTP认证信息。如果要把Cookie发送到服务器，**一方面要服务器同意**。
        **另一方面**，前端必须在AJAX请求中打开`withCredentials`属性.
        注意：如果要发送Cookie，`Access-Control-Allow-Origin`不能设置为`*` ，必须指定明确的，与请求网页一致的域名。
        同时，Cookie依然遵守**同源政策**，只有用服务器域名设置的Cookie才会上传，其他域名的Cookie并不会上传。
```javascript
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
```
    > Access-Control-Expose-Headers: FooBar            （可选字段）
        CORS请求时，`XMLHttpRequest`对象的`getResponseHeader(args)`方法只能拿到6个基本字段：
        `Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`
        如果想拿到其他字段，就必须在`Access-Control-Expose-Headers`里面指定。

    * 非简单请求

    非简单请求是那种对服务器有特殊要求的请求，比如请求方法是`PUT`或`DELETE`，或者`Content-Type`字段的类型是`application/json`。
    非简单请求的CORS请求，**会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）**。
    浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。
    只有得到肯定答复，浏览器才会发出正式的`XMLHttpRequest`请求，否则就报错。
    
    与JSONP比较:
    CORS与JSONP的使用目的相同，但是比JSONP更强大。**JSONP只支持GET请求**，**CORS支持所有类型的HTTP请求**。
    **JSONP的优势在于支持老式的浏览器**，以及可以向比支持CORS的网站请求数据。

### 为什么需要做跨域限制

- 我们举例说明：  
比如一个黑客程序，他利用IFrame把真正的银行登录页面嵌到他的页面上
当你使用真实的用户名，密码登录时，他的页面就可以通过Javascript读取到你的表单中input中的内容，这样用户名，密码就轻松到手了。
Ajax应用：
    在Ajax应用中这种安全限制被突破。
    在普通的Javascript应用中，我们可以修改Frame的href，或者IFrame的src，以实现GET方式的跨域提交，但是却不能访问跨域的Frame/IFrame中的内容。
浏览器支持:
    而IE其实给这个安全策略开了两个想当然的后门，一个是：他假设你的本地文件，自然清楚将会访问什么内容，所以任何你的本地文件访问外部数据
    都不会收到任何的警告。另一个是：当你访问的网站脚本打算访问跨域的信息时， 他居然仅仅是弹出一个对话框来提醒你一下。
    如果一个欺诈网站，采用这样的手段，提供一个假页面给你，然后通过XMLHTTP帮你远程登录真实的银行服务器。只要10个用户里，有一个用户糊涂一下，点了一个确定。
    他们的盗取帐号行为，就成功了！ 你想想看，这是何等危险的事情！ 
    FireFox就不是这样的做法，缺省的情况下，FireFox根本就不支持跨域的XMLHTTP请求，根本就不给黑客这样的机会。

## Reference

[阮一峰-浏览器同源政策及其规避方法](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)

[阮一峰-跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)