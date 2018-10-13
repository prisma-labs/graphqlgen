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

interface InputTypesMap {
  [s: string]: GraphQLTypeObject
}

interface TypeToInputTypeAssociation {
  [s: string]: any
}

export function generate(args: GenerateArgs): string {
  // TODO: Maybe move this to source helper
  const inputTypesMap: InputTypesMap = args.types
    .filter(type => type.type.isInput)
    .reduce((inputTypes, type) => {
      return {
        ...inputTypes,
        [`${type.name}`]: type,
      }
    }, {})

  // TODO: Type this
  const typeToInputTypeAssociation: TypeToInputTypeAssociation = args.types
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
        [`${type.name}`]: [].concat(
          ...(type.fields.map(field =>
            field.arguments
              .filter(arg => arg.type.isInput)
              .map(arg => arg.type.name),
          ) as any),
        ),
      }
    }, {})

  return `\
  ${renderHeader(args)}

  ${renderNamespaces(args, typeToInputTypeAssociation, inputTypesMap)}

  ${renderIResolvers(args)}

  `
}

function renderHeader(args: GenerateArgs): string {
  const modelArray = Object.keys(args.models).map(k => args.models[k])
  const modelImports = modelArray
    .map(m => `import { ${m.modelTypeName} } from '${m.path}'`)
    .join(os.EOL)

  return `
/* DO NOT EDIT! */
import { GraphQLResolveInfo } from 'graphql'
import { Context } from '${args.contextPath}'
${modelImports}
  `
}

function renderNamespaces(
  args: GenerateArgs,
  typeToInputTypeAssociation: TypeToInputTypeAssociation,
  inputTypesMap: InputTypesMap,
): string {
  return args.types
    .filter(type => type.type.isObject)
    .map(type =>
      renderNamespace(type, typeToInputTypeAssociation, inputTypesMap),
    )
    .join(os.EOL)
}

function renderNamespace(
  type: GraphQLTypeObject,
  typeToInputTypeAssociation: TypeToInputTypeAssociation,
  inputTypesMap: InputTypesMap,
): string {
  return `\
    export namespace ${type.name}Resolvers {

    ${
      typeToInputTypeAssociation[type.name]
        ? `export interface ${
            inputTypesMap[typeToInputTypeAssociation[type.name]].name
          } {
      ${inputTypesMap[typeToInputTypeAssociation[type.name]].fields.map(
        field => `${field.name}: ${getTypeFromGraphQLType(field.type.name)}`,
      )}
    }`
        : ``
    }  

    ${renderInputArgInterfaces(type)}

    ${renderResolverFunctionInterfaces(type)}

    ${renderResolverTypeInterface(type)}
  }
  `
}

function renderInputArgInterfaces(type: GraphQLTypeObject): string {
  return type.fields.map(renderInputArgInterface).join(os.EOL)
}

function renderInputArgInterface(field: GraphQLTypeField): string {
  if (field.arguments.length === 0) {
    return ''
  }

  return `
  export interface Args${capitalize(field.name)} {
    ${field.arguments
      .map(arg => `${arg.name}: ${printFieldLikeType(arg as GraphQLTypeField)}`)
      .join(os.EOL)}
  }
  `
}

function renderResolverFunctionInterfaces(type: GraphQLTypeObject): string {
  return type.fields
    .map(field => renderResolverFunctionInterface(field, type))
    .join(os.EOL)
}

function renderResolverFunctionInterface(
  field: GraphQLTypeField,
  type: GraphQLTypeObject,
): string {
  return `
  export type ${capitalize(field.name)}Resolver = (
    parent: T['${type.name}${
    type.type.isEnum || type.type.isUnion ? '' : 'Parent'
  }'],
    args: ${
      field.arguments.length > 0 ? `Args${capitalize(field.name)}` : '{}'
    },
    ctx: Context,
    info: GraphQLResolveInfo,
  ) => ${printFieldLikeType(field)} | Promise<${printFieldLikeType(field)}>
  `
}

function renderResolverTypeInterface(type: GraphQLTypeObject): string {
  return `
  export interface Type {
    ${type.fields
      .map(
        field => `${field.name}: (
      parent: T['${type.name}${
          type.type.isEnum || type.type.isUnion ? '' : 'Parent'
        }'],
      args: ${
        field.arguments.length > 0 ? `Args${capitalize(field.name)}` : '{}'
      },
      ctx: Context,
      info: GraphQLResolveInfo,
    ) => ${printFieldLikeType(field)} | Promise<${printFieldLikeType(field)}>`,
      )
      .join(os.EOL)}
  }
  `
}

function renderIResolvers(args: GenerateArgs): string {
  return `
export interface IResolvers {
  ${args.types
    .filter(type => type.type.isObject)
    .map(type => `${type.name}: ${type.name}Resolvers.Type`)
    .join(os.EOL)}
}
  `
}
