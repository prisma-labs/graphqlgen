import { IPolicies } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";

export interface PoliciesParent {
  checkInEndTime: number;
  checkInStartTime: number;
  checkoutTime: number;
  createdAt: string;
  id: string;
  updatedAt: string;
}

export const Policies: IPolicies.Resolver<TypeMap> = {
  checkInEndTime: parent => parent.checkInEndTime,
  checkInStartTime: parent => parent.checkInStartTime,
  checkoutTime: parent => parent.checkoutTime,
  createdAt: parent => parent.createdAt,
  id: parent => parent.id,
  updatedAt: parent => parent.updatedAt
};
