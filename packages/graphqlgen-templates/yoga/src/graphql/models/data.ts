export interface Data {
  posts: Post[]
  users: User[]
  idProvider: () => string
}
