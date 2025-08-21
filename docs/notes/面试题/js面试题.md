---
title: "js面试题"
outline: deep
desc: "js相关的面试题"
tags: "js"
updateTime: "2025-06-20 17:24"
pic: https://public.ysjf.com/mediastorm/material/material/西沃德-哈苏照片-03-全景-20250107.JPG
picSize: 800x600
---

## js 基本数据类型有哪些

::: details 查看答案

string,number,boolean,null,undefined,bigint,symbol

:::

## 数据类型检测的方式有哪些

::: details 查看答案

1. 可以用 typeof 检测，但是对于数组、对象、null 都会返回 object，无法区分

2. instanceof 检测，但是只能检测引用类型

3. 通过 constructor 检测，所有类型都能检测，但是可以被改写

4. Object.prototype.toString.call(),这个方法也能检测所有的类型

:::

## 判断数组的方式有哪些

::: details 查看答案

1. Array.isArray()

2. Object.prototype.tosString.call()

3. instanceof

:::

## 请简述 JavaScript 中的 this

::: details 查看答案

this 的指向一般分为几种情况：

1. 作为独立函数调用的时候，this 执行全局对象

2. 通过 new 调用的时候，this 执行新创建出来的对象

3. 通过对象点的方式调用时，this 执行调用的对象

4. 通过 call，apply，bind 等方式调用时，this 指向传入的对象

:::

## 箭头函数与普通函数有什么区别

::: details 查看答案

1. 箭头函数比普通函数的写法更简洁，如果返回体只有一行代码还可以省略大括号

2. 箭头函数没有自己的 this，他会继承上一层作用域的 this

3. 箭头函数不能作为构造函数来调用

4. 箭头函数无法通过 call,apply,bind 改变 this 指向

5. 箭头函数没有 arguments 参数

6. 箭头函数没有 prototype 属性

:::

## let、const、var 的区别

::: details 查看答案

1. let，const 声明的变量有块级作用域，var 声明的没有

2. var 声会造成变量提升，可以在声明前调用

3. var 声明的变量可以重复声明

4. var 声明的变量是全局变量，会挂载到 window 上

5. const 声明的变量不允许被修改，引用类型不允许修改引用地址

:::

## new 操作符的实现原理

::: details 查看答案

1. 首先创建一个新对象

2. 将新对象的**proto**指向构造函数的 prototype

3. 让 this 指向新对象，然后执行构造函数的方法

4. 如果构造函数返回的是一个对象那么将这个对象返回，如果是一个值类型，则返回上面创建的新对象

:::

## 数组有哪些原生方法？

::: details 查看答案

1. push, pop, shift, unshift,分别对应数组的尾部添加，尾部删除，头部添加和头部删除

2. slice: 截取数组的一部分，不影响原数组

3. splice：可以对数组进行增加、删除和替换，影响原数组

4. sort： 排序

5. map、forEach、filter、every、some： 用来遍历数组

6. join：将数组转换成字符串

7. reverse：将数组反转

8. concat：将两个数组拼接成一个新数组

9. indexOf、lastIndexOf：查找元素的下标

:::

## for in 和 for of 的区别

::: details 查看答案

1. for in 可以用来遍历数组和对象，for of 只能用来遍历数组和类数组对象

2. for in 会遍历对象原型链上的属性，性能较差

3. for in 遍历数组时拿到的是数组的下标，for of 拿到的是数组的值

:::

## 原型和原型链

::: details 查看答案

原型其实就是一个对象，每个对象都有一个隐式原型，在浏览器中可以通过**proto**获取，而函数不仅有隐式原型，还有个显示原型，通过 prototype 获取。
当我们在一个对象上访问不存在的属性时，他会先在自身查找，如果没找到则会去自身的原型上查找，原型上也没有的话则会顺着原型的原型一路向上查找，直到尽头的 Object.prototype 为止，这种向上查找的链式结构叫做原型链。

:::

## 执行上下文是什么？

::: details 查看答案

执行上下文就是 JS 代码执行时的运行环境，他主要分为全局上下文和函数上下文

:::

## 说说作用域和作用域链

::: details 查看答案

作用域就是当前变量可访问的范围，分为全局作用域、函数作用域和块级作用域。

而作用域链的话就是，比如你在函数中想访问全局作用域中的变量，那么 js 首先会在函数中查找，如果没找到则会去全局中查找，这种查找的链式结构叫做作用域链。

:::

## 说说闭包

::: details 查看答案

闭包其实可以理解成一种现象，当一个函数内部引用了它外部函数作用域中的变量，就会形成闭包。
闭包会导致被引用的变量无法被垃圾回收机制回收，所以容易造成内存泄漏。
不过也可以利用闭包这个特性来创建私有变量。

:::

## call、apply 及 bind 有什么区别？

::: details 查看答案

这三个函数都能用来改变 this 的指向

call 的参数不固定，第一个为 this 指向的对象，后面的参数会被依次传入要执行的函数。

apply 的参数只有两个，第一个也是 this 指向的对象，第二个是数组，传入要执行的函数的参数。

bind 只有一个参数，传入 this 指向的对象后不会立即指向函数，而是返回一个新的函数。

:::

## 有用过 Promise 吗，说说你对它的理解

::: details 查看答案

promise 是一种异步操作的解决方案，他有三个状态，分别是 pending、fulfilled、rejected，一旦从 pending 改为其他的状态后无法再改变。
可以通过.then 方法来执行 promise 成功时候的操作，通过 catch 方法来执行 promise 失败时候的操作。
promise 有几个常用的方法，比如：

1. promise.all： 可以同时执行多个 promise，全部成功才返回成功的结果，只要有一个失败就返回失败的结果

2. promise.race： 谁先返回就用谁的结果

3. promise.allSettled: 所有都返回时才返回结果，不管失败还是成功

4. promise.any: 只要有一个成功就返回成功的结果，所有都失败才返回失败的结果

:::

## 数组去重

::: details 查看答案

1. Set 实现

```js
const arr = [1, 2, 3, 1, 1, 2, 3, 5, 4, 5, 5, 6, 4, 2, 5];
const result = [...new Set(arr)];
```

2. 利用 filter 和 indexOf

```js
const arr = [1, 2, 3, 1, 1, 2, 3, 5, 4, 5, 5, 6, 4, 2, 5];
const result = arr.filter((item, index) => arr.indexOf(item) === index);
```

3. reduce 实现

```js
const arr = [1, 2, 3, 1, 1, 2, 3, 5, 4, 5, 5, 6, 4, 2, 5];
const result = arr.reduce(
  (pre, next) => (pre.includes(next) ? pre : [...pre, next]),
  []
);
```

:::

## 说一下浏览器的事件循环机制

::: details 查看答案

JavaScript 是单线程的，事件循环负责调度同步和异步任务。任务分为宏任务和微任务，每次先执行一个宏任务，再清空微任务队列，然后进入下一个宏任务。

常见的宏任务有：

- setTimeout
- setInterval
- ui 渲染

常见的微任务有：

- promise.then/catch
- mutationObserver
- queueMicrotask

:::
