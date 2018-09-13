import { IMutation } from "../generated/resolvers";
import { Types } from "./types/typemap";

export interface MutationParent {}

export const Mutation: IMutation.Resolver<Types> = {
  signup: (parent, args) => {
    throw new Error("Resolver not implemented");
  },
  login: (parent, args) => {
    throw new Error("Resolver not implemented");
  },
  addPaymentMethod: (parent, args) => {
    throw new Error("Resolver not implemented");
  },
  book: (parent, args) => {
    throw new Error("Resolver not implemented");
  }
};
