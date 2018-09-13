import { IExperienceCategory } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";
import { ExperienceParent } from "./Experience";

export interface ExperienceCategoryParent {
  id: string;
  mainColor: string;
  name: string;
  experience?: ExperienceParent;
}

export const ExperienceCategory: IExperienceCategory.Resolver<TypeMap> = {
  id: parent => parent.id,
  mainColor: parent => parent.mainColor,
  name: parent => parent.name,
  experience: parent => parent.experience
};
