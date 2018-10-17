import { PostsAndUsers } from "./data";

export interface Context {
  data: PostsAndUsers
  userIdProvider: () => string
  postIdProvider: () => string
}
