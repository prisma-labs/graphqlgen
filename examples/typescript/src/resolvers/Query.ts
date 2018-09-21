import { QueryResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";

export interface QueryParent {}

export const Query: QueryResolvers.Type<TypeMap> = {
  topExperiences: parent => {
    throw new Error("Resolver not implemented");
  },
  topHomes: parent => {
    throw new Error("Resolver not implemented");
  },
  homesInPriceRange: (parent, args) => {
    throw new Error("Resolver not implemented");
  },
  topReservations: parent => {
    throw new Error("Resolver not implemented");
  },
  featuredDestinations: parent => {
    throw new Error("Resolver not implemented");
  },
  experiencesByCity: (parent, args) => {
    throw new Error("Resolver not implemented");
  },
  viewer: parent => null,
  myLocation: parent => null
};
