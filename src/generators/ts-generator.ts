import * as os from 'os'
import * as capitalize from 'capitalize'
import * as prettier from 'prettier'

import { GenerateArgs } from './generator-interface'
import { GraphQLTypeField, GraphQLTypeObject } from '../source-helper'

type SpecificGraphQLScalarType = 'boolean' | 'number' | 'string'

function getTypeFromGraphQLType(type: string): SpecificGraphQLScalarType {
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
      parser: 'typescript',
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
    return `${getTypeFromGraphQLType(field.type.name)}${
      field.type.isArray ? '[]' : ''
    }${!field.type.isRequired ? '| null' : ''}`
  }

  if (field.type.isInput) {
    return `${field.type.name}${field.type.isArray ? '[]' : ''}${
      !field.type.isRequired ? '| null' : ''
    }`
  }

  return lookupType
    ? `T['${field.type.name}${
        field.type.isEnum || field.type.isUnion ? '' : 'Parent'
      }']${field.type.isArray ? '[]' : ''}${
        !field.type.isRequired ? '| null' : ''
      }`
    : `${field.type.name}${
        field.type.isEnum || field.type.isUnion ? '' : 'Parent'
      }${field.type.isArray ? '[]' : ''}${
        !field.type.isRequired ? '| null' : ''
      }`
}

export function generate(args: GenerateArgs) {
  // TODO: Maybe move this to source helper
  const inputTypesMap: { [s: string]: GraphQLTypeObject } = args.types
    .filter(type => type.type.isInput)
    .reduce((inputTypes, type) => {
      return {
        ...inputTypes,
        [`${type.name}`]: type,
      }
    }, {})

  // TODO: Type this
  const typeToInputTypeAssociation: {[s: string]: any} = args.types
    .filter(
      type =>
        type.type.isObject &&
        type.fields.filter(
          field => field.arguments.filter(arg => arg.type.isInput).length > 0,
        ).length > 0,
    )
    .reduce((types, type) => {
      return {
        ...types,
        [`${type.name}`]: [].concat(...type.fields.map(field =>
          field.arguments
            .filter(arg => arg.type.isInput)
            .map(arg => arg.type.name),
        ) as any)
      }
    }, {})

  return `
/* DO NOT EDIT! */
import { GraphQLResolveInfo } from 'graphql'

export interface ITypeMap {
Context: any
${args.enums.map(e => `${e.name}: any`).join(os.EOL)}
${args.unions.map(union => `${union.name}: any`).join(os.EOL)}
${args.types
    .filter(type => type.type.isObject)
    .map(type => `${type.name}Parent: any`)
    .join(os.EOL)}
}

  ${args.types
    .filter(type => type.type.isObject)
    .map(
      type => `export namespace ${type.name}Resolvers {

        ${typeToInputTypeAssociation[type.name] ? `export interface ${inputTypesMap[typeToInputTypeAssociation[type.name]].name} {
          ${inputTypesMap[typeToInputTypeAssociation[type.name]].fields.map(
            field => `${field.name}: ${getTypeFromGraphQLType(field.type.name)}`
          )}
        }` : ``}  

  ${type.fields
    .map(
      field => `${
        field.arguments.length > 0
          ? `export interface Args${capitalize(field.name)}<T extends ITypeMap> {
      ${field.arguments
        .map(
          arg => `${arg.name}: ${printFieldLikeType(arg as GraphQLTypeField)}`,
        )
        .join(os.EOL)}
    }`
          : ''
      }

  export type ${capitalize(field.name)}Resolver<T extends ITypeMap> = (
    parent: T['${type.name}${
        type.type.isEnum || type.type.isUnion ? '' : 'Parent'
      }'],
    args: ${
      field.arguments.length > 0 ? `Args${capitalize(field.name)}<T>` : '{}'
    },
    ctx: T['Context'],
    info: GraphQLResolveInfo,
  ) => ${printFieldLikeType(field)} | Promise<${printFieldLikeType(field)}>
  `,
    )
    .join(os.EOL)}

  export interface Type<T extends ITypeMap> {
  ${type.fields
    .map(
      field => `${field.name}: (
      parent: T['${type.name}${
        type.type.isEnum || type.type.isUnion ? '' : 'Parent'
      }'],
      args: ${
        field.arguments.length > 0 ? `Args${capitalize(field.name)}<T>` : '{}'
      },
      ctx: T['Context'],
      info: GraphQLResolveInfo,
    ) => ${printFieldLikeType(field)} | Promise<${printFieldLikeType(field)}>`,
    )
    .join(os.EOL)}
  }
}
`,
    )
    .join(os.EOL)}

export interface IResolvers<T extends ITypeMap> {
  ${args.types
    .filter(type => type.type.isObject)
    .map(type => `${type.name}: ${type.name}Resolvers.Type<T>`)
    .join(os.EOL)}
}

  `
}
