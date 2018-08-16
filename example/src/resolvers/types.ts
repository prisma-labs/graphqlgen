import { ITypes } from "../generated/resolvers";

import { EmployeeRoot } from "./Employee";

import { FreelancerRoot } from "./Freelancer";

import { TodoRoot } from "./Todo";

export { Context } from "./Context";

export interface Types extends ITypes {
  Context: Context;

  EmployeeRoot: EmployeeRoot;
  FreelancerRoot: FreelancerRoot;
  TodoRoot: TodoRoot;
}
