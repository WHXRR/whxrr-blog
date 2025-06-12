import { getNoteCategories } from "../utils/getNoteCategories.mjs";
import path from 'path'

export default [
  { text: '主页', link: '/' },
  { text: '文章', link: '/blogs' },
  { text: '分类', items: getNoteCategories(path.resolve(__dirname, '../../notes')) }
]
