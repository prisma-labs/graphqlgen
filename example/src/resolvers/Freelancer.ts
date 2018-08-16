import { IFreelancer } from "../generated/resolvers";
import { Types } from "./types";

export interface FreelancerRoot {
  id: string;
  name: string;
  task_cost: number;
}

export const Freelancer: IFreelancer.Resolver<Types> = {
  id: root => root.id,
  name: root => root.name,
  task_cost: root => root.task_cost
};
