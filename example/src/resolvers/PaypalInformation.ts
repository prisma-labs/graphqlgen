import { PaypalInformationResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";
import { PaymentAccountParent } from "./PaymentAccount";

export interface PaypalInformationParent {
  createdAt: string;
  email: string;
  id: string;
  paymentAccount: PaymentAccountParent;
}

export const PaypalInformation: PaypalInformationResolvers.Resolver<TypeMap> = {
  createdAt: parent => parent.createdAt,
  email: parent => parent.email,
  id: parent => parent.id,
  paymentAccount: parent => parent.paymentAccount
};
