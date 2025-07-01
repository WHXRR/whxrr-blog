---
title: "react面试题"
outline: deep
desc: "react相关的面试题"
tags: "react"
updateTime: "2025-07-01 10:33"
pic: https://cdn.pixabay.com/photo/2020/08/27/09/09/village-5521554_1280.jpg
picSize: 1280x929
---

## React18 新特性

::: details 查看答案

1. 自动批处理，同一个事件中多个 setState 会被合并

2. starTransition：可以用来包裹不是很重要的更新，react 会先处理其他高优先级的任务再来处理这里的更新

3. Suspense 支持服务端渲染

4. React.createRoot 替换 React.render

5. 一些新 hook：useId，useDeferredValue，useTransition

:::

## React 性能优化

::: details 查看答案

- 合理利用 memo 来规避子组件不必要的渲染

- 合理使用 useMemo 和 useCallback 来缓存计算结果和函数

- 使用 React.lazy 将组件懒加载

- 简化 state 中的数据

- 减少 Context 频繁更新

:::

## React 状态管理器

::: details 查看答案

1. Redux

![redux](/notes/react/1.jpg)

![redux](/notes/react/2.jpg)

![redux](/notes/react/3.jpg)

2. Zustand

![zustand](/notes/react/4.jpg)

![zustand](/notes/react/5.jpg)

:::

## 相对于传统 class， Hooks 有哪些优势?

::: details 查看答案

1. 写法更简单，而且没有 this 的绑定问题

2. 可以进行封装，更好的复用

:::

## 实现 useTimeout hook

::: details 查看答案

```js
import { useEffect, useRef } from "react";

export function useTimeout(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const timer = setTimeout(() => {
        savedCallback.current();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);
}
```

:::

## setState 是同步还是异步？

::: details 查看答案

在 react18 之前：

在 promise.then、js 原生事件、定时器等方法中是同步的。

在 react 的合成事件中是异步的

在 react18 之后添加了批处理，所以都是异步的

:::

## 为什么要有合成事件？

::: details 查看答案

1. 为了兼容各种浏览器，统一事件行为

2. react 会将所有事件绑定到 document 上，通过事件委托来统一管理事件，提升性能

:::

## React 中，父子组件的生命周期执行顺序

::: details 查看答案

1. 函数式组件

```js
function Parent() {
  console.log("父");
  useEffect(() => {
    console.log("👨‍👦 Parent mounted");
    return () => console.log("👨‍👦 Parent unmounted");
  }, []);

  return <Child />;
}

function Child() {
  console.log("子");
  useEffect(() => {
    console.log("👶 Child mounted");
    return () => console.log("👶 Child unmounted");
  }, []);

  return <div>child</div>;
}

function App() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={() => setShow(!show)}>toggle</button>
      {show && <Parent />}
    </div>
  );
}
```

上面的代码的打印顺序是

挂载时：

```
父
子
👶 Child mounted
👨‍👦 Parent mounted
```

卸载时：

```
👨‍👦 Parent unmounted
👶 Child unmounted
```

2. 类组件

```js
class Parent extends React.Component {
  constructor() {
    super();
    console.log("👨‍👦 Parent constructor");
  }

  componentDidMount() {
    console.log("👨‍👦 Parent didMount");
  }

  render() {
    return <Child />;
  }
}

class Child extends React.Component {
  constructor() {
    super();
    console.log("👶 Child constructor");
  }

  componentDidMount() {
    console.log("👶 Child didMount");
  }

  render() {
    return <div>child</div>;
  }
}
```

挂载时：

```
1. 👨‍👦 Parent constructor
2. 👨‍👦 Parent render
3. 👶 Child constructor
4. 👶 Child render
5. 👶 Child componentDidMount
6. 👨‍👦 Parent componentDidMount
```

卸载时：

```
1. 👶 Child componentWillUnmount
2. 👨‍👦 Parent componentWillUnmount
```

:::

## React 服务端渲染（SSR）原理？

::: details 查看答案

服务端会根据客户端请求的路径，找到对应的 react 路由组件，然后通过内置的 renderToString 方法将组件渲染成 html 字符串，返回给浏览器。浏览器拿到之后会进行渲染，还有事件的绑定和交互。

:::

## useEffect 和 useLayoutEffect 的区别

::: details 查看答案
他们的主要区别是执行时机不同，useLayoutEffect 会在 dom 更新完成，浏览器绘制之前执行，在这里做 dom 的修改，用户是感知不到的，而且他是同步执行的，要避免做一些耗时过长的事情。

useEffect 是等浏览器绘制完成之后才执行的，假如在这里修改 dom 的背景色会导致页面闪烁，一般用来做数据请求，逻辑处理等任务。
:::

## JSX 的本质是什么？

::: details 查看答案

jsx 是 js 的一种语法扩展，它能够在 js 中编写 html 的语法。需要用 babel 来转成 js 代码，然后生成 react 对象。

:::

## 如何理解 React Fiber？

::: details 查看答案

react fiber 是 react 为了解决大量组件更新导致页面 ui 被阻塞的问题而设计的新架构。它能够把一次复杂的更新任务拆分成很多小任务分片执行，还实现了可中断、可恢复的异步渲染，优先级调度等功能。

以前的 react 是通过递归遍历组件树来进行更新的，一旦开始就不能中断。如果组件很深、要更新的地方很多，就会一直占用主线程，可能会导致用户的输入、动画等变得卡顿、掉帧。

现在是通过将虚拟 dom 转换成一个链表结构，每个组件代表一个 fiber 节点，主要包含以下信息：

- 组件类型： 有函数组件、类组件、原生标签

- 节点对应的 props 和 state

- 副作用信息（比如 useEffect、ref）

- 调度信息，比如优先级

- 节点间的关系：parent、child、sibling、alternate（对应旧节点）

整个更新流程被拆成两个阶段：

1. 首先是 Render（调和阶段）

React 会从根节点开始，逐层构建新的 Fiber 树，同时跟旧的 Fiber 树做对比。

- 如果类型和 key 一样，表示可以复用

- 如果不同则销毁重建

- 如果旧节点有，新节点没有，直接删除旧节点

- 如果旧节点没有，新节点有，新增节点

这个阶段是可以中断的，React 可以根据任务优先级、空闲时间去调度，提升性能。

2. 第二阶段是 Commit（提交阶段）

React 会把前面标记好的变更（插入、删除、更新）统一应用到真实 DOM 上，这个阶段是同步的，不可中断的。

:::

## React 的 diff 算法

::: details 查看答案

React 的 diff 算法是用来比较新旧虚拟 DOM 的差异的，找出哪些地方需要更新的。它的目标是尽可能少地操作真实 DOM，以提升性能。

它有几个规则：

1. 只进行同层比较

2. 节点类型相同则进行复用，不同则销毁重建

3. 多个子节点时用 key 来辅助比较

:::

## 为何 React JSX 循环需要使用 key ？

::: details 查看答案

react 通过 key 来对每个元素做唯一标识，可以用来快速判断哪些节点是新增的，哪些节点是移除的。

还能够避免状态混乱，如果列表项是输入框或者其他有状态的组件，错误的 key 会导致组件与错误的内容进行绑定，导致页面渲染错误。

:::

## React 事件和 DOM 事件有什么区别？

::: details 查看答案

1. 事件名称不一样，原生的事件全小写，react 的是小驼峰命名。

2. 事件对象不一样，react 的合成事件对原生的事件对象进行了一层包装，可以通过 e.nativeEvent 获取原生事件对象。

3. react 事件绑定到 document 上，通过事件委托来处理

:::

## 为何 React Hooks 不能放在条件或循环之内？

::: details 查看答案

因为 React 是靠调用顺序来判断每个 Hook 的位置的，如果你把 Hook 放在 if 或 for 里面，调用顺序就可能不一致，React 就无法正确匹配每次渲染时该执行哪个 Hook，可能导致状态错乱或者报错。

:::

## React 的生命周期

::: details 查看答案

react 的生命周期分为两个版本。

在 16.3 之前，react 的生命周期一般包含三个部分：挂载阶段、更新阶段、卸载阶段

- 挂载阶段包括：

  constructor： 执行初始化操作

  componentWillMount：即将挂载时触发

  render

  componentDidMount

- 更新阶段：

  componentWillReceiveProps：父组件传递的属性有变化时触发

  shouldComponentUpdate：通过返回布尔值来控制组件是否更新

  componentWillUpdate：即将更新时触发

  render

  componentDidUpdate

- 卸载阶段：

  componentWillUnMount

在 16.3 之后引入了新的生命周期方法：

- 挂载阶段：

  constructor

  getDerivedStateFromProps：当 props 改变时，更新 state，有两个参数，第一个是新的 props，第二个是 state，返回一个新的 state 或者 null 表示不变

  render

  componentDidMount

- 更新阶段：

  getDerivedStateFromProps

  shouldComponentUpdate

  render

  getSnapshotBeforeUpdate：可以在 dom 更新前记录状态，比如滚动条位置

  componentDidUpdate

- 卸载阶段：

  componentWillUnmount

也可以通过 useEffect 进行模拟：

```js
useEffect(() => {
  console.log("componentDidMount");
}, []);

useEffect(() => {
  console.log("componentDidUpdate");
}, [deps]);

useEffect(() => {
  return () => {
    console.log("componentWillUnmount");
  };
}, []);
```

:::
