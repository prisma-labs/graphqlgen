import * as os from "os";
import * as capitalize from "capitalize";

import {
  GraphQLTypeObject,
  GraphQLScalarTypeArray,
  GraphQLScalarType,
  getTSTypeFromGraphQLType,
  GraphQLEnumObject
} from "../source-helper";

type GenerateArgs = {
  types: GraphQLTypeObject[];
  enums: GraphQLEnumObject[];
};

// TODO: Handle input object types, enum, union
export function generate(args: GenerateArgs) {
  const types: GraphQLTypeObject[] = args.types;
  const enums: GraphQLEnumObject[] = args.enums;
  return `
import { GraphQLResolveInfo } from 'graphql'

export interface ResolverFn<Root, Args, Ctx, Payload> {
  (root: Root, args: Args, ctx: Ctx, info: GraphQLResolveInfo):
    | Payload
    | Promise<Payload>
}

export interface ITypes {
Context: any
${enums.map(e => `${e.name}Root: any`).join(os.EOL)}
${types.map(type => `${type.name}Root: any`).join(os.EOL)}
}

  ${types
    .map(
      type => `export namespace I${type.name} {
  ${type.fields
    .map(
      field => `${
        field.arguments.length > 0
          ? `export interface Args${capitalize(field.name)} {
      ${field.arguments
        .map(
          arg =>
            `${arg.name}: ${
              GraphQLScalarTypeArray.indexOf(arg.type.name) > -1
                ? getTSTypeFromGraphQLType(arg.type.name as GraphQLScalarType)
                : `T['${field.type.name}Root']`
            }${field.type.isArray ? "[]" : ""}`
        )
        .join(os.EOL)}
    }`
          : ""
      }

  export type ${capitalize(field.name)}Resolver<T extends ITypes> = ResolverFn<
    T['${type.name}Root'],
    {},
    T['Context'],
    ${
      GraphQLScalarTypeArray.indexOf(field.type.name) > -1
        ? getTSTypeFromGraphQLType(field.type.name as GraphQLScalarType)
        : `T['${field.type.name}Root']`
    }${field.type.isArray ? "[]" : ""}
  >
  `
    )
    .join(os.EOL)}

  export interface Resolver<T extends ITypes> {
  ${type.fields
    .map(field => `   ${field.name}: ${capitalize(field.name)}Resolver<T>`)
    .join(os.EOL)}
  }
}
`
    )
    .join(os.EOL)}

export interface IResolvers<T extends ITypes> {
  ${types
    .map(type => `   ${type.name}: I${type.name}.Resolver<T>`)
    .join(os.EOL)}
}

  `;
}
