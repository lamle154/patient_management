import { UploadFile } from 'antd'

const fs: FSType = window.require('fs')
const path: PathType = window.require('path')

const { app }: ElectronRemoteType = window.require('@electron/remote')

class ImageService {
  private rootDir = app.getPath('userData') + '/src/data/patient-images'

  constructor() {
    this.prepareDir()
  }

  async uploadFile(patientId: string, files: UploadFile[] | UploadFile) {
    const dir = this.prepareDir(patientId)

    return Array.isArray(files)
      ? await Promise.all(files.map(file => this.copyFile(file, dir)))
      : this.copyFile(files, dir)
  }

  files(patientId: string) {
    const dir = `${this.rootDir}/${patientId}`

    return fs.readdirSync(dir).map(file => path.join(dir, file))
  }

  private copyFile(file: UploadFile, dir: string) {
    const filePath = (file.originFileObj! as any).path
    const fileName = path.basename(filePath)

    fs.copyFile(filePath, `${dir}/${fileName}`, err => {
      if (err) throw err
    })
  }

  public removeDir(patientId: string) {
    const dir = `${this.rootDir}${patientId ? `/${patientId}` : ''}`

    if (fs.existsSync(dir)) fs.rmdirSync(dir, { recursive: true })
  }

  private prepareDir(patientId?: string) {
    console.log(this.rootDir)
    const dir = `${this.rootDir}${patientId ? `/${patientId}` : ''}`

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    return dir
  }
}

const imageService = new ImageService()

export default imageService
