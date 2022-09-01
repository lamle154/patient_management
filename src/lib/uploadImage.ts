import { UploadFile } from 'antd'

const fs: FSType = window.require('fs')
const path: PathType = window.require('path')

const { app }: ElectronRemoteType = window.require('@electron/remote')

class UploadImageService {
  private rootDir = app.getAppPath() + '/src/data/patient-images'

  constructor() {
    this.prepareDir()
  }

  async uploadFile(patientId: string, files: UploadFile[] | UploadFile) {
    const dir = this.prepareDir(patientId)

    return Array.isArray(files)
      ? await Promise.all(files.map(file => this.copyFile(file, dir)))
      : await this.copyFile(files, dir)
  }

  files(patientId: string) {
    const dir = `${this.rootDir}/${patientId}`

    return fs.readdirSync(dir).map(file => path.join(dir, file))
  }

  private async copyFile(file: UploadFile, dir: string) {
    const filePath = (file.originFileObj! as any).path
    const fileName = path.basename(filePath)

    fs.copyFile(filePath, `${dir}/${fileName}`, err => {
      if (err) throw err
    })
  }

  private prepareDir(patientId?: string) {
    const dir = `${this.rootDir}${patientId ? `/${patientId}` : ''}`

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    return dir
  }
}

const uploadImageService = new UploadImageService()

export default uploadImageService
