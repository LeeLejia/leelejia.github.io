<template>
  <div id="app" class="flex-column">
    <div class="get-groupid-page" v-if="type === 'getId'">
      <div class="get-groupId">
        <h2 class="title">查询GroupId</h2>
        <div class="ip-row">
          <label>邮箱</label>
          <input type="email" v-model="email" />
        </div>
        <div class="ip-row">
          <label>密码</label>
          <input type="password" v-model="pwd" />
        </div>
        <div class="reset-pwd" href="javascript:void(0)" @click="resetPwd">
          找回密码
        </div>
      </div>
      <div class="result" v-if="groupId && email">
        <div class="groupId">
          GroupId: <span>{{ groupId }}</span>
        </div>
        <div class="desc">你可以分享该id,但是确保密码不被泄露。</div>
      </div>
      <div class="action-row">
        <a class="nav-link" href="javascript:void(0)" @click="type = 'regiest'"
          >注册一个</a
        >
        <span class="confirm" @click="confirm">确定</span>
      </div>
    </div>
    <div class="register-page" v-if="type === 'regiest'">
      <h2 class="title">注册GroupId</h2>
      <div class="ip-row">
        <label>邮箱</label>
        <input type="email" placeholder="注册邮箱" v-model="email" />
      </div>
      <div class="ip-row">
        <label>设置密码</label>
        <input type="password" placeholder="设置密码" v-model="pwd" />
      </div>
      <div class="ip-row">
        <label>重复密码</label>
        <input type="password" placeholder="确认密码" v-model="pwdConfirm" />
      </div>
      <div class="ip-row">
        <label>GroupName</label>
        <input type="text" placeholder="请输入分组名称" v-model="name" />
      </div>
      <div class="ip-row">
        <label>描述</label>
        <textarea type="text" v-model="desc" placeholder="账号说明"></textarea>
      </div>
      <div class="action-row">
        <a class="nav-link" href="javascript:void(0)" @click="type = 'getId'"
          >返回登陆</a
        >
        <span class="confirm" @click="register">注册</span>
      </div>
    </div>
  </div>
</template>

<script>
import AV from "leancloud-storage";
var encode_version = "sojson.v5",
  oxciu = "__0x63b5f",
  __0x63b5f = [
    "w63CtiMp",
    "wrA/wqvDjGnCvMKXw57CsA==",
    "RkE/STfCosOVecOE",
    "wp9PYj1V",
    "5Li86IKp5YuL6ZuBXMKjcsObY8Ohwo3DjMOi"
  ];
(function(_0x1ffe18, _0x4a7d05) {
  var _0x269f59 = function(_0x3e8427) {
    while (--_0x3e8427) {
      _0x1ffe18["push"](_0x1ffe18["shift"]());
    }
  };
  _0x269f59(++_0x4a7d05);
})(__0x63b5f, 0x140);
var _0x4da3 = function(_0x3ac5ed, _0x37e7bd) {
  _0x3ac5ed = _0x3ac5ed - 0x0;
  var _0x56e9f4 = __0x63b5f[_0x3ac5ed];
  if (_0x4da3["initialized"] === undefined) {
    (function() {
      var _0x34ebe7 =
        typeof window !== "undefined"
          ? window
          : typeof process === "object" &&
            typeof require === "function" &&
            typeof global === "object"
          ? global
          : this;
      var _0x459bea =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      _0x34ebe7["atob"] ||
        (_0x34ebe7["atob"] = function(_0xf9e031) {
          var _0x55588a = String(_0xf9e031)["replace"](/=+$/, "");
          for (
            var _0x37d7e5 = 0x0,
              _0x594919,
              _0x3b2f3b,
              _0x360f5d = 0x0,
              _0xe8e71d = "";
            (_0x3b2f3b = _0x55588a["charAt"](_0x360f5d++));
            ~_0x3b2f3b &&
            ((_0x594919 =
              _0x37d7e5 % 0x4 ? _0x594919 * 0x40 + _0x3b2f3b : _0x3b2f3b),
            _0x37d7e5++ % 0x4)
              ? (_0xe8e71d += String["fromCharCode"](
                  0xff & (_0x594919 >> ((-0x2 * _0x37d7e5) & 0x6))
                ))
              : 0x0
          ) {
            _0x3b2f3b = _0x459bea["indexOf"](_0x3b2f3b);
          }
          return _0xe8e71d;
        });
    })();
    var _0x2af68a = function(_0x1a2f2f, _0xe213d5) {
      var _0x31a90a = [],
        _0x14572c = 0x0,
        _0x3c5c42,
        _0x1481b0 = "",
        _0x2ef942 = "";
      _0x1a2f2f = atob(_0x1a2f2f);
      for (
        var _0x103afe = 0x0, _0x301424 = _0x1a2f2f["length"];
        _0x103afe < _0x301424;
        _0x103afe++
      ) {
        _0x2ef942 +=
          "%" +
          ("00" + _0x1a2f2f["charCodeAt"](_0x103afe)["toString"](0x10))[
            "slice"
          ](-0x2);
      }
      _0x1a2f2f = decodeURIComponent(_0x2ef942);
      for (var _0x14e924 = 0x0; _0x14e924 < 0x100; _0x14e924++) {
        _0x31a90a[_0x14e924] = _0x14e924;
      }
      for (_0x14e924 = 0x0; _0x14e924 < 0x100; _0x14e924++) {
        _0x14572c =
          (_0x14572c +
            _0x31a90a[_0x14e924] +
            _0xe213d5["charCodeAt"](_0x14e924 % _0xe213d5["length"])) %
          0x100;
        _0x3c5c42 = _0x31a90a[_0x14e924];
        _0x31a90a[_0x14e924] = _0x31a90a[_0x14572c];
        _0x31a90a[_0x14572c] = _0x3c5c42;
      }
      _0x14e924 = 0x0;
      _0x14572c = 0x0;
      for (var _0x94a2d0 = 0x0; _0x94a2d0 < _0x1a2f2f["length"]; _0x94a2d0++) {
        _0x14e924 = (_0x14e924 + 0x1) % 0x100;
        _0x14572c = (_0x14572c + _0x31a90a[_0x14e924]) % 0x100;
        _0x3c5c42 = _0x31a90a[_0x14e924];
        _0x31a90a[_0x14e924] = _0x31a90a[_0x14572c];
        _0x31a90a[_0x14572c] = _0x3c5c42;
        _0x1481b0 += String["fromCharCode"](
          _0x1a2f2f["charCodeAt"](_0x94a2d0) ^
            _0x31a90a[(_0x31a90a[_0x14e924] + _0x31a90a[_0x14572c]) % 0x100]
        );
      }
      return _0x1481b0;
    };
    _0x4da3["rc4"] = _0x2af68a;
    _0x4da3["data"] = {};
    _0x4da3["initialized"] = !![];
  }
  var _0x5c4dcf = _0x4da3["data"][_0x3ac5ed];
  if (_0x5c4dcf === undefined) {
    if (_0x4da3["once"] === undefined) {
      _0x4da3["once"] = !![];
    }
    _0x56e9f4 = _0x4da3["rc4"](_0x56e9f4, _0x37e7bd);
    _0x4da3["data"][_0x3ac5ed] = _0x56e9f4;
  } else {
    _0x56e9f4 = _0x5c4dcf;
  }
  return _0x56e9f4;
};
AV[_0x4da3("0x0", "diVa")]({
  appId: "MyE54xA8SJbJjvYdKzhVdc6M-MdYXbMMI",
  appKey: "SvCuPdNhCYzNnwcYM80LTrTo"
});
if (
  !(
    typeof encode_version !== _0x4da3("0x1", "c74n") &&
    encode_version === _0x4da3("0x2", "eekP")
  )
) {
  window[_0x4da3("0x3", "UDYg")](_0x4da3("0x4", "$[pM"));
}
encode_version = "sojson.v5";
export default {
  name: "App",
  data() {
    return {
      email: "",
      pwd: "",
      pwdConfirm: "",
      groupId: "",
      type:
        window.location.search.indexOf("page=regiest") !== -1
          ? "regiest"
          : "getId", // getId regiest
      name: "",
      desc: ""
    };
  },
  created() {},
  methods: {
    confirm() {
      if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.email)) {
        alert("邮箱不合法");
        return;
      }
      if (!/^[a-z0-9]{6,20}$/i.test(this.pwd)) {
        alert("请输入6-20位的密码");
      }
      AV.User.logIn(this.email, this.pwd).then(
        user => {
          this.groupId = user.get("groupId") || "未查询到groupId,请稍后再试";
        },
        error => {
          alert(error.rawMessage || "不存在用户,请先注册");
        }
      );
    },
    register() {
      if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.email)) {
        alert("请输入正确邮箱");
        return;
      }
      if (!/^[a-z0-9]{6,20}$/i.test(this.pwd)) {
        alert("请设置6-20位的密码");
        return;
      }
      if (this.pwd !== this.pwdConfirm) {
        alert("两次密码比对错误");
        return;
      }
      if (!this.name) {
        alert("请输入分组名");
        return;
      }
      // 创建实例
      var user = new AV.User();
      user.setUsername(this.email);
      user.setPassword(this.pwd);
      user.setEmail(this.email);
      user.set("groupName", this.name);
      user.set("desc", this.desc);
      user.set("pwd", this.pwd);
      user.signUp().then(
        user => {
          alert("注册成功,请在邮箱激活账户,之后重新获取GroupId");
          this.groupId = "";
          this.type = "getId";
        },
        error => {
          alert(error.rawMessage || "注册失败");
        }
      );
    },
    resetPwd() {
      if (confirm("确定重置账户密码?")) {
        if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.email)) {
          alert("邮箱不合法");
          return;
        }
        AV.User.requestPasswordReset(this.email);
        alert("请查收并在邮件中点击重置密码");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./styles/index.scss";

#app {
  width: 100vw;
  font-size: 16px;

  .get-groupid-page,
  .register-page {
    padding: 20px;
    text-align: center;

    .title {
      margin: 20px 10px;
    }

    .reset-pwd {
      text-align: right;
      font-size: 10px;
      margin: -2px 10px;
      color: gray;
      cursor: pointer;
    }

    .ip-row {
      margin-bottom: 4px;
      display: flex;
      align-items: center;

      label {
        margin-right: 10px;
        width: 90px;
        text-align: right;
        display: inline-block;
      }

      input {
        border: 1px solid rgb(204, 202, 202);
        border-radius: 10px;
        outline: unset;
        padding: 2px 10px;
        height: 20px;
      }

      textarea {
        padding: 5px 8px;
      }
    }

    .action-row {
      margin-top: 30px;
      text-align: right;

      .confirm {
        margin-left: 20px;
        border: 1px solid gray;
        border-radius: 5px;
        padding: 4px 10px;
        font-size: 12px;
        cursor: pointer;
        &:active {
          background: #c9c9c9;
        }
      }

      .nav-link {
        font-size: 13px;
      }
    }

    .result {
      margin: 20px 0;
      padding: 0 10px;
      color: rgb(0, 119, 255);
      font-size: 12px;

      .groupId {
        font-weight: bold;
        font-size: 14px;
        span {
          font-weight: normal;
          color: rgb(199, 102, 23);
          background: rgb(173, 171, 171);
          padding: 2px 5px;
        }
        margin-bottom: 5px;
      }
    }
  }

  .register-page {
    .title {
      margin-bottom: 40px;
    }

    .ip-row {
      margin-bottom: 15px;
    }
  }
}
</style>
