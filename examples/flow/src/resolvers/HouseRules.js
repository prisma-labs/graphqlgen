import { HouseRulesResolvers } from "../generated";
import { TypeMap } from "./types/TypeMap";

export interface HouseRulesParent {
  additionalRules?: string;
  createdAt: string;
  id: string;
  partiesAndEventsAllowed?: boolean;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  suitableForChildren?: boolean;
  suitableForInfants?: boolean;
  updatedAt: string;
}

export const HouseRules: HouseRulesResolvers.Type<TypeMap> = {
  additionalRules: parent => parent.additionalRules,
  createdAt: parent => parent.createdAt,
  id: parent => parent.id,
  partiesAndEventsAllowed: parent => parent.partiesAndEventsAllowed,
  petsAllowed: parent => parent.petsAllowed,
  smokingAllowed: parent => parent.smokingAllowed,
  suitableForChildren: parent => parent.suitableForChildren,
  suitableForInfants: parent => parent.suitableForInfants,
  updatedAt: parent => parent.updatedAt
};
