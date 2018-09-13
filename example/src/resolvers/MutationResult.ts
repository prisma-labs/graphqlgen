import { IMutationResult } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";

export interface MutationResultParent {
  success: boolean;
}

export const MutationResult: IMutationResult.Resolver<TypeMap> = {
  success: parent => parent.success
};
