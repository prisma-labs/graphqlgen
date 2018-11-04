import { UserResolvers } from '../generated/graphqlgen'

export const User: UserResolvers.Type = {
  ...UserResolvers.defaultResolvers,

  posts: ({ postIDs }, args, ctx) => {
    return ctx.data.posts.filter(post => postIDs.includes(post.id))
  },
}
