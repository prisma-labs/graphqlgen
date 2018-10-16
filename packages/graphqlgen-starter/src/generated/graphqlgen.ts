/* DO NOT EDIT! */
import { GraphQLResolveInfo } from "graphql";
import { Context } from "../types";
import { Product } from "../models";
import { Basket } from "../models";

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
  ) => {}[] | Promise<{}[]>;

  export type DraftsResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => {}[] | Promise<{}[]>;

  export type PostResolver = (
    parent: {},
    args: ArgsPost,
    ctx: Context,
    info: GraphQLResolveInfo
  ) => {} | null | Promise<{} | null>;

  export interface Type {
    feed: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => {}[] | Promise<{}[]>;

    drafts: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => {}[] | Promise<{}[]>;

    post: (
      parent: {},
      args: ArgsPost,
      ctx: Context,
      info: GraphQLResolveInfo
    ) => {} | null | Promise<{} | null>;
  }
}

export namespace MutationResolvers {
  export const defaultResolvers = {};

  export interface ArgsCreateDraft {
    title: string;
    content: string;
    authorEmail: string;
  }

  export interface ArgsDeletePost {
    id: string;
  }

  export interface ArgsPublish {
    id: string;
  }

  export type CreateDraftResolver = (
    parent: {},
    args: ArgsCreateDraft,
    ctx: Context,
    info: GraphQLResolveInfo
  ) => {} | Promise<{}>;

  export type DeletePostResolver = (
    parent: {},
    args: ArgsDeletePost,
    ctx: Context,
    info: GraphQLResolveInfo
  ) => {} | null | Promise<{} | null>;

  export type PublishResolver = (
    parent: {},
    args: ArgsPublish,
    ctx: Context,
    info: GraphQLResolveInfo
  ) => {} | null | Promise<{} | null>;

  export interface Type {
    createDraft: (
      parent: {},
      args: ArgsCreateDraft,
      ctx: Context,
      info: GraphQLResolveInfo
    ) => {} | Promise<{}>;

    deletePost: (
      parent: {},
      args: ArgsDeletePost,
      ctx: Context,
      info: GraphQLResolveInfo
    ) => {} | null | Promise<{} | null>;

    publish: (
      parent: {},
      args: ArgsPublish,
      ctx: Context,
      info: GraphQLResolveInfo
    ) => {} | null | Promise<{} | null>;
  }
}

export namespace PostResolvers {
  export const defaultResolvers = {};

  export type IdResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type CreatedAtResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type UpdatedAtResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type IsPublishedResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => boolean | Promise<boolean>;

  export type TitleResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type BigCountResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => number | Promise<number>;

  export type MyNewFieldResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type ContentResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type AuthorResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => {} | Promise<{}>;

  export interface Type {
    id: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    createdAt: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    updatedAt: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    isPublished: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => boolean | Promise<boolean>;

    title: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    bigCount: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => number | Promise<number>;

    myNewField: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    content: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    author: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => {} | Promise<{}>;
  }
}

export namespace UserResolvers {
  export const defaultResolvers = {};

  export type IdResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type EmailResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type NameResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type PostsResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => {}[] | Promise<{}[]>;

  export interface Type {
    id: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    email: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    name: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    posts: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => {}[] | Promise<{}[]>;
  }
}

export namespace CommentResolvers {
  export const defaultResolvers = {};

  export type IdResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type TextResolver = (
    parent: {},
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export interface Type {
    id: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    text: (
      parent: {},
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;
  }
}

export interface Resolvers {
  Query: QueryResolvers.Type;
  Mutation: MutationResolvers.Type;
  Post: PostResolvers.Type;
  User: UserResolvers.Type;
  Comment: CommentResolvers.Type;
}
