import fs from 'node:fs/promises'
import fse from 'fs-extra'
import path from 'path'
import { getFileList } from './utils'

async function createModsSymlink(profile, appSettings) {
  const excludeFiles = ['reademe', 'Readme', 'README'].concat(appSettings.profileName)
  const modFiles = await getFileList(profile.relativePath)

  let activedFiles = []
  for (const file of modFiles) {
    const isExcludeFile = excludeFiles.some((f) => file.relativePath.includes(f))
    if (isExcludeFile) continue

    const srcAbsolutePath = path.join(process.cwd(), profile.relativePath, file.relativePath)
    const targetAbsolutePath = path.join(appSettings.gameRoot, file.relativePath)
    try {
      await fs.symlink(srcAbsolutePath, targetAbsolutePath, fs.constants.COPYFILE_EXCL)
      activedFiles.push({
        ...file,
        srcAbsolutePath,
        targetAbsolutePath
      })
    } catch (error) {
      for (const _file of activedFiles) {
        await fse.remove(_file.targetAbsolutePath)
      }
      throw new Error(error)
    }
  }
}

export default createModsSymlink
