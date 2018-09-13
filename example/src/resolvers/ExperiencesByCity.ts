import { IExperiencesByCity } from "../generated/resolvers";
import { Types } from "./types/typemap";
import { ExperienceParent } from "./Experience";
import { CityParent } from "./City";

export interface ExperiencesByCityParent {
  experiences: ExperienceParent[];
  city: CityParent;
}

export const ExperiencesByCity: IExperiencesByCity.Resolver<Types> = {
  experiences: parent => parent.experiences,
  city: parent => parent.city
};
