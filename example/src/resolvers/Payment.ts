import { PaymentResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";
import { BookingParent } from "./Booking";
import { PaymentAccountParent } from "./PaymentAccount";

export interface PaymentParent {
  booking: BookingParent;
  createdAt: string;
  id: string;
  paymentMethod: PaymentAccountParent;
  serviceFee: number;
}

export const Payment: PaymentResolvers.Type<TypeMap> = {
  booking: parent => parent.booking,
  createdAt: parent => parent.createdAt,
  id: parent => parent.id,
  paymentMethod: parent => parent.paymentMethod,
  serviceFee: parent => parent.serviceFee
};
