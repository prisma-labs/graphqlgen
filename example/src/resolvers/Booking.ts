import { IBooking } from "../generated/resolvers";
import { Types } from "./types/typemap";
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

export const Booking: IBooking.Resolver<Types> = {
  id: parent => parent.id,
  createdAt: parent => parent.createdAt,
  bookee: parent => parent.bookee,
  place: parent => parent.place,
  startDate: parent => parent.startDate,
  endDate: parent => parent.endDate,
  payment: parent => parent.payment
};
