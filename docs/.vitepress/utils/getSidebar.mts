import fs from 'fs'
import path from 'path'

/**
 * 获取指定目录（如 notes）的 sidebar 数据
 * @param baseDir 相对于当前文件的基础路径，例如 path.resolve(__dirname, '../notes')
 * @param baseRoute 路由前缀，例如 '/notes'
 */
export function getSidebarData(baseDir: string, baseRoute: string = '/notes') {
  const result: {
    text: string
    items: { text: string; link: string }[]
  }[] = []

  const folders = fs.readdirSync(baseDir)

  folders.forEach(folder => {
    const folderPath = path.join(baseDir, folder)
    if (fs.statSync(folderPath).isDirectory()) {
      const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.md'))
      const items = files.map(file => ({
        text: path.basename(file, '.md'),
        link: `${baseRoute}/${folder}/${path.basename(file, '.md')}`
      }))
      result.push({ text: folder, items })
    }
  })

  return result
}