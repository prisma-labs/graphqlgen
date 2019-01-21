export interface User {
  id: string
  name: string
  enumAnnotation: EnumAnnotation
  enumAsUnionType: EnumAsUnionType
}

enum EnumAnnotation {
  ADMIN,
  EDITOR,
  COLLABORATOR,
}

type EnumAsUnionType = 'RED' | 'GREEN' | 'BLUE'
