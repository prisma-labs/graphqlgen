import { BookingResolvers } from "../generated";
import { TypeMap } from "./types/TypeMap";
import { UserParent } from "./User";
import { PlaceParent } from "./Place";
import { PaymentParent } from "./Payment";

export interface BookingParent {
  id: string;
  createdAt: string;
  bookee: UserParent;
  place: PlaceParent;
  startDate: string;
  endDate: string;
  payment: PaymentParent;
}

export const Booking: BookingResolvers.Type<TypeMap> = {
  id: parent => parent.id,
  createdAt: parent => parent.createdAt,
  bookee: parent => parent.bookee,
  place: parent => parent.place,
  startDate: parent => parent.startDate,
  endDate: parent => parent.endDate,
  payment: parent => parent.payment
};
