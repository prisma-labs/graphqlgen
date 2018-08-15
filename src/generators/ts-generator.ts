import * as os from "os";
import * as capitalize from "capitalize";
import * as prettier from "prettier";

import { GenerateArgs } from "./generator-interface";
import {
  GraphQLScalarTypeArray,
  GraphQLScalarType,
  GraphQLTypeField
} from "../source-helper";

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

export function format(code: string, options: prettier.Options = {}) {
  try {
    return prettier.format(code, {
      ...options,
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

export function isScalar(type: string) {
  return GraphQLScalarTypeArray.indexOf(type) > -1;
}

export function printFieldLikeType(
  field: GraphQLTypeField,
  lookupType: boolean = true
) {
  if (isScalar(field.type.name)) {
    return `${getTypeFromGraphQLType(field.type.name as GraphQLScalarType)}${
      field.type.isArray ? "[]" : ""
    }${!field.type.isRequired ? "| null" : ""}`;
  }

  return lookupType
    ? `T['${field.type.name}Root']${field.type.isArray ? "[]" : ""}${
        !field.type.isRequired ? "| null" : ""
      }`
    : `${field.type.name}Root${field.type.isArray ? "[]" : ""}${
        !field.type.isRequired ? "| null" : ""
      }`;
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
          arg => `${arg.name}: ${printFieldLikeType(arg as GraphQLTypeField)}`
        )
        .join(os.EOL)}
    }`
          : ""
      }

  export type ${capitalize(field.name)}Resolver<T extends ITypes> = ResolverFn<
    T['${type.name}Root'],
    {},
    T['Context'],
    ${printFieldLikeType(field)}
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
