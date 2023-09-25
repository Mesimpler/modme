import { useEffect, useRef, useState } from 'react'
import { App } from 'antd'
import ModTable from './components/ModTable'
import { SettingsContext } from './context/SettingsContext'

function MyApp() {
  const [modList, setModList] = useState([])
  const [loading, setLoading] = useState(false)
  const [appSettings, setAppSettings] = useState({})

  async function getAppSettings() {
    const appSettings = await window.api.readSettings()
    setAppSettings(appSettings)
    return appSettings
  }
  async function getModList() {
    setLoading(true)
    const _appSettings = await getAppSettings()
    window.api
      .readModsDirectory(_appSettings.modDirectory, _appSettings.profileName)
      .then((data) => {
        setModList(data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getModList()
  }, [])

  // save change
  const preModList = useRef({})
  useEffect(() => {
    window.api.saveSnapshot(preModList.current, modList, appSettings)
    preModList.current = modList
  }, [modList])

  return (
    <SettingsContext.Provider value={appSettings}>
      <App>
        <ModTable loading={loading} modList={modList} setModList={setModList} />
      </App>
    </SettingsContext.Provider>
  )
}

export default MyApp
