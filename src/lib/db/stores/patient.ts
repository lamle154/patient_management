import DataStore from 'nedb-promises'
import Ajv, { ValidateFunction } from 'ajv'
import patientSchema, { CreatedPatient, Patient } from '../schema/patient'
import uploadImageService from 'lib/uploadImage'

class PatientStore {
  schemaValidator: ValidateFunction<Patient>
  db: DataStore<CreatedPatient>

  constructor() {
    const ajv = new Ajv({
      allErrors: true,
      useDefaults: true
    })

    this.schemaValidator = ajv.compile(patientSchema)

    this.db = DataStore.create({
      filename: 'patients',
      timestampData: true
    })
  }

  validate(data: Patient) {
    return this.schemaValidator(data)
  }

  async create(data: Patient): Promise<[Error | null, CreatedPatient | null]> {
    const isValid = this.validate(data)

    if (!isValid) return [new Error('Không thể thêm bệnh nhân mới.'), null]

    try {
      const patient = await this.db.insert(data)
      return [null, patient]
    } catch (error: any) {
      return [error, null]
    }
  }

  async read(_id: string): Promise<[Error | null, (Patient & { images: string[] }) | null]> {
    try {
      const patient = await this.db.findOne({ _id }).exec()

      if (!patient) return [new Error('Không tìm thấy bệnh nhân !'), null]

      const images = uploadImageService.files(patient._id)

      return [null, { ...patient, images }]
    } catch (error: any) {
      return [error, null]
    }
  }

  async delete(_id: string): Promise<[Error | null]> {
    try {
      await this.db.remove({ _id }, { multi: false })
      return [null]
    } catch (error: any) {
      return [error]
    }
  }

  async readAll(query?: string): Promise<[Error | null, CreatedPatient[]]> {
    try {
      const patients = await this.db.find(query ? { userName: `/${query}/` } : {})
      return [null, patients]
    } catch (error: any) {
      return [error, []]
    }
  }
}

const patientStore = new PatientStore()

export default patientStore
