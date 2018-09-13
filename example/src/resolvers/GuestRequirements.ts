import { IGuestRequirements } from "../generated/resolvers";
import { Types } from "./types/typemap";

export interface GuestRequirementsParent {
  govIssuedId: boolean;
  guestTripInformation: boolean;
  id: string;
  recommendationsFromOtherHosts: boolean;
}

export const GuestRequirements: IGuestRequirements.Resolver<Types> = {
  govIssuedId: parent => parent.govIssuedId,
  guestTripInformation: parent => parent.guestTripInformation,
  id: parent => parent.id,
  recommendationsFromOtherHosts: parent => parent.recommendationsFromOtherHosts
};
