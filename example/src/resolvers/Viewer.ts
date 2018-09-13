import { IViewer } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";
import { UserParent } from "./User";
import { BookingParent } from "./Booking";

export interface ViewerParent {
  me: UserParent;
  bookings: BookingParent[];
}

export const Viewer: IViewer.Resolver<TypeMap> = {
  me: parent => parent.me,
  bookings: parent => parent.bookings
};
