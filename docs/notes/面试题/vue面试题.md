---
title: "vue面试题"
outline: deep
desc: "vue相关的面试题"
tags: "vue"
updateTime: "2025-06-20 15:33"
pic: https://public.ysjf.com/product/preview/IOpmVib-OG.jpg
picSize: 1278x720
---

## vue 的生命周期有哪些？

::: details 查看答案

在 vue2 中，首先是

beforeCreate：这个生命周期中实例刚刚创建，数据和事件都还没有初始化。

created：这个生命周期数据和事件已经初始化了，可以做一些接口请求的工作。

beforeMount：这里模板编译已经完成了，但是还未挂载到 dom 上。

mounted：这里组件挂载完成，可以操作 dom，适合做跟 dom 操作相关的初始化工作。

beforeUpdate：数据更新之前会调用，这里可以访问旧的 dom 和数据。

updated：数据更新完成之后，dom 已经是最新状态。

最后就是 beforeDestroy 和 destroyed 了，这两个就是组件销毁前和销毁后的生命周期。

而在 vue3 中基本跟 vue2 差不多，只是 beforeCreate 和 created 变成了 setup，而且 setup 是早于 created 执行的，还有就是 beforeDestroy 和 destroyed 变成了 onBeforeUnmount 和 onUnmounted。

:::

## vue 响应式原理是什么？vue3 的响应式有何不同？

::: details 查看答案

vue2 的响应式是通过 Object.defineProperty 实现的，他会把 data 中的属性进行劫持，改写他们的 setter 和 getter，当我们修改数据的时候就会触发视图的更新。但是 vue2 的响应式是有局限性的，比如无法监听新增的属性，通过修改数组的下标无法触发响应式，而且他是通过循环遍历对象的 key 来劫持的，如果对象层级很深，性能也不太好。

vue3 就换成了 proxy，这个是 es6 的新特性，它可以生成一个代理对象，并且能够监听对象的十几种变化，包括新增、删除、数组下标的变化等等，性能也更好，只是兼容性不好，不支持 ie 浏览器。

:::

## vue3 和 vue2 的区别

::: details 查看答案

首先底层上 vue2 和 vue3 的响应式实现不一样了，vue2 是用的 Object.defineProperty,而 vue3 是用的 proxy 实现的，性能上会更好。

vue3 使用 ts 进行重写，对 ts 的支持更好，同时对编译进行了优化，对所有的静态节点做了标记和提升，diff 的时候直接跳过静态节点的对比。

然后是写法上，vue2 是 options api，变量、方法、都只能写在规定的 data，methods 中，而 vue3 是 composition api，通过 ref、reactive 来定义响应式变量，watch、computed 等一些 api 也从变量的写法变成了函数写法，然后还支持自定义 hooks，在项目中代码的可复用性更高，写起来也更灵活。

然后生命周期也有变化，vue3 中移除了 vue2 的 beforeCreate 和 created，用 setup 代替，其他生命周期的名称也有变化。

还有父子组件传值，vue2 中子组件获取父组件穿的值通过 this.props，发送事件是通过 this.$emit，而 vue3 中要先通过 defineProps 和 defineEmits 来定义父组件传过来的值和你要发出的事件，然后才能使用。
还有 v-model，vue2 只支持绑定一个 v-model，vue3 支持多个，通过 v-model:xxx 来绑定。而且 v-model 其实是 v-bind 和 v-on 的语法糖。vue2 中默认传入的是 value，事件名称是 input，而 vue3 默认是 modelValue，事件名称是 update:modelValue。

最后是生态方面的变化，vue2 的状态管理是 vuex，vue3 换成了 pinia，vue-router 也换成了 vue-router4，vue-cli 也换成了 vite，对应的写法也有所不同。

:::

## 谈一谈对 MVVM 的理解

::: details 查看答案

MVVM 就是分三个部分，分别是 Model、view、viewModel。

Model 就是数据层，View 是视图层，viewModel 就是连接他们的桥梁，我们在 vue 中写的代码就是在操作 viewModel，通过这个它能够自动帮我们更新页面，反正我们在页面上修改内容，数据也会自动更新。

:::

## vue2 和 vue3 渲染器的 diff 算法分别说一下？

::: details 查看答案

vue 的 diff 算法主要用于比较新旧虚拟 dom 的差异，并生成最小的更新操作，从而达到更新视图的目的。

vue2 的 diff 算法是使用双端比较的，主要分为新旧虚拟 dom 的头跟头相比，尾跟尾相比，新 dom 的头部和旧 dom 的尾部，新 dom 的尾部和旧 dom 的头部相比，通过标签和 key 来判断是否相同。

vue3 的则是在 vue2 的基础上做了些优化，新头跟旧头，新尾跟旧尾比较后，如果都不匹配的话剩下的中间部分会生成一个新节点索引到旧节点索引的映射表，用最长递增子序列来判断哪些节点是能复用并保持顺序的，剩下的节点就进行移动或者插入。

还有其他的优化，比如静态节点提升，在编译阶段就把不会改变的节点提取出来，在 diff 的时候直接跳过。

:::

## keep-alive 的常用属性有哪些及实现原理

::: details 查看答案

keep-alive 是用来缓存组件的状态和 DOM，防止频繁卸载和创建，一般用于路由切换或 tab 切换这些，可以提高性能。

他主要有两个属性，一个是 include，一个是 exclude，这两个都是用来做条件缓存的。还有一个 max，最多缓存多少个组件。

然后用了 keep-alive 的组件会多两个生命周期，分别是 activated 和 deactivated，会在活跃状态和失活状态时触发。

原理就是将组件的 vnode 和 dom 保存在对象中，切换组件的时候不会把这个对象销毁，下次使用的时候直接从内存中拿到这个对象进行渲染。

:::

## nextTick 的作用是什么？他的实现原理是什么？

::: details 查看答案

nextTick 主要用于在 dom 更新完成之后执行某个回调。因为 vue 的更新是异步的，所以你在修改某个变量之后直接获取 dom 的值是获取不到最新的，这时候要用 nextTick 获取。

它的原理其实就是利用的 js 的事件循环机制，将 nextTick 中的回调函数放到微任务队列中，等到 vue 更新完成后再执行这个队列。

这个微任务队列首先是使用 promise.then，如果浏览器不支持的话依次使用 MutationObserver、setImmediate、setTimeout。

:::

## Vue 组件的 data 为什么必须是函数

::: details 查看答案

因为 vue 的组件是可以被复用很多次的，如果用对象的话，一个组件的内部值修改了，那么其他组件的值也会被修改。而函数能保证每个组件都能有自己独立的数据，不会互相影响。

:::

## 说一下 Vue compiler 的实现原理是什么样的？

::: details 查看答案

vue 的 compiler 主要用来将我们写的 template 解析成 render 函数，它分为三个阶段：

第一步是 parse 阶段，他会把我们写的模板字符串解析成抽象语法树，这里面会包含标签名、属性、子节点等信息。

第二步是优化阶段，会将静态节点进行标记，用于后面的 diff 比较，提高性能。

第三步是生成阶段，会把抽象语法树转换成 render 函数，然后执行 render 函数生成虚拟 dom。

:::

## Vue 与 React 有什么区别？

::: details 查看答案

首先他们的模板写法不一样，vue 是在 template 中写模板语法，类似于传统的 html，而 react 是通过写 jsx，将 html in js 的写法。

然后他们的响应式原理也不一样，vue2 是通过 Object.defineProperty 实现，vue3 换成了 proxy，不管哪个都是自动更新的，而 react 是通过 useState 这个 hooks 来实现的，需要手动调用 setState 来更新。

他们的通信也不太一样，vue 父子组件通信通过 props 和 emit，而 react 通过 props 和回调函数通信。

然后性能优化方面，vue 在编译阶段就通过静态标记，静态节点提升自动做了优化，而 react 需要通过 memo，useMemo，useCallback 等 hooks 来手动优化。

然后是工具链和生态方面不一样，因为 react 出现的时间比较早，所以相比于 vue，react 的生态比较成熟。

:::

## 说一下 watch 与 computed 的区别是什么？

::: details 查看答案

computed 是用来做计算的，他是有返回值的，更看重的是基于其他的响应式数据计算返回的结果，而且他是有缓存的，只有依赖的数据发生变化，他才会重新计算。

而 watch 是更看重过程，比如当监听的数据变化后，他要重新请求接口，或者执行别的逻辑。

:::

## 如何实现 vue 项目中的性能优化？

::: details 查看答案

我觉得可以从两个方面来优化，一个是开发阶段，编写代码时的优化

- 将组件拆分成更小的组件，降低更新影响范围。
- 使用 keep-alive 缓存组件，避免频繁的更新和创建。
- 使用 v-for 的时候加上 key。
- 使用异步组件，实现按需加载，减少首屏加载时间。
- 使用路由懒加载将路由组件拆分成多个文件，只有当路由被访问的时候才加载对应组件。
- 图片加上懒加载，也能减少首屏加载时间。

第二个就是打包优化

- 代码压缩跟代码分割
- 代码进行 tree shaking
- 图片压缩
- 使用 cdn 加载第三方模块

:::

## Vue 中的 Key 的作用是什么？

::: details 查看答案

这个 key 是用来给每个虚拟 dom 节点一个唯一标识符的，能够帮助 vue 用来对比新旧节点的关系。

因为 vue 要通过 key 来判断新旧虚拟 dom 是不是同一个节点的，然后再根据这个判断来进行删除、新增和更新。

:::
