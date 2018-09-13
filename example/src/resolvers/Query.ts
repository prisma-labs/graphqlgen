import { IQuery } from "../generated/resolvers";
import { Types } from "./typemap";

export interface QueryParent {}

export const Query: IQuery.Resolver<Types> = {
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
