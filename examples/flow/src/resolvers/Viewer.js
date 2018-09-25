import { ViewerResolvers } from "../generated";
import { TypeMap } from "./types/TypeMap";
import { UserParent } from "./User";
import { BookingParent } from "./Booking";

export interface ViewerParent {
  me: UserParent;
  bookings: BookingParent[];
}

export const Viewer: ViewerResolvers.Type<TypeMap> = {
  me: parent => parent.me,
  bookings: parent => parent.bookings
};
