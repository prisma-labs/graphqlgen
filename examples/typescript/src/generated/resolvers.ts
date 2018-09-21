import { GraphQLResolveInfo } from "graphql";

export interface ITypeMap {
  Context: any;
  PAYMENT_PROVIDER: any;
  PLACE_SIZES: any;
  NOTIFICATION_TYPE: any;
  CURRENCY: any;

  QueryParent: any;
  MutationParent: any;
  ViewerParent: any;
  AuthPayloadParent: any;
  MutationResultParent: any;
  ExperiencesByCityParent: any;
  HomeParent: any;
  ReservationParent: any;
  ExperienceParent: any;
  ReviewParent: any;
  NeighbourhoodParent: any;
  LocationParent: any;
  PictureParent: any;
  CityParent: any;
  ExperienceCategoryParent: any;
  UserParent: any;
  PaymentAccountParent: any;
  PlaceParent: any;
  BookingParent: any;
  NotificationParent: any;
  PaymentParent: any;
  PaypalInformationParent: any;
  CreditCardInformationParent: any;
  MessageParent: any;
  PricingParent: any;
  PlaceViewsParent: any;
  GuestRequirementsParent: any;
  PoliciesParent: any;
  HouseRulesParent: any;
  AmenitiesParent: any;
}

export namespace QueryResolvers {
  export type TopExperiencesType<T extends ITypeMap> = (
    parent: T["QueryParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["ExperienceParent"][];

  export type TopHomesType<T extends ITypeMap> = (
    parent: T["QueryParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["HomeParent"][];

  export interface ArgsHomesInPriceRange {
    min: number;
    max: number;
  }

  export type HomesInPriceRangeType<T extends ITypeMap> = (
    parent: T["QueryParent"],
    args: ArgsHomesInPriceRange,
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["HomeParent"][];

  export type TopReservationsType<T extends ITypeMap> = (
    parent: T["QueryParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["ReservationParent"][];

  export type FeaturedDestinationsType<T extends ITypeMap> = (
    parent: T["QueryParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["NeighbourhoodParent"][];

  export interface ArgsExperiencesByCity {
    cities: string[];
  }

  export type ExperiencesByCityType<T extends ITypeMap> = (
    parent: T["QueryParent"],
    args: ArgsExperiencesByCity,
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["ExperiencesByCityParent"][];

  export type ViewerType<T extends ITypeMap> = (
    parent: T["QueryParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["ViewerParent"] | null;

  export type MyLocationType<T extends ITypeMap> = (
    parent: T["QueryParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["LocationParent"] | null;

  export interface Type<T extends ITypeMap> {
    topExperiences: (
      parent: T["QueryParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["ExperienceParent"][];
    topHomes: (
      parent: T["QueryParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["HomeParent"][];
    homesInPriceRange: (
      parent: T["QueryParent"],
      args: ArgsHomesInPriceRange,
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["HomeParent"][];
    topReservations: (
      parent: T["QueryParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["ReservationParent"][];
    featuredDestinations: (
      parent: T["QueryParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["NeighbourhoodParent"][];
    experiencesByCity: (
      parent: T["QueryParent"],
      args: ArgsExperiencesByCity,
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["ExperiencesByCityParent"][];
    viewer: (
      parent: T["QueryParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["ViewerParent"] | null;
    myLocation: (
      parent: T["QueryParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["LocationParent"] | null;
  }
}

export namespace MutationResolvers {
  export interface ArgsSignup {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }

  export type SignupType<T extends ITypeMap> = (
    parent: T["MutationParent"],
    args: ArgsSignup,
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["AuthPayloadParent"];

  export interface ArgsLogin {
    email: string;
    password: string;
  }

  export type LoginType<T extends ITypeMap> = (
    parent: T["MutationParent"],
    args: ArgsLogin,
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["AuthPayloadParent"];

  export interface ArgsAddPaymentMethod {
    cardNumber: string;
    expiresOnMonth: number;
    expiresOnYear: number;
    securityCode: string;
    firstName: string;
    lastName: string;
    postalCode: string;
    country: string;
  }

  export type AddPaymentMethodType<T extends ITypeMap> = (
    parent: T["MutationParent"],
    args: ArgsAddPaymentMethod,
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["MutationResultParent"];

  export interface ArgsBook {
    placeId: string;
    checkIn: string;
    checkOut: string;
    numGuests: number;
  }

  export type BookType<T extends ITypeMap> = (
    parent: T["MutationParent"],
    args: ArgsBook,
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["MutationResultParent"];

  export interface Type<T extends ITypeMap> {
    signup: (
      parent: T["MutationParent"],
      args: ArgsSignup,
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["AuthPayloadParent"];
    login: (
      parent: T["MutationParent"],
      args: ArgsLogin,
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["AuthPayloadParent"];
    addPaymentMethod: (
      parent: T["MutationParent"],
      args: ArgsAddPaymentMethod,
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["MutationResultParent"];
    book: (
      parent: T["MutationParent"],
      args: ArgsBook,
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["MutationResultParent"];
  }
}

export namespace ViewerResolvers {
  export type MeType<T extends ITypeMap> = (
    parent: T["ViewerParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["UserParent"];

  export type BookingsType<T extends ITypeMap> = (
    parent: T["ViewerParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["BookingParent"][];

  export interface Type<T extends ITypeMap> {
    me: (
      parent: T["ViewerParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["UserParent"];
    bookings: (
      parent: T["ViewerParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["BookingParent"][];
  }
}

export namespace AuthPayloadResolvers {
  export type TokenType<T extends ITypeMap> = (
    parent: T["AuthPayloadParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type UserType<T extends ITypeMap> = (
    parent: T["AuthPayloadParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["UserParent"];

  export interface Type<T extends ITypeMap> {
    token: (
      parent: T["AuthPayloadParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    user: (
      parent: T["AuthPayloadParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["UserParent"];
  }
}

export namespace MutationResultResolvers {
  export type SuccessType<T extends ITypeMap> = (
    parent: T["MutationResultParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export interface Type<T extends ITypeMap> {
    success: (
      parent: T["MutationResultParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
  }
}

export namespace ExperiencesByCityResolvers {
  export type ExperiencesType<T extends ITypeMap> = (
    parent: T["ExperiencesByCityParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["ExperienceParent"][];

  export type CityType<T extends ITypeMap> = (
    parent: T["ExperiencesByCityParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["CityParent"];

  export interface Type<T extends ITypeMap> {
    experiences: (
      parent: T["ExperiencesByCityParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["ExperienceParent"][];
    city: (
      parent: T["ExperiencesByCityParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["CityParent"];
  }
}

export namespace HomeResolvers {
  export type IdType<T extends ITypeMap> = (
    parent: T["HomeParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type NameType<T extends ITypeMap> = (
    parent: T["HomeParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string | null;

  export type DescriptionType<T extends ITypeMap> = (
    parent: T["HomeParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type NumRatingsType<T extends ITypeMap> = (
    parent: T["HomeParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type AvgRatingType<T extends ITypeMap> = (
    parent: T["HomeParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number | null;

  export interface ArgsPictures {
    first: number | null;
  }

  export type PicturesType<T extends ITypeMap> = (
    parent: T["HomeParent"],
    args: ArgsPictures,
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PictureParent"][];

  export type PerNightType<T extends ITypeMap> = (
    parent: T["HomeParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export interface Type<T extends ITypeMap> {
    id: (
      parent: T["HomeParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    name: (
      parent: T["HomeParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string | null;
    description: (
      parent: T["HomeParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    numRatings: (
      parent: T["HomeParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    avgRating: (
      parent: T["HomeParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number | null;
    pictures: (
      parent: T["HomeParent"],
      args: ArgsPictures,
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PictureParent"][];
    perNight: (
      parent: T["HomeParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
  }
}

export namespace ReservationResolvers {
  export type IdType<T extends ITypeMap> = (
    parent: T["ReservationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type TitleType<T extends ITypeMap> = (
    parent: T["ReservationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type AvgPricePerPersonType<T extends ITypeMap> = (
    parent: T["ReservationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type PicturesType<T extends ITypeMap> = (
    parent: T["ReservationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PictureParent"][];

  export type LocationType<T extends ITypeMap> = (
    parent: T["ReservationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["LocationParent"];

  export type IsCuratedType<T extends ITypeMap> = (
    parent: T["ReservationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type SlugType<T extends ITypeMap> = (
    parent: T["ReservationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type PopularityType<T extends ITypeMap> = (
    parent: T["ReservationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export interface Type<T extends ITypeMap> {
    id: (
      parent: T["ReservationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    title: (
      parent: T["ReservationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    avgPricePerPerson: (
      parent: T["ReservationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    pictures: (
      parent: T["ReservationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PictureParent"][];
    location: (
      parent: T["ReservationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["LocationParent"];
    isCurated: (
      parent: T["ReservationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    slug: (
      parent: T["ReservationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    popularity: (
      parent: T["ReservationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
  }
}

export namespace ExperienceResolvers {
  export type IdType<T extends ITypeMap> = (
    parent: T["ExperienceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type CategoryType<T extends ITypeMap> = (
    parent: T["ExperienceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["ExperienceCategoryParent"] | null;

  export type TitleType<T extends ITypeMap> = (
    parent: T["ExperienceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type LocationType<T extends ITypeMap> = (
    parent: T["ExperienceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["LocationParent"];

  export type PricePerPersonType<T extends ITypeMap> = (
    parent: T["ExperienceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type ReviewsType<T extends ITypeMap> = (
    parent: T["ExperienceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["ReviewParent"][];

  export type PreviewType<T extends ITypeMap> = (
    parent: T["ExperienceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PictureParent"];

  export type PopularityType<T extends ITypeMap> = (
    parent: T["ExperienceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export interface Type<T extends ITypeMap> {
    id: (
      parent: T["ExperienceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    category: (
      parent: T["ExperienceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["ExperienceCategoryParent"] | null;
    title: (
      parent: T["ExperienceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    location: (
      parent: T["ExperienceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["LocationParent"];
    pricePerPerson: (
      parent: T["ExperienceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    reviews: (
      parent: T["ExperienceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["ReviewParent"][];
    preview: (
      parent: T["ExperienceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PictureParent"];
    popularity: (
      parent: T["ExperienceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
  }
}

export namespace ReviewResolvers {
  export type AccuracyType<T extends ITypeMap> = (
    parent: T["ReviewParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type CheckInType<T extends ITypeMap> = (
    parent: T["ReviewParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type CleanlinessType<T extends ITypeMap> = (
    parent: T["ReviewParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type CommunicationType<T extends ITypeMap> = (
    parent: T["ReviewParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type CreatedAtType<T extends ITypeMap> = (
    parent: T["ReviewParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type IdType<T extends ITypeMap> = (
    parent: T["ReviewParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type LocationType<T extends ITypeMap> = (
    parent: T["ReviewParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type StarsType<T extends ITypeMap> = (
    parent: T["ReviewParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type TextType<T extends ITypeMap> = (
    parent: T["ReviewParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type ValueType<T extends ITypeMap> = (
    parent: T["ReviewParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export interface Type<T extends ITypeMap> {
    accuracy: (
      parent: T["ReviewParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    checkIn: (
      parent: T["ReviewParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    cleanliness: (
      parent: T["ReviewParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    communication: (
      parent: T["ReviewParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    createdAt: (
      parent: T["ReviewParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    id: (
      parent: T["ReviewParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    location: (
      parent: T["ReviewParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    stars: (
      parent: T["ReviewParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    text: (
      parent: T["ReviewParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    value: (
      parent: T["ReviewParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
  }
}

export namespace NeighbourhoodResolvers {
  export type IdType<T extends ITypeMap> = (
    parent: T["NeighbourhoodParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type NameType<T extends ITypeMap> = (
    parent: T["NeighbourhoodParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type SlugType<T extends ITypeMap> = (
    parent: T["NeighbourhoodParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type HomePreviewType<T extends ITypeMap> = (
    parent: T["NeighbourhoodParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PictureParent"] | null;

  export type CityType<T extends ITypeMap> = (
    parent: T["NeighbourhoodParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["CityParent"];

  export type FeaturedType<T extends ITypeMap> = (
    parent: T["NeighbourhoodParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type PopularityType<T extends ITypeMap> = (
    parent: T["NeighbourhoodParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export interface Type<T extends ITypeMap> {
    id: (
      parent: T["NeighbourhoodParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    name: (
      parent: T["NeighbourhoodParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    slug: (
      parent: T["NeighbourhoodParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    homePreview: (
      parent: T["NeighbourhoodParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PictureParent"] | null;
    city: (
      parent: T["NeighbourhoodParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["CityParent"];
    featured: (
      parent: T["NeighbourhoodParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    popularity: (
      parent: T["NeighbourhoodParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
  }
}

export namespace LocationResolvers {
  export type IdType<T extends ITypeMap> = (
    parent: T["LocationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type LatType<T extends ITypeMap> = (
    parent: T["LocationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type LngType<T extends ITypeMap> = (
    parent: T["LocationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type AddressType<T extends ITypeMap> = (
    parent: T["LocationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string | null;

  export type DirectionsType<T extends ITypeMap> = (
    parent: T["LocationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string | null;

  export interface Type<T extends ITypeMap> {
    id: (
      parent: T["LocationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    lat: (
      parent: T["LocationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    lng: (
      parent: T["LocationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    address: (
      parent: T["LocationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string | null;
    directions: (
      parent: T["LocationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string | null;
  }
}

export namespace PictureResolvers {
  export type IdType<T extends ITypeMap> = (
    parent: T["PictureParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type UrlType<T extends ITypeMap> = (
    parent: T["PictureParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export interface Type<T extends ITypeMap> {
    id: (
      parent: T["PictureParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    url: (
      parent: T["PictureParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
  }
}

export namespace CityResolvers {
  export type IdType<T extends ITypeMap> = (
    parent: T["CityParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type NameType<T extends ITypeMap> = (
    parent: T["CityParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export interface Type<T extends ITypeMap> {
    id: (
      parent: T["CityParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    name: (
      parent: T["CityParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
  }
}

export namespace ExperienceCategoryResolvers {
  export type IdType<T extends ITypeMap> = (
    parent: T["ExperienceCategoryParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type MainColorType<T extends ITypeMap> = (
    parent: T["ExperienceCategoryParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type NameType<T extends ITypeMap> = (
    parent: T["ExperienceCategoryParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type ExperienceType<T extends ITypeMap> = (
    parent: T["ExperienceCategoryParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["ExperienceParent"] | null;

  export interface Type<T extends ITypeMap> {
    id: (
      parent: T["ExperienceCategoryParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    mainColor: (
      parent: T["ExperienceCategoryParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    name: (
      parent: T["ExperienceCategoryParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    experience: (
      parent: T["ExperienceCategoryParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["ExperienceParent"] | null;
  }
}

export namespace UserResolvers {
  export type BookingsType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["BookingParent"][];

  export type CreatedAtType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type EmailType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type FirstNameType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type HostingExperiencesType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["ExperienceParent"][];

  export type IdType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type IsSuperHostType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type LastNameType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type LocationType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["LocationParent"];

  export type NotificationsType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["NotificationParent"][];

  export type OwnedPlacesType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PlaceParent"][];

  export type PaymentAccountType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PaymentAccountParent"][];

  export type PhoneType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type ProfilePictureType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PictureParent"] | null;

  export type ReceivedMessagesType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["MessageParent"][];

  export type ResponseRateType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number | null;

  export type ResponseTimeType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number | null;

  export type SentMessagesType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["MessageParent"][];

  export type UpdatedAtType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type TokenType<T extends ITypeMap> = (
    parent: T["UserParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export interface Type<T extends ITypeMap> {
    bookings: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["BookingParent"][];
    createdAt: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    email: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    firstName: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    hostingExperiences: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["ExperienceParent"][];
    id: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    isSuperHost: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    lastName: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    location: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["LocationParent"];
    notifications: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["NotificationParent"][];
    ownedPlaces: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PlaceParent"][];
    paymentAccount: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PaymentAccountParent"][];
    phone: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    profilePicture: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PictureParent"] | null;
    receivedMessages: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["MessageParent"][];
    responseRate: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number | null;
    responseTime: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number | null;
    sentMessages: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["MessageParent"][];
    updatedAt: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    token: (
      parent: T["UserParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
  }
}

export namespace PaymentAccountResolvers {
  export type IdType<T extends ITypeMap> = (
    parent: T["PaymentAccountParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type CreatedAtType<T extends ITypeMap> = (
    parent: T["PaymentAccountParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type TypeType<T extends ITypeMap> = (
    parent: T["PaymentAccountParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PAYMENT_PROVIDER"] | null;

  export type UserType<T extends ITypeMap> = (
    parent: T["PaymentAccountParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["UserParent"];

  export type PaymentsType<T extends ITypeMap> = (
    parent: T["PaymentAccountParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PaymentParent"][];

  export type PaypalType<T extends ITypeMap> = (
    parent: T["PaymentAccountParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PaypalInformationParent"] | null;

  export type CreditcardType<T extends ITypeMap> = (
    parent: T["PaymentAccountParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["CreditCardInformationParent"] | null;

  export interface Type<T extends ITypeMap> {
    id: (
      parent: T["PaymentAccountParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    createdAt: (
      parent: T["PaymentAccountParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    type: (
      parent: T["PaymentAccountParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PAYMENT_PROVIDER"] | null;
    user: (
      parent: T["PaymentAccountParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["UserParent"];
    payments: (
      parent: T["PaymentAccountParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PaymentParent"][];
    paypal: (
      parent: T["PaymentAccountParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PaypalInformationParent"] | null;
    creditcard: (
      parent: T["PaymentAccountParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["CreditCardInformationParent"] | null;
  }
}

export namespace PlaceResolvers {
  export type IdType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type NameType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string | null;

  export type SizeType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PLACE_SIZES"] | null;

  export type ShortDescriptionType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type DescriptionType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type SlugType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type MaxGuestsType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type NumBedroomsType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type NumBedsType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type NumBathsType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type ReviewsType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["ReviewParent"][];

  export type AmenitiesType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["AmenitiesParent"];

  export type HostType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["UserParent"];

  export type PricingType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PricingParent"];

  export type LocationType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["LocationParent"];

  export type ViewsType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PlaceViewsParent"];

  export type GuestRequirementsType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["GuestRequirementsParent"] | null;

  export type PoliciesType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PoliciesParent"] | null;

  export type HouseRulesType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["HouseRulesParent"] | null;

  export type BookingsType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["BookingParent"][];

  export type PicturesType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PictureParent"][];

  export type PopularityType<T extends ITypeMap> = (
    parent: T["PlaceParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export interface Type<T extends ITypeMap> {
    id: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    name: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string | null;
    size: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PLACE_SIZES"] | null;
    shortDescription: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    description: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    slug: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    maxGuests: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    numBedrooms: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    numBeds: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    numBaths: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    reviews: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["ReviewParent"][];
    amenities: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["AmenitiesParent"];
    host: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["UserParent"];
    pricing: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PricingParent"];
    location: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["LocationParent"];
    views: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PlaceViewsParent"];
    guestRequirements: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["GuestRequirementsParent"] | null;
    policies: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PoliciesParent"] | null;
    houseRules: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["HouseRulesParent"] | null;
    bookings: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["BookingParent"][];
    pictures: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PictureParent"][];
    popularity: (
      parent: T["PlaceParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
  }
}

export namespace BookingResolvers {
  export type IdType<T extends ITypeMap> = (
    parent: T["BookingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type CreatedAtType<T extends ITypeMap> = (
    parent: T["BookingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type BookeeType<T extends ITypeMap> = (
    parent: T["BookingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["UserParent"];

  export type PlaceType<T extends ITypeMap> = (
    parent: T["BookingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PlaceParent"];

  export type StartDateType<T extends ITypeMap> = (
    parent: T["BookingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type EndDateType<T extends ITypeMap> = (
    parent: T["BookingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type PaymentType<T extends ITypeMap> = (
    parent: T["BookingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PaymentParent"];

  export interface Type<T extends ITypeMap> {
    id: (
      parent: T["BookingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    createdAt: (
      parent: T["BookingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    bookee: (
      parent: T["BookingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["UserParent"];
    place: (
      parent: T["BookingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PlaceParent"];
    startDate: (
      parent: T["BookingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    endDate: (
      parent: T["BookingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    payment: (
      parent: T["BookingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PaymentParent"];
  }
}

export namespace NotificationResolvers {
  export type CreatedAtType<T extends ITypeMap> = (
    parent: T["NotificationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type IdType<T extends ITypeMap> = (
    parent: T["NotificationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type LinkType<T extends ITypeMap> = (
    parent: T["NotificationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type ReadDateType<T extends ITypeMap> = (
    parent: T["NotificationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type TypeType<T extends ITypeMap> = (
    parent: T["NotificationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["NOTIFICATION_TYPE"] | null;

  export type UserType<T extends ITypeMap> = (
    parent: T["NotificationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["UserParent"];

  export interface Type<T extends ITypeMap> {
    createdAt: (
      parent: T["NotificationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    id: (
      parent: T["NotificationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    link: (
      parent: T["NotificationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    readDate: (
      parent: T["NotificationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    type: (
      parent: T["NotificationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["NOTIFICATION_TYPE"] | null;
    user: (
      parent: T["NotificationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["UserParent"];
  }
}

export namespace PaymentResolvers {
  export type BookingType<T extends ITypeMap> = (
    parent: T["PaymentParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["BookingParent"];

  export type CreatedAtType<T extends ITypeMap> = (
    parent: T["PaymentParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type IdType<T extends ITypeMap> = (
    parent: T["PaymentParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type PaymentMethodType<T extends ITypeMap> = (
    parent: T["PaymentParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PaymentAccountParent"];

  export type ServiceFeeType<T extends ITypeMap> = (
    parent: T["PaymentParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export interface Type<T extends ITypeMap> {
    booking: (
      parent: T["PaymentParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["BookingParent"];
    createdAt: (
      parent: T["PaymentParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    id: (
      parent: T["PaymentParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    paymentMethod: (
      parent: T["PaymentParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PaymentAccountParent"];
    serviceFee: (
      parent: T["PaymentParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
  }
}

export namespace PaypalInformationResolvers {
  export type CreatedAtType<T extends ITypeMap> = (
    parent: T["PaypalInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type EmailType<T extends ITypeMap> = (
    parent: T["PaypalInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type IdType<T extends ITypeMap> = (
    parent: T["PaypalInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type PaymentAccountType<T extends ITypeMap> = (
    parent: T["PaypalInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PaymentAccountParent"];

  export interface Type<T extends ITypeMap> {
    createdAt: (
      parent: T["PaypalInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    email: (
      parent: T["PaypalInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    id: (
      parent: T["PaypalInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    paymentAccount: (
      parent: T["PaypalInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PaymentAccountParent"];
  }
}

export namespace CreditCardInformationResolvers {
  export type CardNumberType<T extends ITypeMap> = (
    parent: T["CreditCardInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type CountryType<T extends ITypeMap> = (
    parent: T["CreditCardInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type CreatedAtType<T extends ITypeMap> = (
    parent: T["CreditCardInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type ExpiresOnMonthType<T extends ITypeMap> = (
    parent: T["CreditCardInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type ExpiresOnYearType<T extends ITypeMap> = (
    parent: T["CreditCardInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type FirstNameType<T extends ITypeMap> = (
    parent: T["CreditCardInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type IdType<T extends ITypeMap> = (
    parent: T["CreditCardInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type LastNameType<T extends ITypeMap> = (
    parent: T["CreditCardInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type PaymentAccountType<T extends ITypeMap> = (
    parent: T["CreditCardInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["PaymentAccountParent"] | null;

  export type PostalCodeType<T extends ITypeMap> = (
    parent: T["CreditCardInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type SecurityCodeType<T extends ITypeMap> = (
    parent: T["CreditCardInformationParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export interface Type<T extends ITypeMap> {
    cardNumber: (
      parent: T["CreditCardInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    country: (
      parent: T["CreditCardInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    createdAt: (
      parent: T["CreditCardInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    expiresOnMonth: (
      parent: T["CreditCardInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    expiresOnYear: (
      parent: T["CreditCardInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    firstName: (
      parent: T["CreditCardInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    id: (
      parent: T["CreditCardInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    lastName: (
      parent: T["CreditCardInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    paymentAccount: (
      parent: T["CreditCardInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["PaymentAccountParent"] | null;
    postalCode: (
      parent: T["CreditCardInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    securityCode: (
      parent: T["CreditCardInformationParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
  }
}

export namespace MessageResolvers {
  export type CreatedAtType<T extends ITypeMap> = (
    parent: T["MessageParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type DeliveredAtType<T extends ITypeMap> = (
    parent: T["MessageParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type IdType<T extends ITypeMap> = (
    parent: T["MessageParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type ReadAtType<T extends ITypeMap> = (
    parent: T["MessageParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export interface Type<T extends ITypeMap> {
    createdAt: (
      parent: T["MessageParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    deliveredAt: (
      parent: T["MessageParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    id: (
      parent: T["MessageParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    readAt: (
      parent: T["MessageParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
  }
}

export namespace PricingResolvers {
  export type AverageMonthlyType<T extends ITypeMap> = (
    parent: T["PricingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type AverageWeeklyType<T extends ITypeMap> = (
    parent: T["PricingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type BasePriceType<T extends ITypeMap> = (
    parent: T["PricingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type CleaningFeeType<T extends ITypeMap> = (
    parent: T["PricingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number | null;

  export type CurrencyType<T extends ITypeMap> = (
    parent: T["PricingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => T["CURRENCY"] | null;

  export type ExtraGuestsType<T extends ITypeMap> = (
    parent: T["PricingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number | null;

  export type IdType<T extends ITypeMap> = (
    parent: T["PricingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type MonthlyDiscountType<T extends ITypeMap> = (
    parent: T["PricingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number | null;

  export type PerNightType<T extends ITypeMap> = (
    parent: T["PricingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type SecurityDepositType<T extends ITypeMap> = (
    parent: T["PricingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number | null;

  export type SmartPricingType<T extends ITypeMap> = (
    parent: T["PricingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type WeekendPricingType<T extends ITypeMap> = (
    parent: T["PricingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number | null;

  export type WeeklyDiscountType<T extends ITypeMap> = (
    parent: T["PricingParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number | null;

  export interface Type<T extends ITypeMap> {
    averageMonthly: (
      parent: T["PricingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    averageWeekly: (
      parent: T["PricingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    basePrice: (
      parent: T["PricingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    cleaningFee: (
      parent: T["PricingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number | null;
    currency: (
      parent: T["PricingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => T["CURRENCY"] | null;
    extraGuests: (
      parent: T["PricingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number | null;
    id: (
      parent: T["PricingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    monthlyDiscount: (
      parent: T["PricingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number | null;
    perNight: (
      parent: T["PricingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    securityDeposit: (
      parent: T["PricingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number | null;
    smartPricing: (
      parent: T["PricingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    weekendPricing: (
      parent: T["PricingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number | null;
    weeklyDiscount: (
      parent: T["PricingParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number | null;
  }
}

export namespace PlaceViewsResolvers {
  export type IdType<T extends ITypeMap> = (
    parent: T["PlaceViewsParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type LastWeekType<T extends ITypeMap> = (
    parent: T["PlaceViewsParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export interface Type<T extends ITypeMap> {
    id: (
      parent: T["PlaceViewsParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    lastWeek: (
      parent: T["PlaceViewsParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
  }
}

export namespace GuestRequirementsResolvers {
  export type GovIssuedIdType<T extends ITypeMap> = (
    parent: T["GuestRequirementsParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type GuestTripInformationType<T extends ITypeMap> = (
    parent: T["GuestRequirementsParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type IdType<T extends ITypeMap> = (
    parent: T["GuestRequirementsParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type RecommendationsFromOtherHostsType<T extends ITypeMap> = (
    parent: T["GuestRequirementsParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export interface Type<T extends ITypeMap> {
    govIssuedId: (
      parent: T["GuestRequirementsParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    guestTripInformation: (
      parent: T["GuestRequirementsParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    id: (
      parent: T["GuestRequirementsParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    recommendationsFromOtherHosts: (
      parent: T["GuestRequirementsParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
  }
}

export namespace PoliciesResolvers {
  export type CheckInEndTimeType<T extends ITypeMap> = (
    parent: T["PoliciesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type CheckInStartTimeType<T extends ITypeMap> = (
    parent: T["PoliciesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type CheckoutTimeType<T extends ITypeMap> = (
    parent: T["PoliciesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => number;

  export type CreatedAtType<T extends ITypeMap> = (
    parent: T["PoliciesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type IdType<T extends ITypeMap> = (
    parent: T["PoliciesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type UpdatedAtType<T extends ITypeMap> = (
    parent: T["PoliciesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export interface Type<T extends ITypeMap> {
    checkInEndTime: (
      parent: T["PoliciesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    checkInStartTime: (
      parent: T["PoliciesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    checkoutTime: (
      parent: T["PoliciesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => number;
    createdAt: (
      parent: T["PoliciesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    id: (
      parent: T["PoliciesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    updatedAt: (
      parent: T["PoliciesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
  }
}

export namespace HouseRulesResolvers {
  export type AdditionalRulesType<T extends ITypeMap> = (
    parent: T["HouseRulesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string | null;

  export type CreatedAtType<T extends ITypeMap> = (
    parent: T["HouseRulesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type IdType<T extends ITypeMap> = (
    parent: T["HouseRulesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type PartiesAndEventsAllowedType<T extends ITypeMap> = (
    parent: T["HouseRulesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean | null;

  export type PetsAllowedType<T extends ITypeMap> = (
    parent: T["HouseRulesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean | null;

  export type SmokingAllowedType<T extends ITypeMap> = (
    parent: T["HouseRulesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean | null;

  export type SuitableForChildrenType<T extends ITypeMap> = (
    parent: T["HouseRulesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean | null;

  export type SuitableForInfantsType<T extends ITypeMap> = (
    parent: T["HouseRulesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean | null;

  export type UpdatedAtType<T extends ITypeMap> = (
    parent: T["HouseRulesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export interface Type<T extends ITypeMap> {
    additionalRules: (
      parent: T["HouseRulesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string | null;
    createdAt: (
      parent: T["HouseRulesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    id: (
      parent: T["HouseRulesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    partiesAndEventsAllowed: (
      parent: T["HouseRulesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean | null;
    petsAllowed: (
      parent: T["HouseRulesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean | null;
    smokingAllowed: (
      parent: T["HouseRulesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean | null;
    suitableForChildren: (
      parent: T["HouseRulesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean | null;
    suitableForInfants: (
      parent: T["HouseRulesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean | null;
    updatedAt: (
      parent: T["HouseRulesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
  }
}

export namespace AmenitiesResolvers {
  export type AirConditioningType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type BabyBathType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type BabyMonitorType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type BabysitterRecommendationsType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type BathtubType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type BreakfastType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type BuzzerWirelessIntercomType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type CableTvType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type ChangingTableType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type ChildrensBooksAndToysType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type ChildrensDinnerwareType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type CribType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type DoormanType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type DryerType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type ElevatorType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type EssentialsType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type FamilyKidFriendlyType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type FreeParkingOnPremisesType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type FreeParkingOnStreetType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type GymType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type HairDryerType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type HangersType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type HeatingType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type HotTubType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type IdType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => string;

  export type IndoorFireplaceType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type InternetType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type IronType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type KitchenType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type LaptopFriendlyWorkspaceType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type PaidParkingOffPremisesType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type PetsAllowedType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type PoolType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type PrivateEntranceType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type ShampooType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type SmokingAllowedType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type SuitableForEventsType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type TvType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type WasherType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type WheelchairAccessibleType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export type WirelessInternetType<T extends ITypeMap> = (
    parent: T["AmenitiesParent"],
    args: {},
    ctx: T["Context"],
    info: GraphQLResolveInfo
  ) => boolean;

  export interface Type<T extends ITypeMap> {
    airConditioning: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    babyBath: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    babyMonitor: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    babysitterRecommendations: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    bathtub: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    breakfast: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    buzzerWirelessIntercom: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    cableTv: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    changingTable: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    childrensBooksAndToys: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    childrensDinnerware: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    crib: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    doorman: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    dryer: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    elevator: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    essentials: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    familyKidFriendly: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    freeParkingOnPremises: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    freeParkingOnStreet: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    gym: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    hairDryer: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    hangers: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    heating: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    hotTub: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    id: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => string;
    indoorFireplace: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    internet: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    iron: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    kitchen: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    laptopFriendlyWorkspace: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    paidParkingOffPremises: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    petsAllowed: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    pool: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    privateEntrance: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    shampoo: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    smokingAllowed: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    suitableForEvents: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    tv: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    washer: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    wheelchairAccessible: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
    wirelessInternet: (
      parent: T["AmenitiesParent"],
      args: {},
      ctx: T["Context"],
      info: GraphQLResolveInfo
    ) => boolean;
  }
}

export interface IResolvers<T extends ITypeMap> {
  Query: QueryResolvers.Type<T>;
  Mutation: MutationResolvers.Type<T>;
  Viewer: ViewerResolvers.Type<T>;
  AuthPayload: AuthPayloadResolvers.Type<T>;
  MutationResult: MutationResultResolvers.Type<T>;
  ExperiencesByCity: ExperiencesByCityResolvers.Type<T>;
  Home: HomeResolvers.Type<T>;
  Reservation: ReservationResolvers.Type<T>;
  Experience: ExperienceResolvers.Type<T>;
  Review: ReviewResolvers.Type<T>;
  Neighbourhood: NeighbourhoodResolvers.Type<T>;
  Location: LocationResolvers.Type<T>;
  Picture: PictureResolvers.Type<T>;
  City: CityResolvers.Type<T>;
  ExperienceCategory: ExperienceCategoryResolvers.Type<T>;
  User: UserResolvers.Type<T>;
  PaymentAccount: PaymentAccountResolvers.Type<T>;
  Place: PlaceResolvers.Type<T>;
  Booking: BookingResolvers.Type<T>;
  Notification: NotificationResolvers.Type<T>;
  Payment: PaymentResolvers.Type<T>;
  PaypalInformation: PaypalInformationResolvers.Type<T>;
  CreditCardInformation: CreditCardInformationResolvers.Type<T>;
  Message: MessageResolvers.Type<T>;
  Pricing: PricingResolvers.Type<T>;
  PlaceViews: PlaceViewsResolvers.Type<T>;
  GuestRequirements: GuestRequirementsResolvers.Type<T>;
  Policies: PoliciesResolvers.Type<T>;
  HouseRules: HouseRulesResolvers.Type<T>;
  Amenities: AmenitiesResolvers.Type<T>;
}
