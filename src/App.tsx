import { UserAddOutlined } from '@ant-design/icons'
import { Button, notification, Space, Table, UploadFile } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Search from 'antd/lib/input/Search'
import PatientForm from 'components/PatientForm'
import ViewPatient from 'components/ViewPatient'
import { CreatedPatient, Patient } from 'core/lib/db/schema/patient'
import patientStore from 'core/lib/db/stores/patient'
import uploadImageService from 'core/services/image'
import { formatLocalDateTime } from 'core/utils/datetime'
import { omit } from 'radash'
import React from 'react'

function App() {
  const searchValue = React.useRef('')
  const [patients, setPatients] = React.useState<CreatedPatient[]>([])
  const [visible, setVisible] = React.useState(false)

  const [detailVisible, setDetailVisible] = React.useState(false)
  const [patient, setPatient] = React.useState<Patient & { images: string[] }>({ images: [] } as any)

  const handleFetchPatients = React.useCallback(async () => {
    const [fetchError, data] = await patientStore.readAll(searchValue.current)

    if (!fetchError) setPatients(data)
  }, [])

  const handleGetPatient = React.useCallback(async (patientId: string) => {
    const [error, data] = await patientStore.read(patientId)

    if (error) return notification.error({ message: 'Lỗi !!', description: error.message })

    setPatient(data!)
    setDetailVisible(true)
  }, [])

  const handleDeletePatient = React.useCallback(
    async (_id: string) => {
      const [error] = await patientStore.delete(_id)

      if (error) return notification.error({ message: 'Lỗi !!', description: error.message })

      notification.success({ message: 'Thành công !!', description: 'Xoá bệnh nhân thành công' })

      await handleFetchPatients()
    },
    [handleFetchPatients]
  )

  const handleSearch = React.useCallback(
    async (value: string) => {
      searchValue.current = value

      await handleFetchPatients()
    },
    [handleFetchPatients]
  )

  const handleSavePatient = React.useCallback(
    async (values: Patient & { images: UploadFile[] }, callback: () => void) => {
      const [error, patient] = await patientStore.create(omit(values, ['images']))

      if (error) return notification.error({ message: 'Lỗi !!', description: error.message })

      await uploadImageService.uploadFile(patient!._id, values.images)

      notification.success({ message: 'Thành công !!', description: 'Thêm bệnh nhân thành công' })

      setVisible(false)
      callback()
      await handleFetchPatients()
    },
    [handleFetchPatients]
  )

  const columns: ColumnsType<CreatedPatient> = React.useMemo(() => {
    return [
      {
        title: 'Tên',
        dataIndex: 'userName',
        key: 'userName',
        render: (_, record) => {
          return (
            <Button type="link" onClick={() => handleGetPatient(record._id)}>
              {record.userName}
            </Button>
          )
        }
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber'
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: 'Ngày khám',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (_, { createdAt }) => formatLocalDateTime(createdAt)
      },
      {
        title: '',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Button danger onClick={() => handleDeletePatient(record._id)}>
              Xoá
            </Button>
          </Space>
        )
      }
    ]
  }, [handleDeletePatient, handleGetPatient])

  React.useEffect(() => {
    ;(async () => await handleFetchPatients())()
  }, [handleFetchPatients])

  return (
    <div className="p-2">
      <div className="ant-row justify-content-between">
        <div className="ant-col ant-col-16">
          <Search placeholder="Tìm theo tên" allowClear enterButton="Tìm" size="large" onSearch={handleSearch} />
        </div>
        <div className="ant-col">
          <Button type="primary" icon={<UserAddOutlined />} size="large" onClick={() => setVisible(true)}>
            Thêm bệnh nhân
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={patients} />
      <PatientForm onSubmit={handleSavePatient} visible={visible} onClose={() => setVisible(false)} />
      <ViewPatient visible={detailVisible} onClose={() => setDetailVisible(false)} values={patient!} />
    </div>
  )
}

export default App
