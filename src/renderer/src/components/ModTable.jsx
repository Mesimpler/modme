import { App, Switch, Table, Button, Input, Space } from 'antd'
import { useState, useContext, useRef } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'

function ActiveSwitch({ record, modList, setModList }) {
  const appSettings = useContext(SettingsContext)
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()

  const replaceMethod =
    appSettings.replaceType === 'copy' ? window.api.copyMods : window.api.createModsSymlink

  function switchActive(record, status) {
    function updateStatus() {
      const targetModIndex = modList.findIndex((mod) => mod.key === record.key)
      const updatedModList = [...modList]
      updatedModList[targetModIndex] = {
        ...updatedModList[targetModIndex],
        actived: status
      }
      setModList(updatedModList)
    }

    const dosome = status ? replaceMethod : window.api.removeMods
    setLoading(true)
    dosome(record, appSettings)
      .then(() => {
        updateStatus()
      })
      .catch((err) => {
        console.log(err)
        message.error('操作失败')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Switch
      loading={loading}
      size="small"
      checked={record.actived}
      onChange={(val) => {
        switchActive(record, val)
      }}
    />
  )
}

function ModTable({ modList, setModList }) {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  function handleSearch(selectedKeys, confirm, dataIndex) {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  function handleReset(clearFilters) {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block'
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name')
    },
    {
      title: '状态',
      dataIndex: 'actived',
      key: 'actived',
      width: 60,
      render: (_, record) => {
        return <ActiveSwitch record={record} modList={modList} setModList={setModList} />
      }
    }
  ]

  return <Table columns={columns} dataSource={modList} size="small" pagination={false} />
}

export default ModTable
