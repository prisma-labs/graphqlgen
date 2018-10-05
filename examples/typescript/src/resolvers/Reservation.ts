import { ReservationResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";
import { PictureParent } from "./Picture";
import { LocationParent } from "./Location";

export interface ReservationParent {
  id: string;
  title: string;
  avgPricePerPerson: number;
  pictures: PictureParent[];
  location: LocationParent;
  isCurated: boolean;
  slug: string;
  popularity: number;
}

export const Reservation: ReservationResolvers.Type<TypeMap> = {
  id: parent => parent.id,
  title: parent => parent.title,
  avgPricePerPerson: parent => parent.avgPricePerPerson,
  pictures: parent => parent.pictures,
  location: parent => parent.location,
  isCurated: parent => parent.isCurated,
  slug: parent => parent.slug,
  popularity: parent => parent.popularity
};
