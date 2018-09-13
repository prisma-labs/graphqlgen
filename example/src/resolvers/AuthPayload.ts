import { IAuthPayload } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";
import { UserParent } from "./User";

export interface AuthPayloadParent {
  token: string;
  user: UserParent;
}

export const AuthPayload: IAuthPayload.Resolver<TypeMap> = {
  token: parent => parent.token,
  user: parent => parent.user
};
