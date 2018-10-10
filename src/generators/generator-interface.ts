import * as prettier from "prettier";
import {
  GraphQLTypeObject,
  GraphQLEnumObject,
  GraphQLUnionObject,
  GraphQLInterfaceObject
} from "../source-helper";

export type GenerateArgs = {
  types: GraphQLTypeObject[];
  enums: GraphQLEnumObject[];
  unions: GraphQLUnionObject[];
  interfaces: GraphQLInterfaceObject[];
};

export interface CodeFileLike {
  path: string;
  force: boolean;
  code: string;
}

export interface IGenerator {
  generate: (args: GenerateArgs) => string | CodeFileLike[];
  format: (code: string, options?: prettier.Options) => string;
}
