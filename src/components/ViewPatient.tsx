import { EyeOutlined } from '@ant-design/icons'
import { Form, Input, Modal } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { Patient } from 'core/lib/db/schema/patient'
import React from 'react'

const fs: FSType = window.require('fs')
const path: PathType = window.require('path')

interface ViewPatientProps {
  visible: boolean
  onClose: () => void
  values: Patient & { images: string[] }
}

const ViewPatient: React.FC<ViewPatientProps> = ({ onClose, visible, values }) => {
  return (
    <Modal
      title={`Bệnh nhân: ${values.userName}`}
      centered
      visible={visible}
      onCancel={onClose}
      cancelText="Huỷ"
      okText="Lưu"
      width="90%"
      footer={null}
    >
      <Form name="patient" layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} autoComplete="off">
        <Form.Item label="Tên">
          <Input placeholder="Nhập tên bệnh nhân" value={values.userName} disabled />
        </Form.Item>

        <Form.Item label="Số điện thoại">
          <Input placeholder="Nhập số điện thoại" value={values.phoneNumber} disabled />
        </Form.Item>

        <Form.Item label="Địa chỉ">
          <TextArea placeholder="Nhập địa chỉ" value={values.address} disabled />
        </Form.Item>

        <Form.Item className="upload-image">
          <span className="ant-upload-picture-card-wrapper">
            <div className="ant-upload-list ant-upload-list-picture-card">
              {values.images.map((file, index) => {
                const imageSrc = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64')
                const fileName = path.basename(file)

                return (
                  <div className="ant-upload-list-picture-card-container" key={index}>
                    <div className="ant-upload-list-item ant-upload-list-item-undefined ant-upload-list-item-list-type-picture-card">
                      <div className="ant-upload-list-item-info">
                        <span className="ant-upload-span">
                          <a
                            className="ant-upload-list-item-thumbnail"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={imageSrc}
                          >
                            <img src={imageSrc} alt={fileName} className="ant-upload-list-item-image" />
                          </a>
                        </span>
                      </div>
                      <span className="ant-upload-list-item-actions">
                        <a target="_blank" rel="noopener noreferrer" title="Preview file" href={imageSrc}>
                          <EyeOutlined />
                        </a>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </span>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ViewPatient
