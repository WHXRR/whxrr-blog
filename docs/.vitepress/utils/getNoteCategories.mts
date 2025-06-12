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


export function getNoteCategories(baseDir: string, baseRoute = '/notes') {
  const result: { text: string; link: string }[] = []

  const folders = fs.readdirSync(baseDir)

  folders.forEach(folder => {
    const folderPath = path.join(baseDir, folder)
    if (fs.statSync(folderPath).isDirectory()) {
      const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.md'))
      if (files.length) {
        const link = `${baseRoute}/${folder}/${path.basename(files[0], '.md')}`
        result.push({ text: folder, link })
      }
    }
  })

  return result

}