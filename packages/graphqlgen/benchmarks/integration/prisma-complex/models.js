// @flow

export interface Experience {
  id: string;
  category: any | null;
  title: string;
  location: any;
  pricePerPerson: number;
  reviews: any[];
  preview: any;
  popularity: number;
}

export interface ExperienceCategory {
  id: string;
  mainColor: string;
  name: string;
  experience: any | null;
}

export interface Location {
  id: string;
  lat: number;
  lng: number;
  address: string | null;
  directions: string | null;
}

export interface Review {
  accuracy: number;
  checkIn: number;
  cleanliness: number;
  communication: number;
  createdAt: string;
  id: string;
  location: number;
  stars: number;
  text: string;
  value: number;
}

export interface Picture {
  id: string;
  url: string;
}

export interface Place {
  id: string;
  name: string | null;
  size: any | null;
  shortDescription: string;
  description: string;
  slug: string;
  maxGuests: number;
  numRatings: number;
  avgRating: number | null;
  numBedrooms: number;
  numBeds: number;
  numBaths: number;
  reviews: any[];
  amenities: any;
  host: any;
  pricing: any;
  location: any;
  views: any;
  guestRequirements: any | null;
  policies: any | null;
  houseRules: any | null;
  bookings: any[];
  pictures: any[];
  popularity: number;
}

export interface PLACE_SIZES {}

export interface Amenities {
  airConditioning: boolean;
  babyBath: boolean;
  babyMonitor: boolean;
  babysitterRecommendations: boolean;
  bathtub: boolean;
  breakfast: boolean;
  buzzerWirelessIntercom: boolean;
  cableTv: boolean;
  changingTable: boolean;
  childrensBooksAndToys: boolean;
  childrensDinnerware: boolean;
  crib: boolean;
  doorman: boolean;
  dryer: boolean;
  elevator: boolean;
  essentials: boolean;
  familyKidFriendly: boolean;
  freeParkingOnPremises: boolean;
  freeParkingOnStreet: boolean;
  gym: boolean;
  hairDryer: boolean;
  hangers: boolean;
  heating: boolean;
  hotTub: boolean;
  id: string;
  indoorFireplace: boolean;
  internet: boolean;
  iron: boolean;
  kitchen: boolean;
  laptopFriendlyWorkspace: boolean;
  paidParkingOffPremises: boolean;
  petsAllowed: boolean;
  pool: boolean;
  privateEntrance: boolean;
  shampoo: boolean;
  smokingAllowed: boolean;
  suitableForEvents: boolean;
  tv: boolean;
  washer: boolean;
  wheelchairAccessible: boolean;
  wirelessInternet: boolean;
}

export interface User {
  bookings: any[];
  createdAt: string;
  email: string;
  firstName: string;
  hostingExperiences: any[];
  id: string;
  isSuperHost: boolean;
  lastName: string;
  location: any | null;
  notifications: any[];
  ownedPlaces: any[];
  paymentAccount: any[] | null;
  phone: string;
  profilePicture: any | null;
  receivedMessages: any[];
  responseRate: number | null;
  responseTime: number | null;
  sentMessages: any[];
  updatedAt: string;
}

export interface Booking {
  id: string;
  createdAt: string;
  bookee: any;
  place: any;
  startDate: any;
  endDate: any;
  payment: any;
}

export interface Payment {
  booking: any;
  createdAt: string;
  id: string;
  paymentMethod: any;
  serviceFee: number;
}

export interface PaymentAccount {
  id: string;
  createdAt: string;
  type: any | null;
  user: any;
  payments: any[];
  paypal: any | null;
  creditcard: any | null;
}

export interface PAYMENT_PROVIDER {}

export interface PaypalInformation {
  createdAt: string;
  email: string;
  id: string;
  paymentAccount: any;
}

export interface CreditCardInformation {
  cardNumber: string;
  country: string;
  createdAt: string;
  expiresOnMonth: number;
  expiresOnYear: number;
  firstName: string;
  id: string;
  lastName: string;
  paymentAccount: any | null;
  postalCode: string;
  securityCode: string;
}

export interface Notification {
  createdAt: string;
  id: string;
  link: string;
  readDate: any;
  type: any | null;
  user: any;
}

export interface NOTIFICATION_TYPE {}

export interface Message {
  createdAt: string;
  deliveredAt: any;
  id: string;
  readAt: any;
}

export interface Pricing {
  averageMonthly: number;
  averageWeekly: number;
  basePrice: number;
  cleaningFee: number | null;
  currency: any | null;
  extraGuests: number | null;
  id: string;
  monthlyDiscount: number | null;
  perNight: number;
  securityDeposit: number | null;
  smartPricing: boolean;
  weekendPricing: number | null;
  weeklyDiscount: number | null;
}

export interface CURRENCY {}

export interface PlaceViews {
  id: string;
  lastWeek: number;
}

export interface GuestRequirements {
  govIssuedId: boolean;
  guestTripInformation: boolean;
  id: string;
  recommendationsFromOtherHosts: boolean;
}

export interface Policies {
  checkInEndTime: number;
  checkInStartTime: number;
  checkoutTime: number;
  createdAt: string;
  id: string;
  updatedAt: string;
}

export interface HouseRules {
  additionalRules: string | null;
  createdAt: string;
  id: string;
  partiesAndEventsAllowed: boolean | null;
  petsAllowed: boolean | null;
  smokingAllowed: boolean | null;
  suitableForChildren: boolean | null;
  suitableForInfants: boolean | null;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  title: string;
  avgPricePerPerson: number;
  pictures: any[];
  location: any;
  isCurated: boolean;
  slug: string;
  popularity: number;
}

export interface Neighbourhood {
  id: string;
  name: string;
  slug: string;
  homePreview: any | null;
  city: any;
  featured: boolean;
  popularity: number;
}

export interface City {
  id: string;
  name: string;
}

export interface ExperiencesByCity {
  experiences: any[];
  city: any;
}

export interface Viewer {
  me: any;
  bookings: any[];
}

export interface AuthPayload {
  token: string;
  user: any;
}

export interface MutationResult {
  success: boolean;
}

export interface CitySubscriptionPayload {
  mutation: any;
  node: any | null;
  updatedFields: string[];
  previousValues: any | null;
}

export interface MutationType {}

export interface CityPreviousValues {
  id: string;
  name: string;
}

export interface Home {
  id: string;
  name: string | null;
  description: string;
  numRatings: number;
  avgRating: number | null;
  pictures: any[];
  perNight: number;
}
