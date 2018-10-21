import * as os from 'os'
import * as prettier from 'prettier'

import { GenerateArgs } from '../types'
import { GraphQLScalarType, GraphQLTypeField } from '../source-helper'
import { upperFirst } from '../utils'

type SpecificGraphQLScalarType = 'boolean' | 'number' | 'string'

function getTypeFromGraphQLType(
  type: GraphQLScalarType,
): SpecificGraphQLScalarType {
  if (type === 'Int' || type === 'Float') {
    return 'number'
  }
  if (type === 'Boolean') {
    return 'boolean'
  }
  if (type === 'String' || type === 'ID' || type === 'DateTime') {
    return 'string'
  }
  return 'string'
}

export function format(code: string, options: prettier.Options = {}) {
  try {
    return prettier.format(code, {
      ...options,
      parser: 'flow',
    })
  } catch (e) {
    console.log(
      `There is a syntax error in generated code, unformatted code printed, error: ${JSON.stringify(
        e,
      )}`,
    )
    return code
  }
}

export function printFieldLikeType(
  field: GraphQLTypeField,
  lookupType: boolean = true,
) {
  if (field.type.isScalar) {
    return `${getTypeFromGraphQLType(field.type.name as GraphQLScalarType)}${
      field.type.isArray ? '[]' : ''
    }${!field.type.isRequired ? '| null' : ''}`
  }

  return lookupType
    ? `$PropertyType<T & ITypeMap, '${field.type.name}${
        field.type.isEnum || field.type.isUnion ? '' : 'Parent'
      }'>${field.type.isArray ? '[]' : ''}${
        !field.type.isRequired ? '| null' : ''
      }`
    : `${field.type.name}${
        field.type.isEnum || field.type.isUnion ? '' : 'Parent'
      }${field.type.isArray ? '[]' : ''}${
        !field.type.isRequired ? '| null' : ''
      }`
}

export function generate(args: GenerateArgs) {
  return `/* @flow */
import type { GraphQLResolveInfo } from 'graphql'

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
      type => `
      
      ${type.fields
        .map(field => {
          return `

        ${
          field.arguments.length > 0
            ? `// Type for argument
            export type ${type.name}_${upperFirst(field.name)}_Args = {
          ${field.arguments
            .map(
              arg =>
                `${arg.name}: ${printFieldLikeType(arg as GraphQLTypeField)},`,
            )
            .join(`${os.EOL}`)}
        }`
            : ``
        }

          export type ${type.name}_${upperFirst(field.name)}_Resolver<T> = (
            parent: $PropertyType<T & ITypeMap, '${type.name}${
            type.type.isEnum || type.type.isUnion ? '' : 'Parent'
          }'>,
            args: ${
              field.arguments.length > 0
                ? `${type.name}_${upperFirst(field.name)}_Args`
                : '{}'
            },
            ctx: $PropertyType<T & ITypeMap, 'Context'>,
            info: GraphQLResolveInfo,
          ) => ${printFieldLikeType(field)} | Promise<${printFieldLikeType(
            field,
          )}>
        `
        })
        .join(os.EOL)}

      export type ${type.name}_Type<T> = {
        ${type.fields
          .map(
            field => `${field.name}: (
            parent: $PropertyType<T & ITypeMap, '${type.name}${
              type.type.isEnum || type.type.isUnion ? '' : 'Parent'
            }'>,
            args: ${
              field.arguments.length > 0
                ? `${type.name}_${upperFirst(field.name)}_Args`
                : '{}'
            },
            ctx: $PropertyType<T & ITypeMap, 'Context'>,
            info: GraphQLResolveInfo,
          ) => ${printFieldLikeType(field)},`,
          )
          .join(`${os.EOL}`)}
      }
`,
    )
    .join(os.EOL)}

export type IResolvers<T> = {
  ${args.types.map(type => `${type.name}: ${type.name}_Type<T>,`).join(os.EOL)}
}

  `
}
