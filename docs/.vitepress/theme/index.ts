// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Home from './pages/Home.vue'
import DocTitle from './components/DocTitle.vue'
import GiscusComment from './components/GiscusComment.vue';
import Footer from './components/Footer.vue';
import './style.css'
import './custom.scss'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'home-hero-before': () => h(Home),
      'doc-before': () => h(DocTitle),
      'doc-after': () => h(GiscusComment),
      'layout-bottom': () => h(Footer)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
