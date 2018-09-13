import { IPricing } from "../generated/resolvers";
import { Types } from "./types/typemap";

export type CURRENCY = "CAD" | "CHF" | "EUR" | "JPY" | "USD" | "ZAR";

export interface PricingParent {
  averageMonthly: number;
  averageWeekly: number;
  basePrice: number;
  cleaningFee?: number;
  currency?: CURRENCY;
  extraGuests?: number;
  id: string;
  monthlyDiscount?: number;
  perNight: number;
  securityDeposit?: number;
  smartPricing: boolean;
  weekendPricing?: number;
  weeklyDiscount?: number;
}

export const Pricing: IPricing.Resolver<Types> = {
  averageMonthly: parent => parent.averageMonthly,
  averageWeekly: parent => parent.averageWeekly,
  basePrice: parent => parent.basePrice,
  cleaningFee: parent => parent.cleaningFee,
  currency: parent => parent.currency,
  extraGuests: parent => parent.extraGuests,
  id: parent => parent.id,
  monthlyDiscount: parent => parent.monthlyDiscount,
  perNight: parent => parent.perNight,
  securityDeposit: parent => parent.securityDeposit,
  smartPricing: parent => parent.smartPricing,
  weekendPricing: parent => parent.weekendPricing,
  weeklyDiscount: parent => parent.weeklyDiscount
};
