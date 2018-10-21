import * as os from 'os'
import * as camelCase from 'camelcase'
import * as refmt from 'reason'
import { GraphQLScalarType, GraphQLTypeField } from '../source-helper'

import { GenerateArgs } from '../types'
import { upperFirst } from '../utils'

type SpecificGraphQLScalarType =
  | 'bool'
  | 'int'
  | 'float'
  | 'string'
  | 'nonScalar'

function getTypeFromGraphQLType(
  type: GraphQLScalarType,
): SpecificGraphQLScalarType {
  if (type === 'Int') {
    return 'int'
  }
  if (type === 'Float') {
    return 'float'
  }
  if (type === 'Boolean') {
    return 'bool'
  }
  if (type === 'String' || type === 'ID' || type === 'DateTime') {
    return 'string'
  }
  return 'nonScalar'
}

export function format(code: string) {
  try {
    return refmt.printRE(refmt.parseRE(code))
  } catch (e) {
    console.log(
      `There is a syntax error in generated code, unformatted code printed, error: ${JSON.stringify(
        e,
      )}`,
    )
    return code
  }
}

function printFieldLikeType(field: GraphQLTypeField) {
  if (
    getTypeFromGraphQLType(field.type.name as GraphQLScalarType) !== 'nonScalar'
  ) {
    return `${getTypeFromGraphQLType(field.type.name as GraphQLScalarType)},`
  }

  if (field.type.isArray) {
    return `Js.Array.t(Data.${camelCase(field.type.name)}),`
  }

  return `Data.${camelCase(field.type.name)},`
}

export function generate(args: GenerateArgs) {
  console.log(`Reason binding is experimental`)
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
              'nonScalar',
          )
          .map(
            field => `
          "${field.name}": ${printFieldLikeType(field)}
        `,
          )
          .join(os.EOL)}
      }
    `,
      )
      .join(os.EOL)}

      ${args.unions
        .map(
          union => `
        type ${camelCase(union.name)} =
          ${union.types.map(t => `| ${t.name}`).join(os.EOL)}  
      `,
        )
        .join(os.EOL)}

      ${args.enums
        .map(
          e => `
        type ${camelCase(e.name)} =
          ${e.values.map(v => `| ${v}`).join(os.EOL)}  
      `,
        )
        .join(os.EOL)}
  };


  ${args.types
    .map(
      type => `
    module ${upperFirst(type.name)} = {
      
      ${type.fields
        .filter(field => field.arguments.length > 0)
        .map(
          field => `
          type ${field.name}Argument = {
            .
            ${field.arguments
              .map(
                arg => `
              "${arg.name}": ${printFieldLikeType(field)}
            `,
              )
              .join(os.EOL)}
          }
        `,
        )
        .join(os.EOL)}

      type parent;
      type args;
      type context;
      type info;
      
      type resolvers = {
        .
        ${type.fields
          .filter(
            field =>
              getTypeFromGraphQLType(field.type.name as GraphQLScalarType) ===
              'nonScalar',
          )
          .map(
            field => `
          "${field.name}": (parent, ${
              field.arguments.length > 0 ? `${field.name}Argument` : `args`
            }, context, info) => ${printFieldLikeType(field)}
        `,
          )
          .join(os.EOL)}
      }
    }
  `,
    )
    .join(os.EOL)}

  `
}
