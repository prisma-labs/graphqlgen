import { IAuthPayload } from "../generated/resolvers";
import { Types } from "./types/typemap";
import { UserParent } from "./User";

export interface AuthPayloadParent {
  token: string;
  user: UserParent;
}

export const AuthPayload: IAuthPayload.Resolver<Types> = {
  token: parent => parent.token,
  user: parent => parent.user
};
