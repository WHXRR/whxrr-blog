---
title: "Vite中配置prettier"
outline: deep
desc: "Vite中配置prettier"
tags: "vitepress|github|giscus"
updateTime: "2025-07-21 16:41"
pic: https://cdn.pixabay.com/photo/2013/10/09/02/26/lake-192979_1280.jpg
picSize: 1280x863
---

## 1. 防止与 eslint 冲突，安装一些插件

```
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

## 2. 在 eslint.config.js 中加入代码

```js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import eslintPluginPrettier from "eslint-plugin-prettier";
import prettier from "eslint-config-prettier";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  prettier,
]);
```

## 3. 创建.prettierrc 文件

```js
{
  "singleQuote": true,
  "semi": false,
  "bracketSpacing": true,
  "htmlWhitespaceSensitivity": "ignore",
  "endOfLine": "auto",
  "trailingComma": "all",
  "tabWidth": 2
}
```

## 4. 创建.prettierignore 文件

```
node_modules
dist
build
*.log
```

## 5. package.json 中添加格式化脚本

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "format": "prettier --write ."
}
```

> [!TIP]
> 如果使用的是 vscode，快捷键 shift+alt+f 格式化不起作用时，可以使用 CTRL + Shift + P，搜索 Format Document，选择使用...格式化文档，选择配置默认格式化程序中选择 prettier 即可。
