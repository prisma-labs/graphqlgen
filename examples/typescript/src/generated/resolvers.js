/**
 * @flow
 */
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

declare module "QueryResolvers" {
  // Type for GraphQL type
  declare type TopExperiencesType<T> = (
    parent: $PropertyType<T & ITypeMap, "QueryParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "ExperienceParent">[];

  // Type for GraphQL type
  declare type TopHomesType<T> = (
    parent: $PropertyType<T & ITypeMap, "QueryParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "HomeParent">[];

  // Type for argument
  declare type ArgsHomesInPriceRange = {
    min: number,
    max: number
  };

  // Type for GraphQL type
  declare type HomesInPriceRangeType<T> = (
    parent: $PropertyType<T & ITypeMap, "QueryParent">,
    args: ArgsHomesInPriceRange,
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "HomeParent">[];

  // Type for GraphQL type
  declare type TopReservationsType<T> = (
    parent: $PropertyType<T & ITypeMap, "QueryParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "ReservationParent">[];

  // Type for GraphQL type
  declare type FeaturedDestinationsType<T> = (
    parent: $PropertyType<T & ITypeMap, "QueryParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "NeighbourhoodParent">[];

  // Type for argument
  declare type ArgsExperiencesByCity = {
    cities: string[]
  };

  // Type for GraphQL type
  declare type ExperiencesByCityType<T> = (
    parent: $PropertyType<T & ITypeMap, "QueryParent">,
    args: ArgsExperiencesByCity,
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "ExperiencesByCityParent">[];

  // Type for GraphQL type
  declare type ViewerType<T> = (
    parent: $PropertyType<T & ITypeMap, "QueryParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "ViewerParent"> | null;

  // Type for GraphQL type
  declare type MyLocationType<T> = (
    parent: $PropertyType<T & ITypeMap, "QueryParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "LocationParent"> | null;

  declare type Type = {
    topExperiences: TopExperiencesType,
    topHomes: TopHomesType,
    homesInPriceRange: HomesInPriceRangeType,
    topReservations: TopReservationsType,
    featuredDestinations: FeaturedDestinationsType,
    experiencesByCity: ExperiencesByCityType,
    viewer: ViewerType,
    myLocation: MyLocationType
  };

  declare module.exports: {
    topExperiences: TopExperiencesType,
    topHomes: TopHomesType,
    homesInPriceRange: HomesInPriceRangeType,
    topReservations: TopReservationsType,
    featuredDestinations: FeaturedDestinationsType,
    experiencesByCity: ExperiencesByCityType,
    viewer: ViewerType,
    myLocation: MyLocationType
  };
}

declare module "MutationResolvers" {
  // Type for argument
  declare type ArgsSignup = {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string
  };

  // Type for GraphQL type
  declare type SignupType<T> = (
    parent: $PropertyType<T & ITypeMap, "MutationParent">,
    args: ArgsSignup,
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "AuthPayloadParent">;

  // Type for argument
  declare type ArgsLogin = {
    email: string,
    password: string
  };

  // Type for GraphQL type
  declare type LoginType<T> = (
    parent: $PropertyType<T & ITypeMap, "MutationParent">,
    args: ArgsLogin,
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "AuthPayloadParent">;

  // Type for argument
  declare type ArgsAddPaymentMethod = {
    cardNumber: string,
    expiresOnMonth: number,
    expiresOnYear: number,
    securityCode: string,
    firstName: string,
    lastName: string,
    postalCode: string,
    country: string
  };

  // Type for GraphQL type
  declare type AddPaymentMethodType<T> = (
    parent: $PropertyType<T & ITypeMap, "MutationParent">,
    args: ArgsAddPaymentMethod,
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "MutationResultParent">;

  // Type for argument
  declare type ArgsBook = {
    placeId: string,
    checkIn: string,
    checkOut: string,
    numGuests: number
  };

  // Type for GraphQL type
  declare type BookType<T> = (
    parent: $PropertyType<T & ITypeMap, "MutationParent">,
    args: ArgsBook,
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "MutationResultParent">;

  declare type Type = {
    signup: SignupType,
    login: LoginType,
    addPaymentMethod: AddPaymentMethodType,
    book: BookType
  };

  declare module.exports: {
    signup: SignupType,
    login: LoginType,
    addPaymentMethod: AddPaymentMethodType,
    book: BookType
  };
}

declare module "ViewerResolvers" {
  // Type for GraphQL type
  declare type MeType<T> = (
    parent: $PropertyType<T & ITypeMap, "ViewerParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "UserParent">;

  // Type for GraphQL type
  declare type BookingsType<T> = (
    parent: $PropertyType<T & ITypeMap, "ViewerParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "BookingParent">[];

  declare type Type = {
    me: MeType,
    bookings: BookingsType
  };

  declare module.exports: {
    me: MeType,
    bookings: BookingsType
  };
}

declare module "AuthPayloadResolvers" {
  // Type for GraphQL type
  declare type TokenType<T> = (
    parent: $PropertyType<T & ITypeMap, "AuthPayloadParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type UserType<T> = (
    parent: $PropertyType<T & ITypeMap, "AuthPayloadParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "UserParent">;

  declare type Type = {
    token: TokenType,
    user: UserType
  };

  declare module.exports: {
    token: TokenType,
    user: UserType
  };
}

declare module "MutationResultResolvers" {
  // Type for GraphQL type
  declare type SuccessType<T> = (
    parent: $PropertyType<T & ITypeMap, "MutationResultParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  declare type Type = {
    success: SuccessType
  };

  declare module.exports: {
    success: SuccessType
  };
}

declare module "ExperiencesByCityResolvers" {
  // Type for GraphQL type
  declare type ExperiencesType<T> = (
    parent: $PropertyType<T & ITypeMap, "ExperiencesByCityParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "ExperienceParent">[];

  // Type for GraphQL type
  declare type CityType<T> = (
    parent: $PropertyType<T & ITypeMap, "ExperiencesByCityParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "CityParent">;

  declare type Type = {
    experiences: ExperiencesType,
    city: CityType
  };

  declare module.exports: {
    experiences: ExperiencesType,
    city: CityType
  };
}

declare module "HomeResolvers" {
  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "HomeParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type NameType<T> = (
    parent: $PropertyType<T & ITypeMap, "HomeParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string | null;

  // Type for GraphQL type
  declare type DescriptionType<T> = (
    parent: $PropertyType<T & ITypeMap, "HomeParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type NumRatingsType<T> = (
    parent: $PropertyType<T & ITypeMap, "HomeParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type AvgRatingType<T> = (
    parent: $PropertyType<T & ITypeMap, "HomeParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number | null;

  // Type for argument
  declare type ArgsPictures = {
    first: number | null
  };

  // Type for GraphQL type
  declare type PicturesType<T> = (
    parent: $PropertyType<T & ITypeMap, "HomeParent">,
    args: ArgsPictures,
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PictureParent">[];

  // Type for GraphQL type
  declare type PerNightType<T> = (
    parent: $PropertyType<T & ITypeMap, "HomeParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  declare type Type = {
    id: IdType,
    name: NameType,
    description: DescriptionType,
    numRatings: NumRatingsType,
    avgRating: AvgRatingType,
    pictures: PicturesType,
    perNight: PerNightType
  };

  declare module.exports: {
    id: IdType,
    name: NameType,
    description: DescriptionType,
    numRatings: NumRatingsType,
    avgRating: AvgRatingType,
    pictures: PicturesType,
    perNight: PerNightType
  };
}

declare module "ReservationResolvers" {
  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReservationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type TitleType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReservationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type AvgPricePerPersonType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReservationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type PicturesType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReservationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PictureParent">[];

  // Type for GraphQL type
  declare type LocationType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReservationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "LocationParent">;

  // Type for GraphQL type
  declare type IsCuratedType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReservationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type SlugType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReservationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type PopularityType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReservationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  declare type Type = {
    id: IdType,
    title: TitleType,
    avgPricePerPerson: AvgPricePerPersonType,
    pictures: PicturesType,
    location: LocationType,
    isCurated: IsCuratedType,
    slug: SlugType,
    popularity: PopularityType
  };

  declare module.exports: {
    id: IdType,
    title: TitleType,
    avgPricePerPerson: AvgPricePerPersonType,
    pictures: PicturesType,
    location: LocationType,
    isCurated: IsCuratedType,
    slug: SlugType,
    popularity: PopularityType
  };
}

declare module "ExperienceResolvers" {
  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "ExperienceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type CategoryType<T> = (
    parent: $PropertyType<T & ITypeMap, "ExperienceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "ExperienceCategoryParent"> | null;

  // Type for GraphQL type
  declare type TitleType<T> = (
    parent: $PropertyType<T & ITypeMap, "ExperienceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type LocationType<T> = (
    parent: $PropertyType<T & ITypeMap, "ExperienceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "LocationParent">;

  // Type for GraphQL type
  declare type PricePerPersonType<T> = (
    parent: $PropertyType<T & ITypeMap, "ExperienceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type ReviewsType<T> = (
    parent: $PropertyType<T & ITypeMap, "ExperienceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "ReviewParent">[];

  // Type for GraphQL type
  declare type PreviewType<T> = (
    parent: $PropertyType<T & ITypeMap, "ExperienceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PictureParent">;

  // Type for GraphQL type
  declare type PopularityType<T> = (
    parent: $PropertyType<T & ITypeMap, "ExperienceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  declare type Type = {
    id: IdType,
    category: CategoryType,
    title: TitleType,
    location: LocationType,
    pricePerPerson: PricePerPersonType,
    reviews: ReviewsType,
    preview: PreviewType,
    popularity: PopularityType
  };

  declare module.exports: {
    id: IdType,
    category: CategoryType,
    title: TitleType,
    location: LocationType,
    pricePerPerson: PricePerPersonType,
    reviews: ReviewsType,
    preview: PreviewType,
    popularity: PopularityType
  };
}

declare module "ReviewResolvers" {
  // Type for GraphQL type
  declare type AccuracyType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReviewParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type CheckInType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReviewParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type CleanlinessType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReviewParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type CommunicationType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReviewParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type CreatedAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReviewParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReviewParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type LocationType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReviewParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type StarsType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReviewParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type TextType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReviewParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type ValueType<T> = (
    parent: $PropertyType<T & ITypeMap, "ReviewParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  declare type Type = {
    accuracy: AccuracyType,
    checkIn: CheckInType,
    cleanliness: CleanlinessType,
    communication: CommunicationType,
    createdAt: CreatedAtType,
    id: IdType,
    location: LocationType,
    stars: StarsType,
    text: TextType,
    value: ValueType
  };

  declare module.exports: {
    accuracy: AccuracyType,
    checkIn: CheckInType,
    cleanliness: CleanlinessType,
    communication: CommunicationType,
    createdAt: CreatedAtType,
    id: IdType,
    location: LocationType,
    stars: StarsType,
    text: TextType,
    value: ValueType
  };
}

declare module "NeighbourhoodResolvers" {
  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "NeighbourhoodParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type NameType<T> = (
    parent: $PropertyType<T & ITypeMap, "NeighbourhoodParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type SlugType<T> = (
    parent: $PropertyType<T & ITypeMap, "NeighbourhoodParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type HomePreviewType<T> = (
    parent: $PropertyType<T & ITypeMap, "NeighbourhoodParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PictureParent"> | null;

  // Type for GraphQL type
  declare type CityType<T> = (
    parent: $PropertyType<T & ITypeMap, "NeighbourhoodParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "CityParent">;

  // Type for GraphQL type
  declare type FeaturedType<T> = (
    parent: $PropertyType<T & ITypeMap, "NeighbourhoodParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type PopularityType<T> = (
    parent: $PropertyType<T & ITypeMap, "NeighbourhoodParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  declare type Type = {
    id: IdType,
    name: NameType,
    slug: SlugType,
    homePreview: HomePreviewType,
    city: CityType,
    featured: FeaturedType,
    popularity: PopularityType
  };

  declare module.exports: {
    id: IdType,
    name: NameType,
    slug: SlugType,
    homePreview: HomePreviewType,
    city: CityType,
    featured: FeaturedType,
    popularity: PopularityType
  };
}

declare module "LocationResolvers" {
  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "LocationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type LatType<T> = (
    parent: $PropertyType<T & ITypeMap, "LocationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type LngType<T> = (
    parent: $PropertyType<T & ITypeMap, "LocationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type AddressType<T> = (
    parent: $PropertyType<T & ITypeMap, "LocationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string | null;

  // Type for GraphQL type
  declare type DirectionsType<T> = (
    parent: $PropertyType<T & ITypeMap, "LocationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string | null;

  declare type Type = {
    id: IdType,
    lat: LatType,
    lng: LngType,
    address: AddressType,
    directions: DirectionsType
  };

  declare module.exports: {
    id: IdType,
    lat: LatType,
    lng: LngType,
    address: AddressType,
    directions: DirectionsType
  };
}

declare module "PictureResolvers" {
  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "PictureParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type UrlType<T> = (
    parent: $PropertyType<T & ITypeMap, "PictureParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  declare type Type = {
    id: IdType,
    url: UrlType
  };

  declare module.exports: {
    id: IdType,
    url: UrlType
  };
}

declare module "CityResolvers" {
  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "CityParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type NameType<T> = (
    parent: $PropertyType<T & ITypeMap, "CityParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  declare type Type = {
    id: IdType,
    name: NameType
  };

  declare module.exports: {
    id: IdType,
    name: NameType
  };
}

declare module "ExperienceCategoryResolvers" {
  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "ExperienceCategoryParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type MainColorType<T> = (
    parent: $PropertyType<T & ITypeMap, "ExperienceCategoryParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type NameType<T> = (
    parent: $PropertyType<T & ITypeMap, "ExperienceCategoryParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type ExperienceType<T> = (
    parent: $PropertyType<T & ITypeMap, "ExperienceCategoryParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "ExperienceParent"> | null;

  declare type Type = {
    id: IdType,
    mainColor: MainColorType,
    name: NameType,
    experience: ExperienceType
  };

  declare module.exports: {
    id: IdType,
    mainColor: MainColorType,
    name: NameType,
    experience: ExperienceType
  };
}

declare module "UserResolvers" {
  // Type for GraphQL type
  declare type BookingsType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "BookingParent">[];

  // Type for GraphQL type
  declare type CreatedAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type EmailType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type FirstNameType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type HostingExperiencesType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "ExperienceParent">[];

  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type IsSuperHostType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type LastNameType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type LocationType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "LocationParent">;

  // Type for GraphQL type
  declare type NotificationsType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "NotificationParent">[];

  // Type for GraphQL type
  declare type OwnedPlacesType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PlaceParent">[];

  // Type for GraphQL type
  declare type PaymentAccountType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PaymentAccountParent">[];

  // Type for GraphQL type
  declare type PhoneType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type ProfilePictureType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PictureParent"> | null;

  // Type for GraphQL type
  declare type ReceivedMessagesType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "MessageParent">[];

  // Type for GraphQL type
  declare type ResponseRateType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number | null;

  // Type for GraphQL type
  declare type ResponseTimeType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number | null;

  // Type for GraphQL type
  declare type SentMessagesType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "MessageParent">[];

  // Type for GraphQL type
  declare type UpdatedAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type TokenType<T> = (
    parent: $PropertyType<T & ITypeMap, "UserParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  declare type Type = {
    bookings: BookingsType,
    createdAt: CreatedAtType,
    email: EmailType,
    firstName: FirstNameType,
    hostingExperiences: HostingExperiencesType,
    id: IdType,
    isSuperHost: IsSuperHostType,
    lastName: LastNameType,
    location: LocationType,
    notifications: NotificationsType,
    ownedPlaces: OwnedPlacesType,
    paymentAccount: PaymentAccountType,
    phone: PhoneType,
    profilePicture: ProfilePictureType,
    receivedMessages: ReceivedMessagesType,
    responseRate: ResponseRateType,
    responseTime: ResponseTimeType,
    sentMessages: SentMessagesType,
    updatedAt: UpdatedAtType,
    token: TokenType
  };

  declare module.exports: {
    bookings: BookingsType,
    createdAt: CreatedAtType,
    email: EmailType,
    firstName: FirstNameType,
    hostingExperiences: HostingExperiencesType,
    id: IdType,
    isSuperHost: IsSuperHostType,
    lastName: LastNameType,
    location: LocationType,
    notifications: NotificationsType,
    ownedPlaces: OwnedPlacesType,
    paymentAccount: PaymentAccountType,
    phone: PhoneType,
    profilePicture: ProfilePictureType,
    receivedMessages: ReceivedMessagesType,
    responseRate: ResponseRateType,
    responseTime: ResponseTimeType,
    sentMessages: SentMessagesType,
    updatedAt: UpdatedAtType,
    token: TokenType
  };
}

declare module "PaymentAccountResolvers" {
  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaymentAccountParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type CreatedAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaymentAccountParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type TypeType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaymentAccountParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PAYMENT_PROVIDER"> | null;

  // Type for GraphQL type
  declare type UserType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaymentAccountParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "UserParent">;

  // Type for GraphQL type
  declare type PaymentsType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaymentAccountParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PaymentParent">[];

  // Type for GraphQL type
  declare type PaypalType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaymentAccountParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PaypalInformationParent"> | null;

  // Type for GraphQL type
  declare type CreditcardType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaymentAccountParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "CreditCardInformationParent"> | null;

  declare type Type = {
    id: IdType,
    createdAt: CreatedAtType,
    type: TypeType,
    user: UserType,
    payments: PaymentsType,
    paypal: PaypalType,
    creditcard: CreditcardType
  };

  declare module.exports: {
    id: IdType,
    createdAt: CreatedAtType,
    type: TypeType,
    user: UserType,
    payments: PaymentsType,
    paypal: PaypalType,
    creditcard: CreditcardType
  };
}

declare module "PlaceResolvers" {
  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type NameType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string | null;

  // Type for GraphQL type
  declare type SizeType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PLACE_SIZES"> | null;

  // Type for GraphQL type
  declare type ShortDescriptionType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type DescriptionType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type SlugType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type MaxGuestsType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type NumBedroomsType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type NumBedsType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type NumBathsType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type ReviewsType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "ReviewParent">[];

  // Type for GraphQL type
  declare type AmenitiesType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "AmenitiesParent">;

  // Type for GraphQL type
  declare type HostType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "UserParent">;

  // Type for GraphQL type
  declare type PricingType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PricingParent">;

  // Type for GraphQL type
  declare type LocationType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "LocationParent">;

  // Type for GraphQL type
  declare type ViewsType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PlaceViewsParent">;

  // Type for GraphQL type
  declare type GuestRequirementsType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "GuestRequirementsParent"> | null;

  // Type for GraphQL type
  declare type PoliciesType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PoliciesParent"> | null;

  // Type for GraphQL type
  declare type HouseRulesType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "HouseRulesParent"> | null;

  // Type for GraphQL type
  declare type BookingsType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "BookingParent">[];

  // Type for GraphQL type
  declare type PicturesType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PictureParent">[];

  // Type for GraphQL type
  declare type PopularityType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  declare type Type = {
    id: IdType,
    name: NameType,
    size: SizeType,
    shortDescription: ShortDescriptionType,
    description: DescriptionType,
    slug: SlugType,
    maxGuests: MaxGuestsType,
    numBedrooms: NumBedroomsType,
    numBeds: NumBedsType,
    numBaths: NumBathsType,
    reviews: ReviewsType,
    amenities: AmenitiesType,
    host: HostType,
    pricing: PricingType,
    location: LocationType,
    views: ViewsType,
    guestRequirements: GuestRequirementsType,
    policies: PoliciesType,
    houseRules: HouseRulesType,
    bookings: BookingsType,
    pictures: PicturesType,
    popularity: PopularityType
  };

  declare module.exports: {
    id: IdType,
    name: NameType,
    size: SizeType,
    shortDescription: ShortDescriptionType,
    description: DescriptionType,
    slug: SlugType,
    maxGuests: MaxGuestsType,
    numBedrooms: NumBedroomsType,
    numBeds: NumBedsType,
    numBaths: NumBathsType,
    reviews: ReviewsType,
    amenities: AmenitiesType,
    host: HostType,
    pricing: PricingType,
    location: LocationType,
    views: ViewsType,
    guestRequirements: GuestRequirementsType,
    policies: PoliciesType,
    houseRules: HouseRulesType,
    bookings: BookingsType,
    pictures: PicturesType,
    popularity: PopularityType
  };
}

declare module "BookingResolvers" {
  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "BookingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type CreatedAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "BookingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type BookeeType<T> = (
    parent: $PropertyType<T & ITypeMap, "BookingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "UserParent">;

  // Type for GraphQL type
  declare type PlaceType<T> = (
    parent: $PropertyType<T & ITypeMap, "BookingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PlaceParent">;

  // Type for GraphQL type
  declare type StartDateType<T> = (
    parent: $PropertyType<T & ITypeMap, "BookingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type EndDateType<T> = (
    parent: $PropertyType<T & ITypeMap, "BookingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type PaymentType<T> = (
    parent: $PropertyType<T & ITypeMap, "BookingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PaymentParent">;

  declare type Type = {
    id: IdType,
    createdAt: CreatedAtType,
    bookee: BookeeType,
    place: PlaceType,
    startDate: StartDateType,
    endDate: EndDateType,
    payment: PaymentType
  };

  declare module.exports: {
    id: IdType,
    createdAt: CreatedAtType,
    bookee: BookeeType,
    place: PlaceType,
    startDate: StartDateType,
    endDate: EndDateType,
    payment: PaymentType
  };
}

declare module "NotificationResolvers" {
  // Type for GraphQL type
  declare type CreatedAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "NotificationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "NotificationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type LinkType<T> = (
    parent: $PropertyType<T & ITypeMap, "NotificationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type ReadDateType<T> = (
    parent: $PropertyType<T & ITypeMap, "NotificationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type TypeType<T> = (
    parent: $PropertyType<T & ITypeMap, "NotificationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "NOTIFICATION_TYPE"> | null;

  // Type for GraphQL type
  declare type UserType<T> = (
    parent: $PropertyType<T & ITypeMap, "NotificationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "UserParent">;

  declare type Type = {
    createdAt: CreatedAtType,
    id: IdType,
    link: LinkType,
    readDate: ReadDateType,
    type: TypeType,
    user: UserType
  };

  declare module.exports: {
    createdAt: CreatedAtType,
    id: IdType,
    link: LinkType,
    readDate: ReadDateType,
    type: TypeType,
    user: UserType
  };
}

declare module "PaymentResolvers" {
  // Type for GraphQL type
  declare type BookingType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaymentParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "BookingParent">;

  // Type for GraphQL type
  declare type CreatedAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaymentParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaymentParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type PaymentMethodType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaymentParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PaymentAccountParent">;

  // Type for GraphQL type
  declare type ServiceFeeType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaymentParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  declare type Type = {
    booking: BookingType,
    createdAt: CreatedAtType,
    id: IdType,
    paymentMethod: PaymentMethodType,
    serviceFee: ServiceFeeType
  };

  declare module.exports: {
    booking: BookingType,
    createdAt: CreatedAtType,
    id: IdType,
    paymentMethod: PaymentMethodType,
    serviceFee: ServiceFeeType
  };
}

declare module "PaypalInformationResolvers" {
  // Type for GraphQL type
  declare type CreatedAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaypalInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type EmailType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaypalInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaypalInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type PaymentAccountType<T> = (
    parent: $PropertyType<T & ITypeMap, "PaypalInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PaymentAccountParent">;

  declare type Type = {
    createdAt: CreatedAtType,
    email: EmailType,
    id: IdType,
    paymentAccount: PaymentAccountType
  };

  declare module.exports: {
    createdAt: CreatedAtType,
    email: EmailType,
    id: IdType,
    paymentAccount: PaymentAccountType
  };
}

declare module "CreditCardInformationResolvers" {
  // Type for GraphQL type
  declare type CardNumberType<T> = (
    parent: $PropertyType<T & ITypeMap, "CreditCardInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type CountryType<T> = (
    parent: $PropertyType<T & ITypeMap, "CreditCardInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type CreatedAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "CreditCardInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type ExpiresOnMonthType<T> = (
    parent: $PropertyType<T & ITypeMap, "CreditCardInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type ExpiresOnYearType<T> = (
    parent: $PropertyType<T & ITypeMap, "CreditCardInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type FirstNameType<T> = (
    parent: $PropertyType<T & ITypeMap, "CreditCardInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "CreditCardInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type LastNameType<T> = (
    parent: $PropertyType<T & ITypeMap, "CreditCardInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type PaymentAccountType<T> = (
    parent: $PropertyType<T & ITypeMap, "CreditCardInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "PaymentAccountParent"> | null;

  // Type for GraphQL type
  declare type PostalCodeType<T> = (
    parent: $PropertyType<T & ITypeMap, "CreditCardInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type SecurityCodeType<T> = (
    parent: $PropertyType<T & ITypeMap, "CreditCardInformationParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  declare type Type = {
    cardNumber: CardNumberType,
    country: CountryType,
    createdAt: CreatedAtType,
    expiresOnMonth: ExpiresOnMonthType,
    expiresOnYear: ExpiresOnYearType,
    firstName: FirstNameType,
    id: IdType,
    lastName: LastNameType,
    paymentAccount: PaymentAccountType,
    postalCode: PostalCodeType,
    securityCode: SecurityCodeType
  };

  declare module.exports: {
    cardNumber: CardNumberType,
    country: CountryType,
    createdAt: CreatedAtType,
    expiresOnMonth: ExpiresOnMonthType,
    expiresOnYear: ExpiresOnYearType,
    firstName: FirstNameType,
    id: IdType,
    lastName: LastNameType,
    paymentAccount: PaymentAccountType,
    postalCode: PostalCodeType,
    securityCode: SecurityCodeType
  };
}

declare module "MessageResolvers" {
  // Type for GraphQL type
  declare type CreatedAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "MessageParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type DeliveredAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "MessageParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "MessageParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type ReadAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "MessageParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  declare type Type = {
    createdAt: CreatedAtType,
    deliveredAt: DeliveredAtType,
    id: IdType,
    readAt: ReadAtType
  };

  declare module.exports: {
    createdAt: CreatedAtType,
    deliveredAt: DeliveredAtType,
    id: IdType,
    readAt: ReadAtType
  };
}

declare module "PricingResolvers" {
  // Type for GraphQL type
  declare type AverageMonthlyType<T> = (
    parent: $PropertyType<T & ITypeMap, "PricingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type AverageWeeklyType<T> = (
    parent: $PropertyType<T & ITypeMap, "PricingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type BasePriceType<T> = (
    parent: $PropertyType<T & ITypeMap, "PricingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type CleaningFeeType<T> = (
    parent: $PropertyType<T & ITypeMap, "PricingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number | null;

  // Type for GraphQL type
  declare type CurrencyType<T> = (
    parent: $PropertyType<T & ITypeMap, "PricingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => $PropertyType<T & ITypeMap, "CURRENCY"> | null;

  // Type for GraphQL type
  declare type ExtraGuestsType<T> = (
    parent: $PropertyType<T & ITypeMap, "PricingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number | null;

  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "PricingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type MonthlyDiscountType<T> = (
    parent: $PropertyType<T & ITypeMap, "PricingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number | null;

  // Type for GraphQL type
  declare type PerNightType<T> = (
    parent: $PropertyType<T & ITypeMap, "PricingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type SecurityDepositType<T> = (
    parent: $PropertyType<T & ITypeMap, "PricingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number | null;

  // Type for GraphQL type
  declare type SmartPricingType<T> = (
    parent: $PropertyType<T & ITypeMap, "PricingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type WeekendPricingType<T> = (
    parent: $PropertyType<T & ITypeMap, "PricingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number | null;

  // Type for GraphQL type
  declare type WeeklyDiscountType<T> = (
    parent: $PropertyType<T & ITypeMap, "PricingParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number | null;

  declare type Type = {
    averageMonthly: AverageMonthlyType,
    averageWeekly: AverageWeeklyType,
    basePrice: BasePriceType,
    cleaningFee: CleaningFeeType,
    currency: CurrencyType,
    extraGuests: ExtraGuestsType,
    id: IdType,
    monthlyDiscount: MonthlyDiscountType,
    perNight: PerNightType,
    securityDeposit: SecurityDepositType,
    smartPricing: SmartPricingType,
    weekendPricing: WeekendPricingType,
    weeklyDiscount: WeeklyDiscountType
  };

  declare module.exports: {
    averageMonthly: AverageMonthlyType,
    averageWeekly: AverageWeeklyType,
    basePrice: BasePriceType,
    cleaningFee: CleaningFeeType,
    currency: CurrencyType,
    extraGuests: ExtraGuestsType,
    id: IdType,
    monthlyDiscount: MonthlyDiscountType,
    perNight: PerNightType,
    securityDeposit: SecurityDepositType,
    smartPricing: SmartPricingType,
    weekendPricing: WeekendPricingType,
    weeklyDiscount: WeeklyDiscountType
  };
}

declare module "PlaceViewsResolvers" {
  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceViewsParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type LastWeekType<T> = (
    parent: $PropertyType<T & ITypeMap, "PlaceViewsParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  declare type Type = {
    id: IdType,
    lastWeek: LastWeekType
  };

  declare module.exports: {
    id: IdType,
    lastWeek: LastWeekType
  };
}

declare module "GuestRequirementsResolvers" {
  // Type for GraphQL type
  declare type GovIssuedIdType<T> = (
    parent: $PropertyType<T & ITypeMap, "GuestRequirementsParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type GuestTripInformationType<T> = (
    parent: $PropertyType<T & ITypeMap, "GuestRequirementsParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "GuestRequirementsParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type RecommendationsFromOtherHostsType<T> = (
    parent: $PropertyType<T & ITypeMap, "GuestRequirementsParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  declare type Type = {
    govIssuedId: GovIssuedIdType,
    guestTripInformation: GuestTripInformationType,
    id: IdType,
    recommendationsFromOtherHosts: RecommendationsFromOtherHostsType
  };

  declare module.exports: {
    govIssuedId: GovIssuedIdType,
    guestTripInformation: GuestTripInformationType,
    id: IdType,
    recommendationsFromOtherHosts: RecommendationsFromOtherHostsType
  };
}

declare module "PoliciesResolvers" {
  // Type for GraphQL type
  declare type CheckInEndTimeType<T> = (
    parent: $PropertyType<T & ITypeMap, "PoliciesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type CheckInStartTimeType<T> = (
    parent: $PropertyType<T & ITypeMap, "PoliciesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type CheckoutTimeType<T> = (
    parent: $PropertyType<T & ITypeMap, "PoliciesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => number;

  // Type for GraphQL type
  declare type CreatedAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "PoliciesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "PoliciesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type UpdatedAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "PoliciesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  declare type Type = {
    checkInEndTime: CheckInEndTimeType,
    checkInStartTime: CheckInStartTimeType,
    checkoutTime: CheckoutTimeType,
    createdAt: CreatedAtType,
    id: IdType,
    updatedAt: UpdatedAtType
  };

  declare module.exports: {
    checkInEndTime: CheckInEndTimeType,
    checkInStartTime: CheckInStartTimeType,
    checkoutTime: CheckoutTimeType,
    createdAt: CreatedAtType,
    id: IdType,
    updatedAt: UpdatedAtType
  };
}

declare module "HouseRulesResolvers" {
  // Type for GraphQL type
  declare type AdditionalRulesType<T> = (
    parent: $PropertyType<T & ITypeMap, "HouseRulesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string | null;

  // Type for GraphQL type
  declare type CreatedAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "HouseRulesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "HouseRulesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type PartiesAndEventsAllowedType<T> = (
    parent: $PropertyType<T & ITypeMap, "HouseRulesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean | null;

  // Type for GraphQL type
  declare type PetsAllowedType<T> = (
    parent: $PropertyType<T & ITypeMap, "HouseRulesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean | null;

  // Type for GraphQL type
  declare type SmokingAllowedType<T> = (
    parent: $PropertyType<T & ITypeMap, "HouseRulesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean | null;

  // Type for GraphQL type
  declare type SuitableForChildrenType<T> = (
    parent: $PropertyType<T & ITypeMap, "HouseRulesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean | null;

  // Type for GraphQL type
  declare type SuitableForInfantsType<T> = (
    parent: $PropertyType<T & ITypeMap, "HouseRulesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean | null;

  // Type for GraphQL type
  declare type UpdatedAtType<T> = (
    parent: $PropertyType<T & ITypeMap, "HouseRulesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  declare type Type = {
    additionalRules: AdditionalRulesType,
    createdAt: CreatedAtType,
    id: IdType,
    partiesAndEventsAllowed: PartiesAndEventsAllowedType,
    petsAllowed: PetsAllowedType,
    smokingAllowed: SmokingAllowedType,
    suitableForChildren: SuitableForChildrenType,
    suitableForInfants: SuitableForInfantsType,
    updatedAt: UpdatedAtType
  };

  declare module.exports: {
    additionalRules: AdditionalRulesType,
    createdAt: CreatedAtType,
    id: IdType,
    partiesAndEventsAllowed: PartiesAndEventsAllowedType,
    petsAllowed: PetsAllowedType,
    smokingAllowed: SmokingAllowedType,
    suitableForChildren: SuitableForChildrenType,
    suitableForInfants: SuitableForInfantsType,
    updatedAt: UpdatedAtType
  };
}

declare module "AmenitiesResolvers" {
  // Type for GraphQL type
  declare type AirConditioningType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type BabyBathType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type BabyMonitorType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type BabysitterRecommendationsType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type BathtubType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type BreakfastType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type BuzzerWirelessIntercomType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type CableTvType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type ChangingTableType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type ChildrensBooksAndToysType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type ChildrensDinnerwareType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type CribType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type DoormanType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type DryerType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type ElevatorType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type EssentialsType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type FamilyKidFriendlyType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type FreeParkingOnPremisesType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type FreeParkingOnStreetType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type GymType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type HairDryerType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type HangersType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type HeatingType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type HotTubType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type IdType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => string;

  // Type for GraphQL type
  declare type IndoorFireplaceType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type InternetType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type IronType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type KitchenType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type LaptopFriendlyWorkspaceType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type PaidParkingOffPremisesType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type PetsAllowedType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type PoolType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type PrivateEntranceType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type ShampooType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type SmokingAllowedType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type SuitableForEventsType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type TvType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type WasherType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type WheelchairAccessibleType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  // Type for GraphQL type
  declare type WirelessInternetType<T> = (
    parent: $PropertyType<T & ITypeMap, "AmenitiesParent">,
    args: {},
    ctx: $PropertyType<T & ITypeMap, "Context">,
    info: GraphQLResolveInfo
  ) => boolean;

  declare type Type = {
    airConditioning: AirConditioningType,
    babyBath: BabyBathType,
    babyMonitor: BabyMonitorType,
    babysitterRecommendations: BabysitterRecommendationsType,
    bathtub: BathtubType,
    breakfast: BreakfastType,
    buzzerWirelessIntercom: BuzzerWirelessIntercomType,
    cableTv: CableTvType,
    changingTable: ChangingTableType,
    childrensBooksAndToys: ChildrensBooksAndToysType,
    childrensDinnerware: ChildrensDinnerwareType,
    crib: CribType,
    doorman: DoormanType,
    dryer: DryerType,
    elevator: ElevatorType,
    essentials: EssentialsType,
    familyKidFriendly: FamilyKidFriendlyType,
    freeParkingOnPremises: FreeParkingOnPremisesType,
    freeParkingOnStreet: FreeParkingOnStreetType,
    gym: GymType,
    hairDryer: HairDryerType,
    hangers: HangersType,
    heating: HeatingType,
    hotTub: HotTubType,
    id: IdType,
    indoorFireplace: IndoorFireplaceType,
    internet: InternetType,
    iron: IronType,
    kitchen: KitchenType,
    laptopFriendlyWorkspace: LaptopFriendlyWorkspaceType,
    paidParkingOffPremises: PaidParkingOffPremisesType,
    petsAllowed: PetsAllowedType,
    pool: PoolType,
    privateEntrance: PrivateEntranceType,
    shampoo: ShampooType,
    smokingAllowed: SmokingAllowedType,
    suitableForEvents: SuitableForEventsType,
    tv: TvType,
    washer: WasherType,
    wheelchairAccessible: WheelchairAccessibleType,
    wirelessInternet: WirelessInternetType
  };

  declare module.exports: {
    airConditioning: AirConditioningType,
    babyBath: BabyBathType,
    babyMonitor: BabyMonitorType,
    babysitterRecommendations: BabysitterRecommendationsType,
    bathtub: BathtubType,
    breakfast: BreakfastType,
    buzzerWirelessIntercom: BuzzerWirelessIntercomType,
    cableTv: CableTvType,
    changingTable: ChangingTableType,
    childrensBooksAndToys: ChildrensBooksAndToysType,
    childrensDinnerware: ChildrensDinnerwareType,
    crib: CribType,
    doorman: DoormanType,
    dryer: DryerType,
    elevator: ElevatorType,
    essentials: EssentialsType,
    familyKidFriendly: FamilyKidFriendlyType,
    freeParkingOnPremises: FreeParkingOnPremisesType,
    freeParkingOnStreet: FreeParkingOnStreetType,
    gym: GymType,
    hairDryer: HairDryerType,
    hangers: HangersType,
    heating: HeatingType,
    hotTub: HotTubType,
    id: IdType,
    indoorFireplace: IndoorFireplaceType,
    internet: InternetType,
    iron: IronType,
    kitchen: KitchenType,
    laptopFriendlyWorkspace: LaptopFriendlyWorkspaceType,
    paidParkingOffPremises: PaidParkingOffPremisesType,
    petsAllowed: PetsAllowedType,
    pool: PoolType,
    privateEntrance: PrivateEntranceType,
    shampoo: ShampooType,
    smokingAllowed: SmokingAllowedType,
    suitableForEvents: SuitableForEventsType,
    tv: TvType,
    washer: WasherType,
    wheelchairAccessible: WheelchairAccessibleType,
    wirelessInternet: WirelessInternetType
  };
}

declare type IResolvers<T> = {
  Query: QueryResolvers.Type<T & ITypeMap>,
  Mutation: MutationResolvers.Type<T & ITypeMap>,
  Viewer: ViewerResolvers.Type<T & ITypeMap>,
  AuthPayload: AuthPayloadResolvers.Type<T & ITypeMap>,
  MutationResult: MutationResultResolvers.Type<T & ITypeMap>,
  ExperiencesByCity: ExperiencesByCityResolvers.Type<T & ITypeMap>,
  Home: HomeResolvers.Type<T & ITypeMap>,
  Reservation: ReservationResolvers.Type<T & ITypeMap>,
  Experience: ExperienceResolvers.Type<T & ITypeMap>,
  Review: ReviewResolvers.Type<T & ITypeMap>,
  Neighbourhood: NeighbourhoodResolvers.Type<T & ITypeMap>,
  Location: LocationResolvers.Type<T & ITypeMap>,
  Picture: PictureResolvers.Type<T & ITypeMap>,
  City: CityResolvers.Type<T & ITypeMap>,
  ExperienceCategory: ExperienceCategoryResolvers.Type<T & ITypeMap>,
  User: UserResolvers.Type<T & ITypeMap>,
  PaymentAccount: PaymentAccountResolvers.Type<T & ITypeMap>,
  Place: PlaceResolvers.Type<T & ITypeMap>,
  Booking: BookingResolvers.Type<T & ITypeMap>,
  Notification: NotificationResolvers.Type<T & ITypeMap>,
  Payment: PaymentResolvers.Type<T & ITypeMap>,
  PaypalInformation: PaypalInformationResolvers.Type<T & ITypeMap>,
  CreditCardInformation: CreditCardInformationResolvers.Type<T & ITypeMap>,
  Message: MessageResolvers.Type<T & ITypeMap>,
  Pricing: PricingResolvers.Type<T & ITypeMap>,
  PlaceViews: PlaceViewsResolvers.Type<T & ITypeMap>,
  GuestRequirements: GuestRequirementsResolvers.Type<T & ITypeMap>,
  Policies: PoliciesResolvers.Type<T & ITypeMap>,
  HouseRules: HouseRulesResolvers.Type<T & ITypeMap>,
  Amenities: AmenitiesResolvers.Type<T & ITypeMap>
};
