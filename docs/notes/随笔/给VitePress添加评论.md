---
title: "为 VitePress 添加 Giscus 评论系统"
outline: deep
desc: "通过 GitHub Discussions 为你的 VitePress 博客添加轻量、安全、开源的评论系统"
tags: "vitepress|github|giscus"
updateTime: "2025-06-12 22:41"
pic: https://cdn.pixabay.com/photo/2014/07/15/23/36/github-394322_1280.png
picSize: 1280x640
---

[Giscus](https://giscus.app/) 是一个基于 GitHub Discussions 的开源评论系统，支持 GitHub 登录、反应表情、深色模式自动适配，并且评论内容托管在 GitHub，无需自建数据库，非常适合用于博客系统。

本指南将手把手教你如何为你的 VitePress 站点集成 Giscus 评论功能。

## 🧩 Giscus 特点简介

- 🆓 完全免费，无广告
- 🔐 数据存储在 GitHub Discussions，安全透明
- 🎨 自动适配网站亮/暗模式
- 🚀 无需后端，部署简单
- 📥 支持懒加载和评论 Reactions
- 🧑‍💻 支持 GitHub 登录发表评论

## 🚀 配置步骤

### 1. 开启仓库的 Github Discussions

- 1.1
  giscus 连接到的仓库必须是公开的
- 1.2
  访问 [giscus](https://github.com/apps/giscus) 进行安装
- 1.3
  配置要添加评论的仓库，点击保存
- 1.4
  回到你刚添加的仓库，点击上方的 Discussions 进行启用

### 2. 获取 Giscus 的配置参数

- 2.1
  访问 [Giscus](https://giscus.app/zh-CN) 官网，填写你的仓库信息，并获取配置参数。
- 2.2
  根据你选择的配置参数，下方会生成对应的 js 代码，主要记住 data-repo-id、data-category-id 这两个参数，后面会用到。

### 3. 添加 Giscus 评论组件

- 3.1
  npm 安装

```js
npm i @giscus/vue
```

- 3.2
  在 .vitepress/theme/components 目录下新建 GiscusComment.vue 文件

```js
<script setup lang="ts">
import Giscus from "@giscus/vue";
import { useRoute, useData } from "vitepress";

const route = useRoute();
const { isDark } = useData();
</script>
<template>
  <div class="pt-14">
    <Giscus
      id="comments"
      repo="WHXRR/whxrr-blog"
      repoId="xxxx"
      category="Announcements"
      categoryId="xxxx"
      mapping="pathname"
      term="Welcome to giscus!"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      :theme="isDark ? 'dark' : 'light'"
      lang="zh-CN"
      loading="lazy"
      :key="route.path"
    />
  </div>
</template>

<style scoped lang="scss"></style>

</script>
```

> [!TIP]
> :key="route.path" 用于刷新评论组件，保证每个页面都有独立的评论

- 3.3
  在 .vitepress/theme/index.ts 中引入 GiscusComment 组件

```js
import { h } from "vue";
import Theme from "vitepress/theme";
import GiscusComment from "./components/GiscusComment.vue";

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      "doc-after": () => h(GiscusComment),
    });
  },
};
```

### 4. 完成 🎉
