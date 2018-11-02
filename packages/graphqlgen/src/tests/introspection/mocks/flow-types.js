// @flow

interface Interface {
  field: string,
  optionalField?: string,
  fieldUnionNull: string | null,
}

export interface ExportedInterface {
  field: string
}

type Type = {
  field: string
}

export type ExportedType = {
  field: string
}

