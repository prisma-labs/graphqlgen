import { ExperiencesByCityResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";
import { ExperienceParent } from "./Experience";
import { CityParent } from "./City";

export interface ExperiencesByCityParent {
  experiences: ExperienceParent[];
  city: CityParent;
}

export const ExperiencesByCity: ExperiencesByCityResolvers.Type<TypeMap> = {
  experiences: parent => parent.experiences,
  city: parent => parent.city
};
