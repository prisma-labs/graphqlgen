import { HomeResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";
import { PictureParent } from "./Picture";

export interface HomeParent {
  id: string;
  name?: string;
  description: string;
  numRatings: number;
  avgRating?: number;
  pictures: PictureParent[];
  perNight: number;
}

export const Home: HomeResolvers.Resolver<TypeMap> = {
  id: parent => parent.id,
  name: parent => parent.name,
  description: parent => parent.description,
  numRatings: parent => parent.numRatings,
  avgRating: parent => parent.avgRating,
  pictures: (parent, args) => parent.pictures,
  perNight: parent => parent.perNight
};
