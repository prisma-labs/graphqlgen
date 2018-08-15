import {
  GraphQLTypeObject,
  GraphQLEnumObject,
  GraphQLUnionObject
} from "../source-helper";

export type GenerateArgs = {
  types: GraphQLTypeObject[];
  enums: GraphQLEnumObject[];
  unions: GraphQLUnionObject[];
};

interface CodeFileLike {
  [path: string]: string;
}

export interface IGenerator {
  generate: (args: GenerateArgs) => string | CodeFileLike;
  format: (code: string) => string;
}
