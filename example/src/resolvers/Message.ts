import { IMessage } from "../generated/resolvers";
import { Types } from "./typemap";

export interface MessageParent {
  createdAt: string;
  deliveredAt: string;
  id: string;
  readAt: string;
}

export const Message: IMessage.Resolver<Types> = {
  createdAt: parent => parent.createdAt,
  deliveredAt: parent => parent.deliveredAt,
  id: parent => parent.id,
  readAt: parent => parent.readAt
};
