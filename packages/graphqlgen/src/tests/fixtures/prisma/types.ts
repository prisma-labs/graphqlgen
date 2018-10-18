export interface Context {
  db: any
}

export type Long = string

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 
*/
export type Int = number

/*
DateTime scalar input type, allowing Date
*/
export type DateTimeInput = Date | string

/*
DateTime scalar output type, which is always a string
*/
export type DateTimeOutput = string
export type Float = number

export interface User {
  id: ID_Output
  createdAt: DateTimeOutput
  updatedAt: DateTimeOutput
  firstName: String
  lastName: String
  email: String
  password: String
  phone: String
  responseRate?: Float
  responseTime?: Int
  isSuperHost: Boolean
}

export interface PlaceNode {
  id: ID_Output
  name: String
  // size?: PLACE_SIZES;
  shortDescription: String
  description: String
  slug: String
  maxGuests: Int
  numBedrooms: Int
  numBeds: Int
  numBaths: Int
  popularity: Int
}

export interface PricingNode {
  id: ID_Output
  monthlyDiscount?: Int
  weeklyDiscount?: Int
  perNight: Int
  smartPricing: Boolean
  basePrice: Int
  averageWeekly: Int
  averageMonthly: Int
  cleaningFee?: Int
  securityDeposit?: Int
  extraGuests?: Int
  weekendPricing?: Int
  // currency?: CURRENCY;
}

export interface GuestRequirementsNode {
  id: ID_Output
  govIssuedId: Boolean
  recommendationsFromOtherHosts: Boolean
  guestTripInformation: Boolean
}
