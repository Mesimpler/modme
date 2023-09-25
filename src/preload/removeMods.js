import fse from 'fs-extra'
import { getFileList } from './utils'
import path from 'path'

async function removeMods(profile) {
  const targetDir = 'E:/Game/HoneyCome'
  const excludeFiles = ['modme.json']
  const modFiles = await getFileList(profile.relativePath)

  for (const file of modFiles) {
    const isExcludeFile = excludeFiles.some((f) => file.relativePath.includes(f))
    if (isExcludeFile) continue

    const targetAbsolutePath = path.join(targetDir, file.relativePath)
    await fse.remove(targetAbsolutePath)
  }
}

export default removeMods
