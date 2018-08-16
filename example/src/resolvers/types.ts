import { ITypes } from "../generated/resolvers";

import { QueryRoot } from "./Query";
import { EmployeeRoot } from "./Employee";
import { FreelancerRoot } from "./Freelancer";
import { TodoRoot } from "./Todo";

import { Context } from "./Context";

export interface Types extends ITypes {
  Context: Context;
  QueryRoot: QueryRoot;
  EmployeeRoot: EmployeeRoot;
  FreelancerRoot: FreelancerRoot;
  TodoRoot: TodoRoot;
}
