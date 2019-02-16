import { GenerateArgs, CodeFileLike } from '../../types'
import { upperFirst } from '../../utils'
import {
  GraphQLTypeObject,
  GraphQLInterfaceObject,
  GraphQLUnionObject,
} from '../../source-helper'
import {
  fieldsFromModelDefinition,
  shouldScaffoldFieldResolver,
  isParentType,
} from '../common'

export { format } from './generator'

function renderParentResolvers(type: GraphQLTypeObject): CodeFileLike {
  const upperTypeName = upperFirst(type.name)
  const code = `/* @flow */
  import type { ${upperTypeName}_Resolvers } from '[TEMPLATE-INTERFACES-PATH]'

  export const ${type.name}: ${upperTypeName}_Resolvers = {
    ${type.fields.map(field => {
      if (type.name === 'Subscription') {
        return `${field.name}: {
          subscribe: (parent, args, ctx, info) => {
            throw new Error('Resolver not implemented')
          }
        }`
      }

      return `${field.name}: (parent, args, ctx, info) => {
          throw new Error('Resolver not implemented')
        }`
    })}
  }
  `
  return {
    path: `${type.name}.js`,
    force: false,
    code,
  }
}
function renderExports(types: GraphQLTypeObject[]): string {
  return `\
  // @flow
  // This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
  // Please do not import this file directly but copy & paste to your application code.

  import type { Resolvers } from '[TEMPLATE-INTERFACES-PATH]'
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

function renderPolyResolvers(
  type: GraphQLInterfaceObject | GraphQLUnionObject,
): CodeFileLike {
  const upperTypeName = upperFirst(type.name)

  const code = `\
  // @flow
  // This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
  // Please do not import this file directly but copy & paste to your application code.

  import { ${upperTypeName}_Resolvers } from '[TEMPLATE-INTERFACES-PATH]'

  export const ${type.name}: ${upperTypeName}_Resolvers = {
    __resolveType: (parent, ctx, info) => {
      throw new Error('Resolver not implemented')
    }
  }`
  return { path: `${type.name}.ts`, force: false, code }
}

function renderResolvers(
  type: GraphQLTypeObject,
  args: GenerateArgs,
): CodeFileLike {
  const model = args.modelMap[type.name]
  const modelFields = fieldsFromModelDefinition(model.definition)
  const upperTypeName = upperFirst(type.name)
  const code = `/* @flow */
${
  args.defaultResolversEnabled
    ? `import { ${upperTypeName}_defaultResolvers } from '[TEMPLATE-INTERFACES-PATH]'`
    : ''
}
import type { ${upperTypeName}_Resolvers } from '[TEMPLATE-INTERFACES-PATH]'

export const ${type.name}: ${upperTypeName}_Resolvers = {
  ${args.defaultResolversEnabled ? `...${upperTypeName}_defaultResolvers,` : ''}
  ${type.fields
    .filter(graphQLField =>
      shouldScaffoldFieldResolver(graphQLField, modelFields, args),
    )
    .map(
      field => `
      ${field.name}: (parent, args, ctx, info) => {
        throw new Error('Resolver not implemented')
      }
    `,
    )}
}
`
  return {
    path: `${type.name}.js`,
    force: false,
    code,
  }
}

export function generate(args: GenerateArgs): CodeFileLike[] {
  let files: CodeFileLike[] = args.types
    .filter(type => type.type.isObject)
    .filter(type => !isParentType(type.name))
    .map(type => renderResolvers(type, args))

  files = files.concat(
    args.interfaces.map(type => renderPolyResolvers(type)),
    args.unions.map(type => renderPolyResolvers(type)),
  )

  files = files.concat(
    args.types
      .filter(type => isParentType(type.name))
      .map(renderParentResolvers),
  )

  files.push({
    path: 'index.js',
    force: false,
    code: renderExports(args.types),
  })

  return files
}
