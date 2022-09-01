import type { JSONSchemaType } from 'ajv'

export interface Patient {
  userName: string
  phoneNumber?: string
  address: string
}

export interface CreatedPatient extends Patient {
  _id: string
  createdAt: Date
  updatedAt: Date
}

const patientSchema: JSONSchemaType<Patient> = {
  type: 'object',

  properties: {
    userName: { type: 'string' },
    phoneNumber: { type: 'string', nullable: true },
    address: { type: 'string' }
  },

  required: ['userName', 'address'],
  additionalProperties: false
}

export default patientSchema
