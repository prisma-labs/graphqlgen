/* DO NOT EDIT! */
import { GraphQLResolveInfo } from "graphql";
import { Context } from "../types";
import { User } from "../models";
import { Post } from "../models";

export namespace QueryResolvers {
  export const defaultResolvers = {};

  export interface ArgsPost {
    id: string;
  }

  export type FeedResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => Post[] | Promise<Post[]>;

  export type DraftsResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => Post[] | Promise<Post[]>;

  export type PostResolver = (
    parent: {},
    args: ArgsPost,
    ctx: Context,
    info: GraphQLResolveInfo
  ) => Post | null | Promise<Post | null>;

  export interface Type {
    feed: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => Post[] | Promise<Post[]>;

    drafts: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => Post[] | Promise<Post[]>;

    post: (
      parent: {},
      args: ArgsPost,
      ctx: Context,
      info: GraphQLResolveInfo
    ) => Post | null | Promise<Post | null>;
  }
}

export namespace MutationResolvers {
  export const defaultResolvers = {};

  export interface ArgsCreateUser {
    name: string | null;
  }

  export interface ArgsCreateDraft {
    title: string;
    content: string;
    authorId: string;
  }

  export interface ArgsDeletePost {
    id: string;
  }

  export interface ArgsPublish {
    id: string;
  }

  export type CreateUserResolver = (
    parent: {},
    args: ArgsCreateUser,
    ctx: Context,
    info: GraphQLResolveInfo
  ) => User | Promise<User>;

  export type CreateDraftResolver = (
    parent: {},
    args: ArgsCreateDraft,
    ctx: Context,
    info: GraphQLResolveInfo
  ) => Post | Promise<Post>;

  export type DeletePostResolver = (
    parent: {},
    args: ArgsDeletePost,
    ctx: Context,
    info: GraphQLResolveInfo
  ) => Post | null | Promise<Post | null>;

  export type PublishResolver = (
    parent: {},
    args: ArgsPublish,
    ctx: Context,
    info: GraphQLResolveInfo
  ) => Post | null | Promise<Post | null>;

  export interface Type {
    createUser: (
      parent: {},
      args: ArgsCreateUser,
      ctx: Context,
      info: GraphQLResolveInfo
    ) => User | Promise<User>;

    createDraft: (
      parent: {},
      args: ArgsCreateDraft,
      ctx: Context,
      info: GraphQLResolveInfo
    ) => Post | Promise<Post>;

    deletePost: (
      parent: {},
      args: ArgsDeletePost,
      ctx: Context,
      info: GraphQLResolveInfo
    ) => Post | null | Promise<Post | null>;

    publish: (
      parent: {},
      args: ArgsPublish,
      ctx: Context,
      info: GraphQLResolveInfo
    ) => Post | null | Promise<Post | null>;
  }
}

export namespace PostResolvers {
  export const defaultResolvers = {
    id: parent => parent.id,
    title: parent => parent.title,
    content: parent => parent.content,
    published: parent => parent.published,
  };

  export type IdResolver = (
    parent: Post,
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type TitleResolver = (
    parent: Post,
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type ContentResolver = (
    parent: Post,
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type PublishedResolver = (
    parent: Post,
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => boolean | Promise<boolean>;

  export type AuthorResolver = (
    parent: Post,
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => User | Promise<User>;

  export interface Type {
    id: (
      parent: Post,
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    title: (
      parent: Post,
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    content: (
      parent: Post,
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    published: (
      parent: Post,
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => boolean | Promise<boolean>;

    author: (
      parent: Post,
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => User | Promise<User>;
  }
}

export namespace UserResolvers {
  export const defaultResolvers = {
    id: parent => parent.id,
    name: parent => parent.name
  };

  export type IdResolver = (
    parent: User,
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type NameResolver = (
    parent: User,
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | null | Promise<string | null>;

  export type PostsResolver = (
    parent: User,
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => Post[] | Promise<Post[]>;

  export interface Type {
    id: (
      parent: User,
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    name: (
      parent: User,
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | null | Promise<string | null>;

    posts: (
      parent: User,
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => Post[] | Promise<Post[]>;
  }
}

export interface Resolvers {
  Query: QueryResolvers.Type;
  Mutation: MutationResolvers.Type;
  Post: PostResolvers.Type;
  User: UserResolvers.Type;
}
