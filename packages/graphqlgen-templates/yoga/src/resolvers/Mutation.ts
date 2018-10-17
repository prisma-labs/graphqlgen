import { MutationResolvers } from "../generated/graphqlgen";
import { Context } from "../types";

export const Mutation: MutationResolvers.Type = {
  ...MutationResolvers.defaultResolvers,
  createUser: (parent, { name }, ctx: Context) => {
    const id = ctx.userIdProvider()
    const newUser = { id, name, postIDs: [] }
    ctx.data.users.push(newUser)
    return newUser
  },
  createDraft: (parent, { title, content, authorId }, ctx: Context) => {
    const author = ctx.data.users.find(user => user.id === authorId)
    if (author === null) {
      throw new Error(`User with ID '${authorId}' does not exist.`)
    }
    const id = ctx.postIdProvider()
    const newDraft = { id, title, content, authorId, published: false }
    ctx.data.posts.push(newDraft)
    author.postIDs.push(id)
    return newDraft
  },
  deletePost: (parent, { id }, ctx: Context) => {
    const postIndex = ctx.data.posts.findIndex(post => post.id === id)
    if (postIndex < 0) {
      throw new Error(`Post with ID '${id}' does not exist and therefore can not be deleted.`)
    }
    const deleted = ctx.data.posts.splice(postIndex, 1)
    return deleted[0]
  },
  publish: (parent, { id }, ctx: Context) => {
    const post = ctx.data.posts.find(post => post.id === id)
    post.published = true
    return post
  }
};
