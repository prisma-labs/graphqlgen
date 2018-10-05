import { GuestRequirementsResolvers } from "../generated";
import { TypeMap } from "./types/TypeMap";

export interface GuestRequirementsParent {
  govIssuedId: boolean;
  guestTripInformation: boolean;
  id: string;
  recommendationsFromOtherHosts: boolean;
}

export const GuestRequirements: GuestRequirementsResolvers.Type<TypeMap> = {
  govIssuedId: parent => parent.govIssuedId,
  guestTripInformation: parent => parent.guestTripInformation,
  id: parent => parent.id,
  recommendationsFromOtherHosts: parent => parent.recommendationsFromOtherHosts
};
