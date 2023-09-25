import fs from 'node:fs/promises'
import fse from 'fs-extra'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

async function readModsDirectory(modsPath, profileName) {
  let mods = []

  const dir = await fs.opendir(modsPath)
  for await (const dirent of dir) {
    const currentPath = path.join(modsPath, dirent.name)
    const profilePath = path.join(currentPath, profileName)

    const isDirectory = dirent.isDirectory()
    const isManaged = await fse.pathExists(profilePath)

    // 已管理文件夹，读取modme.json
    if (isDirectory && isManaged) {
      const profile = await fse.readJson(profilePath)
      mods.push(profile)
    }
    // 新文件夹，生成modme.json
    if (isDirectory && !isManaged) {
      const newProfile = {
        name: dirent.name,
        actived: false,
        relativePath: currentPath,
        key: randomUUID()
      }
      mods.push(newProfile)
    }
  }

  return mods
}

export default readModsDirectory
