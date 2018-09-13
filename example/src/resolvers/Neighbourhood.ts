import { NeighbourhoodResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";
import { PictureParent } from "./Picture";
import { CityParent } from "./City";

export interface NeighbourhoodParent {
  id: string;
  name: string;
  slug: string;
  homePreview?: PictureParent;
  city: CityParent;
  featured: boolean;
  popularity: number;
}

export const Neighbourhood: NeighbourhoodResolvers.Resolver<TypeMap> = {
  id: parent => parent.id,
  name: parent => parent.name,
  slug: parent => parent.slug,
  homePreview: parent => parent.homePreview,
  city: parent => parent.city,
  featured: parent => parent.featured,
  popularity: parent => parent.popularity
};
