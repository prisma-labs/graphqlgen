import { IViewer } from "../generated/resolvers";
import { Types } from "./typemap";
import { UserParent } from "./User";
import { BookingParent } from "./Booking";

export interface ViewerParent {
  me: UserParent;
  bookings: BookingParent[];
}

export const Viewer: IViewer.Resolver<Types> = {
  me: parent => parent.me,
  bookings: parent => parent.bookings
};
