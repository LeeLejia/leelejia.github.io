---
layout: post
title: Typescript进阶技巧
subtitle: 生命诚可贵，快用typescript！
date: 2019-03-13 10:15
author: Youga
header-img: https://source.unsplash.com/900x400/?web&a=1232
catalog: true
tags:
  - web
---

差不多想戒`javascript`了。哎，生命诚可贵，快用 typescript！

tips: 第三方包如果存在声明描述错误的情况，可以另写声明覆盖。消灭小红点！
例如 Taro getStorage Promise 值类型错误，可以重写声明覆盖：

```typescript
namespace Taro {
  namespace getStorage {
    export type Promised = {
      data: any;
    };
    export type Param = {
      key: string;
    };
  }
  export declare function getStorage(
    OBJECT: getStorage.Param
  ): Promise<getStorage.Promised>;
}
```

- `typeof` 使用已有变量声明类型

```typescript
const obj = {
  a: 123,
  b: "test"
};
type Obj = typeof obj;
// 此时其实相当于定义了类型： type Obj = { a: number, b: string }
// 且 obj 也被 Obj类型限制，不能动态修改类型
```

- `keyof` 获取某个类型成员

```typescript
type Obj = { a: number; b: string };
function func(arg: keyof Obj) {
  // todo
}
// arg 只能传入字符串 "a" 或者 "b"
// 相当于： func(arg: "a" | "b"): void
```

- `<T>` 、`in` 、`extends` 范形属性限制

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
// 例如
type testType = Pick<{ a: number; b: string; c: boolean }, "a" | "b">;
const test: testType; // 将 c 属性剔除
```

## todo

待补充，待系统查看文档。
