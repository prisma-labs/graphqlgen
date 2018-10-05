import { PaymentAccountResolvers } from "../generated";
import { TypeMap } from "./types/TypeMap";
import { UserParent } from "./User";
import { PaymentParent } from "./Payment";
import { PaypalInformationParent } from "./PaypalInformation";
import { CreditCardInformationParent } from "./CreditCardInformation";

export type PAYMENT_PROVIDER = "PAYPAL" | "CREDIT_CARD";

export interface PaymentAccountParent {
  id: string;
  createdAt: string;
  type?: PAYMENT_PROVIDER;
  user: UserParent;
  payments: PaymentParent[];
  paypal?: PaypalInformationParent;
  creditcard?: CreditCardInformationParent;
}

export const PaymentAccount: PaymentAccountResolvers.Type<TypeMap> = {
  id: parent => parent.id,
  createdAt: parent => parent.createdAt,
  type: parent => parent.type,
  user: parent => parent.user,
  payments: parent => parent.payments,
  paypal: parent => parent.paypal,
  creditcard: parent => parent.creditcard
};
