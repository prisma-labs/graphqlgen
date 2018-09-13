import { IPlaceViews } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";

export interface PlaceViewsParent {
  id: string;
  lastWeek: number;
}

export const PlaceViews: IPlaceViews.Resolver<TypeMap> = {
  id: parent => parent.id,
  lastWeek: parent => parent.lastWeek
};
