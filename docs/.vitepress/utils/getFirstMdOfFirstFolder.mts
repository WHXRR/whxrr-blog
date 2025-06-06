import fs from 'fs'
import path from 'path'

/**
 * 获取 notes 下第一个文件夹的第一个 md 文件
 * @param baseDir 本地目录，例如 path.resolve(__dirname, '../notes')
 * @param baseRoute 路由前缀，例如 '/notes'
 */
export function getFirstMdOfFirstFolder(baseDir: string, baseRoute = '/notes') {
  const folders = fs.readdirSync(baseDir).filter(name => {
    const fullPath = path.join(baseDir, name)
    return fs.statSync(fullPath).isDirectory()
  })

  if (folders.length === 0) return ''

  const firstFolder = folders[0]
  const firstFolderPath = path.join(baseDir, firstFolder)

  const mdFiles = fs.readdirSync(firstFolderPath).filter(f => f.endsWith('.md')).sort()

  if (mdFiles.length === 0) return ''

  const firstFile = path.basename(mdFiles[0], '.md')

  return `${baseRoute}/${firstFolder}/${firstFile}`
}
