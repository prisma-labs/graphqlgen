import { PricingResolvers } from "../generated";
import { TypeMap } from "./types/TypeMap";

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

export const Pricing: PricingResolvers.Type<TypeMap> = {
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
