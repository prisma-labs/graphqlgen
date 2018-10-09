import { ReviewResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";

export interface ReviewParent {
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

export const Review: ReviewResolvers.Type<TypeMap> = {
  accuracy: parent => parent.accuracy,
  checkIn: parent => parent.checkIn,
  cleanliness: parent => parent.cleanliness,
  communication: parent => parent.communication,
  createdAt: parent => parent.createdAt,
  id: parent => parent.id,
  location: parent => parent.location,
  stars: parent => parent.stars,
  text: parent => parent.text,
  value: parent => parent.value
};
