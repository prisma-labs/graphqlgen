import { ITodo } from "../generated/resolvers";
import { Types } from "./types";

import { EmployeeRoot } from "./Employee";
import { FreelancerRoot } from "./Freelancer";

export type User = EmployeeRoot | FreelancerRoot;

export type TODO_STATE =
  | "NOT_STARTED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface TodoRoot {
  id: string;
  text: string;
  completed: boolean;
  state: TODO_STATE;
  assigned_to: User[];
}

export const Todo: ITodo.Resolver<Types> = {
  id: root => root.id,
  text: root => root.text,
  completed: root => root.completed,
  state: root => root.state,
  assigned_to: root => root.assigned_to
};
