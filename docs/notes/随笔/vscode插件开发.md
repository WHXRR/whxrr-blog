---
title: "vscode插件开发"
outline: deep
desc: "vscode插件开发常用命令"
tags: "vscode"
updateTime: "2025-06-10 11:27"
pic: https://cdn.pixabay.com/photo/2020/04/19/09/16/scenery-5062632_1280.jpg
picSize: 1280x853
---

## 创建项目

需要用到 yo generate-code 这两个库

```js
pnpm i -g yo generate-code
```

## 初始化

```js
yo code
```

## 打包

先安装 vsce

```js
pnpm i -g vsce
```

```js
vsce package
```

## 发布

```js
vsce publish
```
