webpackJsonp([1],{NHnr:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("7+uW"),s=a("xJD8"),n={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"flex-column",attrs:{id:"app"}},["getId"===e.type?a("div",{staticClass:"get-groupid-page"},[a("div",{staticClass:"get-groupId"},[a("h2",{staticClass:"title"},[e._v("查询GroupId")]),e._v(" "),a("div",{staticClass:"ip-row"},[a("label",[e._v("邮箱")]),e._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:e.email,expression:"email"}],attrs:{type:"email"},domProps:{value:e.email},on:{input:function(t){t.target.composing||(e.email=t.target.value)}}})]),e._v(" "),a("div",{staticClass:"ip-row"},[a("label",[e._v("密码")]),e._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:e.pwd,expression:"pwd"}],attrs:{type:"password"},domProps:{value:e.pwd},on:{input:function(t){t.target.composing||(e.pwd=t.target.value)}}})]),e._v(" "),a("div",{staticClass:"reset-pwd",attrs:{href:"javascript:void(0)"},on:{click:e.resetPwd}},[e._v("\n        找回密码\n      ")])]),e._v(" "),e.groupId&&e.email?a("div",{staticClass:"result"},[a("div",{staticClass:"groupId"},[e._v("\n        GroupId: "),a("span",[e._v(e._s(e.groupId))])]),e._v(" "),a("div",{staticClass:"desc"},[e._v("你可以分享该id,但是确保密码不被泄露。")])]):e._e(),e._v(" "),a("div",{staticClass:"action-row"},[a("a",{staticClass:"nav-link",attrs:{href:"javascript:void(0)"},on:{click:function(t){e.type="regiest"}}},[e._v("注册一个")]),e._v(" "),a("span",{staticClass:"confirm",on:{click:e.confirm}},[e._v("确定")])])]):e._e(),e._v(" "),"regiest"===e.type?a("div",{staticClass:"register-page"},[a("h2",{staticClass:"title"},[e._v("注册GroupId")]),e._v(" "),a("div",{staticClass:"ip-row"},[a("label",[e._v("邮箱")]),e._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:e.email,expression:"email"}],attrs:{type:"email",placeholder:"注册邮箱"},domProps:{value:e.email},on:{input:function(t){t.target.composing||(e.email=t.target.value)}}})]),e._v(" "),a("div",{staticClass:"ip-row"},[a("label",[e._v("设置密码")]),e._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:e.pwd,expression:"pwd"}],attrs:{type:"password",placeholder:"设置密码"},domProps:{value:e.pwd},on:{input:function(t){t.target.composing||(e.pwd=t.target.value)}}})]),e._v(" "),a("div",{staticClass:"ip-row"},[a("label",[e._v("重复密码")]),e._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:e.pwdConfirm,expression:"pwdConfirm"}],attrs:{type:"password",placeholder:"确认密码"},domProps:{value:e.pwdConfirm},on:{input:function(t){t.target.composing||(e.pwdConfirm=t.target.value)}}})]),e._v(" "),a("div",{staticClass:"ip-row"},[a("label",[e._v("GroupName")]),e._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:e.name,expression:"name"}],attrs:{type:"text",placeholder:"请输入分组名称"},domProps:{value:e.name},on:{input:function(t){t.target.composing||(e.name=t.target.value)}}})]),e._v(" "),a("div",{staticClass:"ip-row"},[a("label",[e._v("描述")]),e._v(" "),a("textarea",{directives:[{name:"model",rawName:"v-model",value:e.desc,expression:"desc"}],attrs:{type:"text",placeholder:"账号说明"},domProps:{value:e.desc},on:{input:function(t){t.target.composing||(e.desc=t.target.value)}}})]),e._v(" "),a("div",{staticClass:"action-row"},[a("a",{staticClass:"nav-link",attrs:{href:"javascript:void(0)"},on:{click:function(t){e.type="getId"}}},[e._v("返回登陆")]),e._v(" "),a("span",{staticClass:"confirm",on:{click:e.register}},[e._v("注册")])])]):e._e()])},staticRenderFns:[]};var r=function(e){a("w8NH")},o=a("VU/8")(s.a,n,!1,r,"data-v-3e2dae24",null).exports;i.a.config.productionTip=!1,new i.a({el:"#app",components:{App:o},template:"<App/>"})},w8NH:function(e,t){},xJD8:function(e,t,a){"use strict";(function(e,i){var s,n,r=a("pFYg"),o=a.n(r),d=a("JnRc"),l=a.n(d),p="sojson.v5",c=["w63CtiMp","wrA/wqvDjGnCvMKXw57CsA==","RkE/STfCosOVecOE","wp9PYj1V","5Li86IKp5YuL6ZuBXMKjcsObY8Ohwo3DjMOi"];s=c,n=320,function(e){for(;--e;)s.push(s.shift())}(++n);var v=function t(a,s){var n=c[a-=0];if(void 0===t.initialized){!function(){var t="undefined"!=typeof window?window:"object"===(void 0===e?"undefined":o()(e))&&"object"===(void 0===i?"undefined":o()(i))?i:this;t.atob||(t.atob=function(e){for(var t,a,i=String(e).replace(/=+$/,""),s=0,n=0,r="";a=i.charAt(n++);~a&&(t=s%4?64*t+a:a,s++%4)?r+=String.fromCharCode(255&t>>(-2*s&6)):0)a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a);return r})}();t.rc4=function(e,t){for(var a,i=[],s=0,n="",r="",o=0,d=(e=atob(e)).length;o<d;o++)r+="%"+("00"+e.charCodeAt(o).toString(16)).slice(-2);e=decodeURIComponent(r);for(var l=0;l<256;l++)i[l]=l;for(l=0;l<256;l++)s=(s+i[l]+t.charCodeAt(l%t.length))%256,a=i[l],i[l]=i[s],i[s]=a;l=0,s=0;for(var p=0;p<e.length;p++)s=(s+i[l=(l+1)%256])%256,a=i[l],i[l]=i[s],i[s]=a,n+=String.fromCharCode(e.charCodeAt(p)^i[(i[l]+i[s])%256]);return n},t.data={},t.initialized=!0}var r=t.data[a];return void 0===r?(void 0===t.once&&(t.once=!0),n=t.rc4(n,s),t.data[a]=n):n=r,n};l.a[v("0x0","diVa")]({appId:"MyE54xA8SJbJjvYdKzhVdc6M-MdYXbMMI",appKey:"SvCuPdNhCYzNnwcYM80LTrTo"}),(void 0===p?"undefined":o()(p))!==v("0x1","c74n")&&p===v("0x2","eekP")||window[v("0x3","UDYg")](v("0x4","$[pM")),p="sojson.v5",t.a={name:"App",data:function(){return{email:"",pwd:"",pwdConfirm:"",groupId:"",type:-1!==window.location.search.indexOf("page=regiest")?"regiest":"getId",name:"",desc:""}},created:function(){},methods:{confirm:function(){var e=this;/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.email)?(/^[a-z0-9]{6,20}$/i.test(this.pwd)||alert("请输入6-20位的密码"),l.a.User.logIn(this.email,this.pwd).then(function(t){e.groupId=t.get("groupId")||"未查询到groupId,请稍后再试"},function(e){alert(e.rawMessage||"不存在用户,请先注册")})):alert("邮箱不合法")},register:function(){if(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.email))if(/^[a-z0-9]{6,20}$/i.test(this.pwd))if(this.pwd===this.pwdConfirm)if(this.name){var e=new l.a.User;e.setUsername(this.email),e.setPassword(this.pwd),e.setEmail(this.email),e.set("groupName",this.name),e.set("desc",this.desc),e.set("pwd",this.pwd),e.signUp().then(function(e){alert("注册成功,请在邮箱激活账户")},function(e){alert(e.rawMessage||"注册失败")})}else alert("请输入分组名");else alert("两次密码比对错误");else alert("请设置6-20位的密码");else alert("请输入正确邮箱")},resetPwd:function(){if(confirm("确定重置账户密码?")){if(!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.email))return void alert("邮箱不合法");l.a.User.requestPasswordReset(this.email),alert("请查收并在邮件中点击重置密码")}}}}}).call(t,a("W2nU"),a("DuR2"))}},["NHnr"]);