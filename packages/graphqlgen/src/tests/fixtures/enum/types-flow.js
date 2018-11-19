// @flow

export interface User {
  id: string,
  name: string,
  color: Color,
  role: Permissions,
  permissions: Permissions,
}

export type Permissions = 'ADMIN' | 'EDITOR' | 'COLLABORATOR'
export type Color = 'RED' | 'GREEN' | 'BLUE'
