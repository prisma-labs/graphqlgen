import { INotification } from "../generated/resolvers";
import { Types } from "./types/typemap";
import { UserParent } from "./User";

export type NOTIFICATION_TYPE =
  | "OFFER"
  | "INSTANT_BOOK"
  | "RESPONSIVENESS"
  | "NEW_AMENITIES"
  | "HOUSE_RULES";

export interface NotificationParent {
  createdAt: string;
  id: string;
  link: string;
  readDate: string;
  type?: NOTIFICATION_TYPE;
  user: UserParent;
}

export const Notification: INotification.Resolver<Types> = {
  createdAt: parent => parent.createdAt,
  id: parent => parent.id,
  link: parent => parent.link,
  readDate: parent => parent.readDate,
  type: parent => parent.type,
  user: parent => parent.user
};
