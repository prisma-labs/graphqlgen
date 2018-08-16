import { GraphQLServer } from "graphql-yoga";
import { IResolvers } from "./generated/resolvers";
import { Types } from "./resolvers/types";
import { Query } from "./resolvers/Query";
import { Freelancer } from "./resolvers/Freelancer";
import { Employee } from "./resolvers/Employee";
import { Todo } from "./resolvers/Todo";

const resolvers: IResolvers<Types> = {
  Query: Query,
  Freelancer: Freelancer,
  Employee: Employee,
  Todo: Todo
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db: {}
  }
} as any);
server.start(() => console.log("Server is running on localhost:4000"));
