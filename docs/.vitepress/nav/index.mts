import { getFirstMdOfFirstFolder } from "../utils/getFirstMdOfFirstFolder.mjs";
import path from 'path'

export default [ 
  { text: '主页', link: '/' },
  { text: '文章', link: '/blogs' },
  { text: '分类', link: getFirstMdOfFirstFolder(path.resolve(__dirname, '../../notes')) }
]