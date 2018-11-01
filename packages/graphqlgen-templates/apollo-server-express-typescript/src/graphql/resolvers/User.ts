import { UserResolvers } from '../__generated__/graphqlgen'

export const User: UserResolvers.Type = {
  ...UserResolvers.defaultResolvers,

  posts: ({ postIDs }, args, ctx) => {
    return ctx.data.posts.filter(post => postIDs.includes(post.id))
  },
}
