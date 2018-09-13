import { ILocation } from "../generated/resolvers";
import { Types } from "./typemap";

export interface LocationParent {
  id: string;
  lat: number;
  lng: number;
  address?: string;
  directions?: string;
}

export const Location: ILocation.Resolver<Types> = {
  id: parent => parent.id,
  lat: parent => parent.lat,
  lng: parent => parent.lng,
  address: parent => parent.address,
  directions: parent => parent.directions
};
