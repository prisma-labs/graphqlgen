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

export interface IGenerator {
  generate: (args: GenerateArgs) => string;
  format: (code: string) => string;
}
