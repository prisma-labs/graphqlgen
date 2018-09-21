import * as os from "os";
import * as capitalize from "capitalize";
import * as prettier from "prettier";

import { GenerateArgs } from "./generator-interface";
import { GraphQLScalarType, GraphQLTypeField } from "../source-helper";

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
      parser: "flow"
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

export function printFieldLikeType(
  field: GraphQLTypeField,
  lookupType: boolean = true
) {
  if (field.type.isScalar) {
    return `${getTypeFromGraphQLType(field.type.name as GraphQLScalarType)}${
      field.type.isArray ? "[]" : ""
    }${!field.type.isRequired ? "| null" : ""}`;
  }

  return lookupType
    ? `$PropertyType<T & ITypeMap, '${field.type.name}${
        field.type.isEnum || field.type.isUnion ? "" : "Parent"
      }'>${field.type.isArray ? "[]" : ""}${
        !field.type.isRequired ? "| null" : ""
      }`
    : `${field.type.name}${
        field.type.isEnum || field.type.isUnion ? "" : "Parent"
      }${field.type.isArray ? "[]" : ""}${
        !field.type.isRequired ? "| null" : ""
      }`;
}

export function generate(args: GenerateArgs) {
  return `/**
* @flow
*/
import { GraphQLResolveInfo } from 'graphql'

export interface ITypeMap {
Context: any,
${args.enums.map(e => `${e.name}: any`).join(`,${os.EOL}`)}${
    args.enums.length > 0 ? `,` : ``
  }
${args.unions.map(union => `${union.name}: any`).join(`,${os.EOL}`)}${
    args.unions.length > 0 ? `,` : ``
  }
${args.types.map(type => `${type.name}Parent: any`).join(`,${os.EOL}`)}
}

  ${args.types
    .map(
      type => `declare module "${type.name}Resolvers" {

        ${type.fields
          .map(field => {
            return `${
              field.arguments.length > 0
                ? `// Type for argument
                declare type Args${capitalize(field.name)} = {
              ${field.arguments
                .map(
                  arg =>
                    `${arg.name}: ${printFieldLikeType(
                      arg as GraphQLTypeField
                    )},`
                )
                .join(os.EOL)}
            }`
                : ``
            }
            
            
            // Type for GraphQL type
            declare type ${capitalize(field.name)}Type<T> = (
              parent: $PropertyType<T & ITypeMap, '${type.name}${
              type.type.isEnum || type.type.isUnion ? "" : "Parent"
            }'>,
              args: ${
                field.arguments.length > 0
                  ? `Args${capitalize(field.name)}`
                  : "{}"
              },
              ctx: $PropertyType<T & ITypeMap, 'Context'>,
              info: GraphQLResolveInfo,
            ) => ${printFieldLikeType(field)}
            `;
          })
          .join(os.EOL)}

          declare type Type = {
            ${type.fields
              .map(field => `${field.name}: ${capitalize(field.name)}Type,`)
              .join(os.EOL)}
            }

        declare module.exports: {
  ${type.fields
    .map(field => `${field.name}: ${capitalize(field.name)}Type,`)
    .join(os.EOL)}
  }
}
`
    )
    .join(os.EOL)}

declare type IResolvers<T> = {
  ${args.types
    .map(type => `${type.name}: ${type.name}Resolvers.Type<T & ITypeMap>,`)
    .join(os.EOL)}
}

  `;
}
