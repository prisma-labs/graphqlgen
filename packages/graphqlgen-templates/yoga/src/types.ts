export interface Context {
  data: Data
}

export interface User {
  id: string
  name: string | null
  postIDs: string[]
}

export interface Post {
  id: string
  title: string
  content: string
  published: boolean
  authorId: string
}

export interface Data {
  posts: Post[]
  users: User[]
  idProvider: () => string
}
