import { GenerateArgs, CodeFileLike, ModelMap } from '../types'
import { GraphQLTypeField, GraphQLTypeObject } from '../source-helper'
import { extractFieldsFromTypescriptType } from '../ast'
import { shouldScaffoldFieldResolver } from './common'

export { format } from './ts-generator'

function printFieldLikeTypeEmptyCase(field: GraphQLTypeField) {
  if (!field.type.isRequired || field.type.name === 'ID') {
    return `null`
  }
  if (field.type.isRequired && field.type.isArray && field.type.isScalar) {
    return `[]`
  }
  if (
    field.type.isRequired &&
    field.type.name === 'String' &&
    field.type.isScalar
  ) {
    return `''`
  }
  if (
    field.type.isRequired &&
    (field.type.name === 'Int' || field.type.name === 'Float') &&
    field.type.isScalar
  ) {
    return `0`
  }
  if (
    field.type.isRequired &&
    field.type.name === 'Boolean' &&
    field.type.isScalar
  ) {
    return `false`
  }
  if (field.type.isRequired && !field.type.isScalar) {
    return `{ throw new Error('Resolver not implemented') }`
  }
}

function isParentType(name: string) {
  const parentTypes = ['Query', 'Mutation', 'Subscription']
  return parentTypes.indexOf(name) > -1
}

function renderResolvers(
  type: GraphQLTypeObject,
  modelMap: ModelMap,
): CodeFileLike {
  const model = modelMap[type.name]
  const modelFields = extractFieldsFromTypescriptType(model)

  const code = `\
  // This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
  // Please do not import this file directly but copy & paste to your application code.

  import { ${type.name}Resolvers } from '[TEMPLATE-INTERFACES-PATH]'

  export const ${type.name}: ${type.name}Resolvers.Type = {
    ...${type.name}Resolvers.defaultResolvers,
    ${type.fields
      .filter(field => shouldScaffoldFieldResolver(field, modelFields))
      .map(
        field => `
      ${field.name}: (parent${field.arguments.length > 0 ? ', args' : ''}) => {
        throw new Error('Resolver not implemented')
      }
    `,
      )}
  }`
  return { path: `${type.name}.ts`, force: false, code }
}

function renderParentResolvers(type: GraphQLTypeObject): CodeFileLike {
  const code = `\
  // This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
  // Please do not import this file directly but copy & paste to your application code.

  import { ${type.name}Resolvers } from '[TEMPLATE-INTERFACES-PATH]'
  
  export const ${type.name}: ${type.name}Resolvers.Type = {
    ...${type.name}Resolvers.defaultResolvers,
    ${type.fields.map(
      field =>
        `${field.name}: (parent${
          field.arguments.length > 0 ? ', args' : ''
        }) => ${printFieldLikeTypeEmptyCase(field)}`,
    )}
  }
      `
  return {
    path: `${type.name}.ts`,
    force: false,
    code,
  }
}

function renderExports(types: GraphQLTypeObject[]): string {
  return `\
  // This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
  // Please do not import this file directly but copy & paste to your application code.

  import { Resolvers } from '[TEMPLATE-INTERFACES-PATH]'
    ${types
      .filter(type => type.type.isObject)
      .map(
        type => `
      import { ${type.name} } from './${type.name}'
    `,
      )
      .join(';')}

    export const resolvers: Resolvers = {
      ${types
        .filter(type => type.type.isObject)
        .map(type => `${type.name}`)
        .join(',')}
    }`
}

export function generate(args: GenerateArgs): CodeFileLike[] {
  let files: CodeFileLike[] = args.types
    .filter(type => type.type.isObject)
    .filter(type => !isParentType(type.name))
    .map(type => renderResolvers(type, args.modelMap))

  files = files.concat(
    args.types
      .filter(type => type.type.isObject)
      .filter(type => isParentType(type.name))
      .map(renderParentResolvers),
  )

  files.push({
    path: 'index.ts',
    force: false,
    code: renderExports(args.types),
  })

  return files
}
