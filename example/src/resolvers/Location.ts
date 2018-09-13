import { LocationResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";

export interface LocationParent {
  id: string;
  lat: number;
  lng: number;
  address?: string;
  directions?: string;
}

export const Location: LocationResolvers.Resolver<TypeMap> = {
  id: parent => parent.id,
  lat: parent => parent.lat,
  lng: parent => parent.lng,
  address: parent => parent.address,
  directions: parent => parent.directions
};
