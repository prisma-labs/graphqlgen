import { IResolvers } from "../generated";
import { TypeMap } from "./types/TypeMap";

import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { Viewer } from "./Viewer";
import { AuthPayload } from "./AuthPayload";
import { MutationResult } from "./MutationResult";
import { ExperiencesByCity } from "./ExperiencesByCity";
import { Home } from "./Home";
import { Reservation } from "./Reservation";
import { Experience } from "./Experience";
import { Review } from "./Review";
import { Neighbourhood } from "./Neighbourhood";
import { Location } from "./Location";
import { Picture } from "./Picture";
import { City } from "./City";
import { ExperienceCategory } from "./ExperienceCategory";
import { User } from "./User";
import { PaymentAccount } from "./PaymentAccount";
import { Place } from "./Place";
import { Booking } from "./Booking";
import { Notification } from "./Notification";
import { Payment } from "./Payment";
import { PaypalInformation } from "./PaypalInformation";
import { CreditCardInformation } from "./CreditCardInformation";
import { Message } from "./Message";
import { Pricing } from "./Pricing";
import { PlaceViews } from "./PlaceViews";
import { GuestRequirements } from "./GuestRequirements";
import { Policies } from "./Policies";
import { HouseRules } from "./HouseRules";
import { Amenities } from "./Amenities";

export const resolvers: IResolvers<TypeMap> = {
  Query,
  Mutation,
  Viewer,
  AuthPayload,
  MutationResult,
  ExperiencesByCity,
  Home,
  Reservation,
  Experience,
  Review,
  Neighbourhood,
  Location,
  Picture,
  City,
  ExperienceCategory,
  User,
  PaymentAccount,
  Place,
  Booking,
  Notification,
  Payment,
  PaypalInformation,
  CreditCardInformation,
  Message,
  Pricing,
  PlaceViews,
  GuestRequirements,
  Policies,
  HouseRules,
  Amenities
};
