import fse from 'fs-extra'
import path from 'path'
import _ from 'lodash'

async function saveSnapshot(premodList, modList, appSettings) {
  const modifyFile = _.difference(modList, premodList)
  for (const mod of modifyFile) {
    await fse.writeJson(path.join(mod.relativePath, appSettings.profileName), mod)
  }
}

export default saveSnapshot
