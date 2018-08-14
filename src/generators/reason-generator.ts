import * as os from "os";
import * as capitalize from "capitalize";
import * as camelCase from "camelcase";
import * as refmt from "reason";
import { GraphQLScalarType } from "../source-helper";

import { GenerateArgs } from "./generator-interface";

type SpecificGraphQLScalarType =
  | "bool"
  | "int"
  | "float"
  | "string"
  | "nonScalar";

function getTypeFromGraphQLType(
  type: GraphQLScalarType
): SpecificGraphQLScalarType {
  if (type === "Int") {
    return "int";
  }
  if (type === "Float") {
    return "float";
  }
  if (type === "Boolean") {
    return "bool";
  }
  if (type === "String" || type === "ID" || type === "DateTime") {
    return "string";
  }
  return "nonScalar";
}

export function format(code: string) {
  try {
    return refmt.printRE(refmt.parseRE(code));
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
  console.log(`Reason binding is experimental`);
  return `
  module Data = {
    ${args.types
      .map(
        type => `
      type ${camelCase(type.name)} = {
        .
        ${type.fields
          .filter(
            field =>
              getTypeFromGraphQLType(field.type.name as GraphQLScalarType) !==
              "nonScalar"
          )
          .map(
            field => `
          "${field.name}": ${getTypeFromGraphQLType(field.type
              .name as GraphQLScalarType)},
        `
          )
          .join(os.EOL)}
      }
    `
      )
      .join(os.EOL)}
  };


  ${args.types
    .map(
      type => `
    module ${capitalize(type.name)} = {
      type resolvers = {
        .
        ${type.fields
          .filter(
            field =>
              getTypeFromGraphQLType(field.type.name as GraphQLScalarType) ===
              "nonScalar"
          )
          .map(
            field => `
          "${field.name}": ${
              field.type.isArray
                ? `Js.Array.t(Data.${camelCase(field.type.name)})`
                : `Data.${camelCase(field.type.name)}`
            },
        `
          )
          .join(os.EOL)}
      }
    }
  `
    )
    .join(os.EOL)}

  `;
}
