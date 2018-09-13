import { IReview } from "../generated/resolvers";
import { Types } from "./typemap";

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

export const Review: IReview.Resolver<Types> = {
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
