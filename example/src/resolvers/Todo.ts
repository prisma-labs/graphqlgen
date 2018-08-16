import { ITodo } from "../generated/resolvers";
import { Types } from "./types";

import { EmployeeRoot } from "./Employee";
import { FreelancerRoot } from "./Freelancer";

export type UserRoot = EmployeeRoot | FreelancerRoot;

export type TODO_STATERoot =
  | "NOT_STARTED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface TodoRoot {
  id: string;
  text: string;
  completed: boolean;
  state: TODO_STATERoot;
  assigned_to: UserRoot[];
}

export const Todo: ITodo.Resolver<Types> = {
  id: root => root.id,
  text: root => root.text,
  completed: root => root.completed,
  state: root => root.state,
  assigned_to: root => root.assigned_to
};
