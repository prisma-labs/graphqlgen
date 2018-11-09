import { GenerateArgs, CodeFileLike } from '../types'
import { GraphQLTypeObject } from '../source-helper'
import {
  fieldsFromModelDefinition,
  shouldScaffoldFieldResolver,
  isParentType,
} from './common'

export { format } from './ts-generator'

function renderResolvers(
  type: GraphQLTypeObject,
  args: GenerateArgs,
): CodeFileLike {
  const model = args.modelMap[type.name]
  const modelFields = fieldsFromModelDefinition(model.definition)

  const code = `\
  // This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
  // Please do not import this file directly but copy & paste to your application code.

  import { ${type.name}Resolvers } from '[TEMPLATE-INTERFACES-PATH]'

  export const ${type.name}: ${type.name}Resolvers.Type = {
    ...${type.name}Resolvers.defaultResolvers,
    ${type.fields
      .filter(field => shouldScaffoldFieldResolver(field, modelFields, args))
      .map(
        field => `
      ${field.name}: (parent, args, ctx) => {
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
    ${type.fields.map(field => {
      if (type.name === 'Subscription') {
        return `${field.name}: {
          subscribe: (parent, args, ctx) => {
            throw new Error('Resolver not implemented')
          }
        }`
      }

      return `${field.name}: (parent, args, ctx) => {
          throw new Error('Resolver not implemented')
        }`
    })}
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
    .map(type => renderResolvers(type, args))

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
