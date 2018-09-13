import { ICity } from "../generated/resolvers";
import { Types } from "./typemap";

export interface CityParent {
  id: string;
  name: string;
}

export const City: ICity.Resolver<Types> = {
  id: parent => parent.id,
  name: parent => parent.name
};
