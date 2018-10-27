// @flow

export interface Context {
  db: any
}

export interface User {
  id: string,
  name: string,
  type: UserType,
}

type UserType = 'ADMIN' | 'EDITOR' | 'COLLABORATOR'
