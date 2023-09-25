import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import readModsDirectory from './readModsDirectory'
import removeMods from './removeMods'
import readSettings from './readSettings'
import saveSnapshot from './saveSnapshot'
import { copyMods, createModsSymlink } from './transferMods'

// Custom APIs for renderer
const api = {
  readModsDirectory,
  createModsSymlink,
  copyMods,
  removeMods,
  readSettings,
  saveSnapshot,
  quitApp: () => ipcRenderer.send('quit-app')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
