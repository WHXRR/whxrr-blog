import { defineConfig } from 'vitepress'
import nav from './nav/index.mjs'
import { getSidebarData } from './utils/getSidebar.mjs'
import path from 'path'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "念白集",
  description: "记录一些个人随笔",
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo.png",
    siteTitle: false,
    nav,
    sidebar: {
      '/notes/': getSidebarData(path.resolve(__dirname, '../notes'))
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/WHXRR' }
    ],
    footer: {
      message: "Released under the MIT License",
    },
    search: {
      provider: 'local'
    }
  },
  markdown: {
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true
    }
  }
})
