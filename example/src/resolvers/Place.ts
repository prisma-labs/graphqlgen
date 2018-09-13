import { PlaceResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";
import { ReviewParent } from "./Review";
import { AmenitiesParent } from "./Amenities";
import { UserParent } from "./User";
import { PricingParent } from "./Pricing";
import { LocationParent } from "./Location";
import { PlaceViewsParent } from "./PlaceViews";
import { GuestRequirementsParent } from "./GuestRequirements";
import { PoliciesParent } from "./Policies";
import { HouseRulesParent } from "./HouseRules";
import { BookingParent } from "./Booking";
import { PictureParent } from "./Picture";

export type PLACE_SIZES =
  | "ENTIRE_HOUSE"
  | "ENTIRE_APARTMENT"
  | "ENTIRE_EARTH_HOUSE"
  | "ENTIRE_CABIN"
  | "ENTIRE_VILLA"
  | "ENTIRE_PLACE"
  | "ENTIRE_BOAT"
  | "PRIVATE_ROOM";

export interface PlaceParent {
  id: string;
  name?: string;
  size?: PLACE_SIZES;
  shortDescription: string;
  description: string;
  slug: string;
  maxGuests: number;
  numBedrooms: number;
  numBeds: number;
  numBaths: number;
  reviews: ReviewParent[];
  amenities: AmenitiesParent;
  host: UserParent;
  pricing: PricingParent;
  location: LocationParent;
  views: PlaceViewsParent;
  guestRequirements?: GuestRequirementsParent;
  policies?: PoliciesParent;
  houseRules?: HouseRulesParent;
  bookings: BookingParent[];
  pictures: PictureParent[];
  popularity: number;
}

export const Place: PlaceResolvers.Resolver<TypeMap> = {
  id: parent => parent.id,
  name: parent => parent.name,
  size: parent => parent.size,
  shortDescription: parent => parent.shortDescription,
  description: parent => parent.description,
  slug: parent => parent.slug,
  maxGuests: parent => parent.maxGuests,
  numBedrooms: parent => parent.numBedrooms,
  numBeds: parent => parent.numBeds,
  numBaths: parent => parent.numBaths,
  reviews: parent => parent.reviews,
  amenities: parent => parent.amenities,
  host: parent => parent.host,
  pricing: parent => parent.pricing,
  location: parent => parent.location,
  views: parent => parent.views,
  guestRequirements: parent => parent.guestRequirements,
  policies: parent => parent.policies,
  houseRules: parent => parent.houseRules,
  bookings: parent => parent.bookings,
  pictures: parent => parent.pictures,
  popularity: parent => parent.popularity
};
