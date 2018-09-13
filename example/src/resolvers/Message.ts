import { MessageResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";

export interface MessageParent {
  createdAt: string;
  deliveredAt: string;
  id: string;
  readAt: string;
}

export const Message: MessageResolvers.Type<TypeMap> = {
  createdAt: parent => parent.createdAt,
  deliveredAt: parent => parent.deliveredAt,
  id: parent => parent.id,
  readAt: parent => parent.readAt
};
