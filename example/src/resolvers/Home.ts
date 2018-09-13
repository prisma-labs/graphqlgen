import { IHome } from "../generated/resolvers";
import { Types } from "./typemap";
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

export const Home: IHome.Resolver<Types> = {
  id: parent => parent.id,
  name: parent => parent.name,
  description: parent => parent.description,
  numRatings: parent => parent.numRatings,
  avgRating: parent => parent.avgRating,
  pictures: (parent, args) => parent.pictures,
  perNight: parent => parent.perNight
};
