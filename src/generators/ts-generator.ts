import * as os from "os";
import * as capitalize from "capitalize";
import * as prettier from "prettier";

import { GenerateArgs } from "./generator-interface";
import { GraphQLScalarTypeArray, GraphQLScalarType } from "../source-helper";

type SpecificGraphQLScalarType = "boolean" | "number" | "string";

function getTypeFromGraphQLType(
  type: GraphQLScalarType
): SpecificGraphQLScalarType {
  if (type === "Int" || type === "Float") {
    return "number";
  }
  if (type === "Boolean") {
    return "boolean";
  }
  if (type === "String" || type === "ID" || type === "DateTime") {
    return "string";
  }
  return "string";
}

export function format(code: string) {
  try {
    return prettier.format(code, {
      parser: "typescript"
    });
  } catch (e) {
    console.log(
      `There is a syntax error in generated code, unformatted code printed, error: ${JSON.stringify(
        e
      )}`
    );
    return code;
  }
}

export function generate(args: GenerateArgs) {
  return `
import { GraphQLResolveInfo } from 'graphql'

export interface ResolverFn<Root, Args, Ctx, Payload> {
  (root: Root, args: Args, ctx: Ctx, info: GraphQLResolveInfo):
    | Payload
    | Promise<Payload>
}

export interface ITypes {
Context: any
${args.enums.map(e => `${e.name}Root: any`).join(os.EOL)}
${args.unions.map(union => `${union.name}Root: any`).join(os.EOL)}
${args.types.map(type => `${type.name}Root: any`).join(os.EOL)}
}

  ${args.types
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
                ? getTypeFromGraphQLType(arg.type.name as GraphQLScalarType)
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
        ? getTypeFromGraphQLType(field.type.name as GraphQLScalarType)
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
  ${args.types
    .map(type => `   ${type.name}: I${type.name}.Resolver<T>`)
    .join(os.EOL)}
}

  `;
}
