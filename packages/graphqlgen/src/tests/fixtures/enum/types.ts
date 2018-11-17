export interface User {
  id: string
  name: string
  enumAnnotation: EnumAnnotation
  enumAsUnionType: EnumAsUnionType
}

export enum EnumAnnotation {
  ADMIN,
  EDITOR,
  COLLABORATOR,
}

export type EnumAsUnionType = 'RED' | 'GREEN' | 'BLUE'
