import { IEmployee } from "../generated/resolvers";
import { Types } from "./types";

export interface EmployeeRoot {
  id: string;
  name: string;
}

export const Employee: IEmployee.Resolver<Types> = {
  id: root => root.id,
  name: root => root.name
};
