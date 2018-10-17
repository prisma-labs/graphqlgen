import { Post } from './models'
import { User } from './models'

const users = [{
  id: "1",
  name: "Alice",
  postIDs: ["1", "2"],
}, {
  id: "2",
  name: "Bob",
  postIDs: [],
}]

const posts = [{
  id: "1",
  title: "GraphQL Conf 2019",
  content: "An awesome GraphQL conference in Berlin.",
  published: true,
  authorId: "1"
}, {
  id: "2",
  title: "GraphQL Weekly",
  content: "Weekly news about the Grap[hQL ecosystem and community.",
  published: false,
  authorId: "1"
}]

export interface PostsAndUsers {
  posts: Post[]
  users: User[]
}

export const userIdProvider: () => string = () => (users.length+1).toString() 
export const postIdProvider: () => string = () => (posts.length+1).toString() 

export const data: PostsAndUsers = {
  posts,
  users
}