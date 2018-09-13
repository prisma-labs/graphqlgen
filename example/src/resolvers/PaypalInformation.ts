import { IPaypalInformation } from "../generated/resolvers";
import { Types } from "./typemap";
import { PaymentAccountParent } from "./PaymentAccount";

export interface PaypalInformationParent {
  createdAt: string;
  email: string;
  id: string;
  paymentAccount: PaymentAccountParent;
}

export const PaypalInformation: IPaypalInformation.Resolver<Types> = {
  createdAt: parent => parent.createdAt,
  email: parent => parent.email,
  id: parent => parent.id,
  paymentAccount: parent => parent.paymentAccount
};
