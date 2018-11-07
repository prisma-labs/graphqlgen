// @ts-ignore
interface Interface {
  field: string
  optionalField?: string
  fieldUnionNull: string | null
}

export interface ExportedInterface {
  field: string
}

// @ts-ignore
type Type = {
  field: string
}

export type ExportedType = {
  field: string
}

// @ts-ignore
enum Enum {
  A, B, C
}

