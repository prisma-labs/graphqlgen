import { GraphQLTypeObject, GraphQLType } from '../source-helper'
import { Model, ModelMap, ContextDefinition } from '../types'
import * as os from 'os'
import { ModelField } from '../ast'

export function renderDefaultResolvers(
  type: GraphQLTypeObject,
  modelMap: ModelMap,
  extractFieldsFromModel: (model: Model) => ModelField[],
  variableName: string,
): string {
  const model = modelMap[type.name]

  if (model === undefined) {
    return `export const ${variableName} = {}`
  }

  const modelFields = extractFieldsFromModel(model)

  return `export const ${variableName} = {
    ${modelFields
      .filter(modelField => {
        const graphQLField = type.fields.find(
          field => field.name === modelField.fieldName,
        )

        if (!graphQLField) {
          return false
        }

        return !(modelField.fieldOptional && graphQLField.type.isRequired)
      })
      .map(modelField =>
        renderDefaultResolver(
          modelField.fieldName,
          modelField.fieldOptional,
          model.modelTypeName,
        ),
      )
      .join(os.EOL)}
  }`
}

function renderDefaultResolver(
  fieldName: string,
  fieldOptional: boolean,
  parentTypeName: string,
): string {
  const field = `parent.${fieldName}`
  const fieldGetter = renderFieldGetter(field, fieldOptional)
  return `${fieldName}: (parent: ${parentTypeName}) => ${fieldGetter},`
}

function renderFieldGetter(
  fieldGetter: string,
  fieldOptional: boolean,
): string {
  if (fieldOptional) {
    return `(${fieldGetter} === undefined || ${fieldGetter} === null) ? null : ${fieldGetter}`
  }

  return fieldGetter
}

export function getContextName(context?: ContextDefinition) {
  if (!context) {
    return 'Context'
  }

  return context.interfaceName
}

export function getModelName(type: GraphQLType, modelMap: ModelMap): string {
  const model = modelMap[type.name]

  if (type.isEnum) {
    return type.name
  }

  // NOTE if no model is found, return the empty type
  // It's usually assumed that every GraphQL type has a model associated
  // expect for the `Query`, `Mutation` and `Subscription` type
  if (model === undefined) {
    return '{}'
  }

  return model.modelTypeName
}
