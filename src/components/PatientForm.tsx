import { PlusOutlined } from '@ant-design/icons'
import { Form, Input, Modal, Upload, UploadFile } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { Patient } from 'core/lib/db/schema/patient'
import React from 'react'

interface PatientFormProps {
  onSubmit: (values: Patient & { images: UploadFile[] }, onSuccess: () => void) => void
  visible: boolean
  onClose: () => void
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, onClose, visible }) => {
  const [form] = Form.useForm()

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault()

    const values = await form.validateFields()

    onSubmit({ ...values, images: values.images.fileList }, form.resetFields)
  }

  return (
    <Modal
      title="Thêm bệnh nhân"
      centered
      visible={visible}
      onCancel={onClose}
      cancelText="Huỷ"
      okText="Lưu"
      onOk={handleSubmit}
      width="90%"
    >
      <Form
        name="patient"
        layout="horizontal"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
      >
        <Form.Item
          label="Tên"
          name="userName"
          required
          rules={[{ required: true, message: 'Trường này là bắt buộc !' }]}
        >
          <Input placeholder="Nhập tên bệnh nhân" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          required
          rules={[{ required: true, message: 'Trường này là bắt buộc !' }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          required
          rules={[{ required: true, message: 'Trường này là bắt buộc !' }]}
        >
          <TextArea placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          className="upload-image"
          name="images"
          valuePropName="fileLists"
          required
          rules={[{ required: true, message: 'Trường này là bắt buộc !' }]}
        >
          <Upload listType="picture-card" beforeUpload={() => false} accept="image/png, image/gif, image/jpeg">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Thêm ảnh</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PatientForm
