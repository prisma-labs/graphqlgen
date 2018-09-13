import { IUser } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";
import { BookingParent } from "./Booking";
import { ExperienceParent } from "./Experience";
import { LocationParent } from "./Location";
import { NotificationParent } from "./Notification";
import { PlaceParent } from "./Place";
import { PaymentAccountParent } from "./PaymentAccount";
import { PictureParent } from "./Picture";
import { MessageParent } from "./Message";

export interface UserParent {
  bookings: BookingParent[];
  createdAt: string;
  email: string;
  firstName: string;
  hostingExperiences: ExperienceParent[];
  id: string;
  isSuperHost: boolean;
  lastName: string;
  location: LocationParent;
  notifications: NotificationParent[];
  ownedPlaces: PlaceParent[];
  paymentAccount: PaymentAccountParent[];
  phone: string;
  profilePicture?: PictureParent;
  receivedMessages: MessageParent[];
  responseRate?: number;
  responseTime?: number;
  sentMessages: MessageParent[];
  updatedAt: string;
  token: string;
}

export const User: IUser.Resolver<TypeMap> = {
  bookings: parent => parent.bookings,
  createdAt: parent => parent.createdAt,
  email: parent => parent.email,
  firstName: parent => parent.firstName,
  hostingExperiences: parent => parent.hostingExperiences,
  id: parent => parent.id,
  isSuperHost: parent => parent.isSuperHost,
  lastName: parent => parent.lastName,
  location: parent => parent.location,
  notifications: parent => parent.notifications,
  ownedPlaces: parent => parent.ownedPlaces,
  paymentAccount: parent => parent.paymentAccount,
  phone: parent => parent.phone,
  profilePicture: parent => parent.profilePicture,
  receivedMessages: parent => parent.receivedMessages,
  responseRate: parent => parent.responseRate,
  responseTime: parent => parent.responseTime,
  sentMessages: parent => parent.sentMessages,
  updatedAt: parent => parent.updatedAt,
  token: parent => parent.token
};
