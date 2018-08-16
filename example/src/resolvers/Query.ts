import { IQuery } from "../generated/resolvers";
import { Types } from "./types";

export interface QueryRoot {}

export const Query: IQuery.Resolver<Types> = {
  todos: (root, args) => {
    throw new Error("Resolver not implemented");
  }
};
