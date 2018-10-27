import { GenerateArgs, CodeFileLike, ModelMap } from '../types'
import { upperFirst } from '../utils'
import { GraphQLTypeObject } from '../source-helper'
import { extractFieldsFromFlowType } from '../flow-ast'
import { shouldScaffoldFieldResolver } from './common'

export { format } from './flow-generator'

function isParentType(name: string) {
  const parentTypes = ['Query', 'Mutation', 'Subscription']
  return parentTypes.indexOf(name) > -1
}

function renderParentResolvers(type: GraphQLTypeObject): CodeFileLike {
  const code = `/* @flow */
  import type { ${type.name}Resolvers } from '[TEMPLATE-INTERFACES-PATH]'
  
  export const ${type.name}: ${type.name}Resolvers = {
    ${type.fields.map(
      field =>
        `${
          field.name
        }: (parent, args, ctx) => { throw new Error('Resolver not implemented') }`,
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
  modelMap: ModelMap,
): CodeFileLike {
  const model = modelMap[type.name]
  const modelFields = extractFieldsFromFlowType(model)
  const code = `/* @flow */
import { ${upperFirst(
    type.name,
  )}_defaultResolvers } from '[TEMPLATE-INTERFACES-PATH]'
import type { ${upperFirst(
    type.name,
  )}Resolvers } from '[TEMPLATE-INTERFACES-PATH]'

export const ${type.name}: ${upperFirst(type.name)}Resolvers = {
  ...${upperFirst(type.name)}_defaultResolvers,
  ${type.fields
    .filter(graphQLField =>
      shouldScaffoldFieldResolver(graphQLField, modelFields),
    )
    .map(
      field => `
      ${field.name}: (parent, args, ctx) => {
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
    .filter(type => !isParentType(type.name))
    .map(type => renderResolvers(type, args.modelMap))

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
