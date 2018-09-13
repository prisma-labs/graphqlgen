import { IPayment } from "../generated/resolvers";
import { Types } from "./types/typemap";
import { BookingParent } from "./Booking";
import { PaymentAccountParent } from "./PaymentAccount";

export interface PaymentParent {
  booking: BookingParent;
  createdAt: string;
  id: string;
  paymentMethod: PaymentAccountParent;
  serviceFee: number;
}

export const Payment: IPayment.Resolver<Types> = {
  booking: parent => parent.booking,
  createdAt: parent => parent.createdAt,
  id: parent => parent.id,
  paymentMethod: parent => parent.paymentMethod,
  serviceFee: parent => parent.serviceFee
};
