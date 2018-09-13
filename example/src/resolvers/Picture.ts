import { IPicture } from "../generated/resolvers";
import { Types } from "./types/typemap";

export interface PictureParent {
  id: string;
  url: string;
}

export const Picture: IPicture.Resolver<Types> = {
  id: parent => parent.id,
  url: parent => parent.url
};
