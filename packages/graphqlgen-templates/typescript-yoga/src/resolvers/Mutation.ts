import { MutationResolvers } from '../generated/graphqlgen'

export const Mutation: MutationResolvers.Type = {
  createUser: (parent, { name }, ctx) => {
    const id = ctx.data.idProvider()
    const newUser = { id, name, postIDs: [] }
    ctx.data.users.push(newUser)
    return newUser
  },

  createDraft: (parent, { title, content, authorId }, ctx) => {
    const author = ctx.data.users.find(user => user.id === authorId)
    if (author === null) {
      throw new Error(`User with ID '${authorId}' does not exist.`)
    }
    const id = ctx.data.idProvider()
    const newDraft = { id, title, content, authorId, published: false }
    ctx.data.posts.push(newDraft)
    author!.postIDs.push(id)
    return newDraft
  },

  deletePost: (parent, { id }, ctx) => {
    const postIndex = ctx.data.posts.findIndex(post => post.id === id)
    if (postIndex < 0) {
      throw new Error(`Post with ID '${id}' does not exist.`)
    }
    const deleted = ctx.data.posts.splice(postIndex, 1)
    return deleted[0]
  },

  publish: (parent, { id }, ctx) => {
    const post = ctx.data.posts.find(post => post.id === id)
    post!.published = true
    return post!
  },
}
