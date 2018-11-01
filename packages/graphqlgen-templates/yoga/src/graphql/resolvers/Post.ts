import { PostResolvers } from '../__generated__/graphqlgen'

export const Post: PostResolvers.Type = {
  ...PostResolvers.defaultResolvers,

  author: (parent, args, ctx) => {
    return ctx.data.users.find(user => user.id === parent.authorId)!
  },
}
