import { PictureResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";

export interface PictureParent {
  id: string;
  url: string;
}

export const Picture: PictureResolvers.Type<TypeMap> = {
  id: parent => parent.id,
  url: parent => parent.url
};
