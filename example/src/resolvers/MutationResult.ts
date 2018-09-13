import { IMutationResult } from "../generated/resolvers";
import { Types } from "./typemap";

export interface MutationResultParent {
  success: boolean;
}

export const MutationResult: IMutationResult.Resolver<Types> = {
  success: parent => parent.success
};
