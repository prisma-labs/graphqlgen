import { GenerateArgs, CodeFileLike } from '../types'
import { upperFirst } from '../utils'
import { GraphQLTypeObject } from '../source-helper'
import {
  fieldsFromModelDefinition,
  shouldScaffoldFieldResolver,
} from './common'

export { format } from './flow-generator'

function isParentType(name: string) {
  const parentTypes = ['Query', 'Mutation', 'Subscription']
  return parentTypes.indexOf(name) > -1
}

function renderParentResolvers(type: GraphQLTypeObject): CodeFileLike {
  const upperTypeName = upperFirst(type.name)
  const code = `/* @flow */
  import type { ${upperTypeName}_Resolvers } from '[TEMPLATE-INTERFACES-PATH]'
  
  export const ${type.name}: ${upperTypeName}_Resolvers = {
    ${type.fields.map(
      field =>
        `${
          field.name
        }: (parent, args, ctx, info) => { throw new Error('Resolver not implemented') }`,
    )}
  }
  `
  return {
    path: `${type.name}.js`,
    force: false,
    code,
  }
}
function renderResolvers(
  type: GraphQLTypeObject,
  args: GenerateArgs,
): CodeFileLike {
  const model = args.modelMap[type.name]
  const modelFields = fieldsFromModelDefinition(model.definition)
  const upperTypeName = upperFirst(type.name)
  const code = `/* @flow */
import { ${upperTypeName}_defaultResolvers } from '[TEMPLATE-INTERFACES-PATH]'
import type { ${upperTypeName}_Resolvers } from '[TEMPLATE-INTERFACES-PATH]'

export const ${type.name}: ${upperTypeName}_Resolvers = {
  ...${upperTypeName}_defaultResolvers,
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
    args.types
      .filter(type => isParentType(type.name))
      .map(renderParentResolvers),
  )

  files.push({
    path: 'index.js',
    force: false,
    code: `/* @flow */
    import type { Resolvers } from '[TEMPLATE-INTERFACES-PATH]'
    ${args.types
      .map(
        type => `
      import { ${type.name} } from './${type.name}'
    `,
      )
      .join(';')}

    export const resolvers: Resolvers = {
      ${args.types.map(type => `${type.name}`).join(',')}   
    }
    `,
  })

  return files
}
