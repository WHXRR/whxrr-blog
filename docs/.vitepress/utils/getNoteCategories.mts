import fs from 'fs'
import path from 'path'


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

  result.sort((pre, next) => {
    if (pre.text === '随笔') return -1
    if (next.text === '随笔') return 1
    return 0
  })

  return result

}