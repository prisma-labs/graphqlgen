import { ICreditCardInformation } from "../generated/resolvers";
import { Types } from "./typemap";
import { PaymentAccountParent } from "./PaymentAccount";

export interface CreditCardInformationParent {
  cardNumber: string;
  country: string;
  createdAt: string;
  expiresOnMonth: number;
  expiresOnYear: number;
  firstName: string;
  id: string;
  lastName: string;
  paymentAccount?: PaymentAccountParent;
  postalCode: string;
  securityCode: string;
}

export const CreditCardInformation: ICreditCardInformation.Resolver<Types> = {
  cardNumber: parent => parent.cardNumber,
  country: parent => parent.country,
  createdAt: parent => parent.createdAt,
  expiresOnMonth: parent => parent.expiresOnMonth,
  expiresOnYear: parent => parent.expiresOnYear,
  firstName: parent => parent.firstName,
  id: parent => parent.id,
  lastName: parent => parent.lastName,
  paymentAccount: parent => parent.paymentAccount,
  postalCode: parent => parent.postalCode,
  securityCode: parent => parent.securityCode
};
