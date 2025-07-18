---
title: "Vite中一些TS的报错"
outline: deep
desc: "Vite中一些TS的报错"
tags: "Vite"
updateTime: "2025-07-18 15:44"
pic: https://cdn.pixabay.com/photo/2020/12/29/04/10/sea-5869303_1280.jpg
picSize: 1280x854
---

## 1. 路径别名的配置

### vite.config.ts

```js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

### tsconfig.app.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## 2. node 模块报错

```
npm install @types/node --save-dev
```
