import jetpack from 'fs-jetpack'
import _ from 'lodash'

function flattenFileTree(fileTree, parentKey = null) {
  return _.flattenDeep(
    fileTree.map((item) => {
      const newItem = { ...item, parent: parentKey }

      if (item.children) {
        return [newItem, ...flattenFileTree(item.children, item.key)]
      }

      return newItem
    })
  )
}

export async function getFileList(dir) {
  const fileTree = await jetpack.inspectTree(dir, { relativePath: true })
  const fileList = flattenFileTree(fileTree.children).filter((f) => f.type === 'file')

  return fileList
}
