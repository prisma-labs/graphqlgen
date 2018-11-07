// @flow

export interface User {
  id: string,
  name: string,
  enumAnnotation: EnumAnnotation,
  enumAsUnionType: EnumAsUnionType,
}

type EnumAnnotation = 'ADMIN' | 'EDITOR' | 'COLLABORATOR'
type EnumAsUnionType = 'RED' | 'GREEN' | 'BLUE'
