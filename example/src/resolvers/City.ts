import { CityResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";

export interface CityParent {
  id: string;
  name: string;
}

export const City: CityResolvers.Resolver<TypeMap> = {
  id: parent => parent.id,
  name: parent => parent.name
};
