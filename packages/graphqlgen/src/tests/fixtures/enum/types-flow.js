// @flow

export interface User {
  id: string,
  name: string,
  enumAnnotation: EnumAnnotation,
  enumAsUnionType: EnumAsUnionType,
}

export type EnumAnnotation = 'ADMIN' | 'EDITOR' | 'COLLABORATOR'
export type EnumAsUnionType = 'RED' | 'GREEN' | 'BLUE'
