import fse from 'fs-extra'
import path from 'path'

async function readSettings() {
  const settingsFilePath = './settings.json'
  const gameRoot =
    process.env.NODE_ENV === 'development' ? 'E:/Game/HoneyCome' : path.join(process.cwd(), '../')

  let appSettings = {}
  try {
    appSettings = await fse.readJson(settingsFilePath)
  } catch (error) {
    appSettings = {
      replaceType: 'copy',
      gameRoot: gameRoot,
      modDirectory: './mods',
      profileName: 'modme.json'
    }
    await fse.writeJson(settingsFilePath, appSettings)
  }
  return appSettings
}

export default readSettings
