import { IPlaceViews } from "../generated/resolvers";
import { Types } from "./types/typemap";

export interface PlaceViewsParent {
  id: string;
  lastWeek: number;
}

export const PlaceViews: IPlaceViews.Resolver<Types> = {
  id: parent => parent.id,
  lastWeek: parent => parent.lastWeek
};
