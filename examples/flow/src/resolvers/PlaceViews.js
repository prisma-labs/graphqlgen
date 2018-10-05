import { PlaceViewsResolvers } from "../generated";
import { TypeMap } from "./types/TypeMap";

export interface PlaceViewsParent {
  id: string;
  lastWeek: number;
}

export const PlaceViews: PlaceViewsResolvers.Type<TypeMap> = {
  id: parent => parent.id,
  lastWeek: parent => parent.lastWeek
};
