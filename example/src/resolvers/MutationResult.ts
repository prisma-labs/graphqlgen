import { MutationResultResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";

export interface MutationResultParent {
  success: boolean;
}

export const MutationResult: MutationResultResolvers.Resolver<TypeMap> = {
  success: parent => parent.success
};
