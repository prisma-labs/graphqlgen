// @flow

export interface Context {
  data: Data;
}

export interface User {
  id: string;
  name: string;
  postIDs: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
}

export interface Data {
  posts: Array<Post>;
  users: Array<User>;
  idProvider: () => string;
}
