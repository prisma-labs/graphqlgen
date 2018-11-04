import * as os from 'os'

import {
  GraphQLTypeObject,
  GraphQLType,
  GraphQLTypeField,
} from '../source-helper'
import { ModelMap, ContextDefinition, GenerateArgs } from '../types'
import {
  ModelField,
  Types,
  InterfaceDefinition,
  TypeAliasDefinition,
  AnonymousInterfaceAnnotation,
} from '../introspection/ts-ast'
import { flatten, uniq } from '../utils'

type SpecificGraphQLScalarType = 'boolean' | 'number' | 'string'

export interface InputTypesMap {
  [inputTypeName: string]: GraphQLTypeObject
}

export interface TypeToInputTypeAssociation {
  [objectTypeName: string]: string[]
}

export function fieldsFromModelDefinition(modelDef: Types): ModelField[] {
  // If model is of type `interface InterfaceName { ... }`
  if (modelDef.kind === 'InterfaceDefinition') {
    const interfaceDef = modelDef as InterfaceDefinition

    return interfaceDef.fields.map(field => {
      return {
        fieldName: field.name,
        fieldOptional: field.optional,
      }
    })
  }
  // If model is of type `type TypeName = { ... }`
  if (
    modelDef.kind === 'TypeAliasDefinition' &&
    (modelDef as TypeAliasDefinition).type.kind ===
      'AnonymousInterfaceAnnotation'
  ) {
    const interfaceDef = (modelDef as TypeAliasDefinition)
      .type as AnonymousInterfaceAnnotation

    return interfaceDef.fields.map(field => {
      return {
        fieldName: field.name,
        fieldOptional: field.optional,
      }
    })
  }

  return []
}

export function renderDefaultResolvers(
  graphQLTypeObject: GraphQLTypeObject,
  modelMap: ModelMap,
  variableName: string,
): string {
  const model = modelMap[graphQLTypeObject.name]

  if (model === undefined) {
    return `export const ${variableName} = {}`
  }

  const modelDef = model.definition

  return `export const ${variableName} = {
    ${fieldsFromModelDefinition(modelDef)
      .filter(modelField =>
        shouldRenderDefaultResolver(graphQLTypeObject, modelField),
      )
      .map(modelField =>
        renderDefaultResolver(
          modelField.fieldName,
          modelField.fieldOptional,
          model.definition.name,
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
    return `${fieldGetter} === undefined ? null : ${fieldGetter}`
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

  return model.definition.name
}

function shouldRenderDefaultResolver(
  graphQLType: GraphQLTypeObject,
  modelField: ModelField,
) {
  const graphQLField = graphQLType.fields.find(
    field => field.name === modelField.fieldName,
  )

  if (!graphQLField) {
    return false
  }

  return !(modelField.fieldOptional && graphQLField.type.isRequired)
}

export function shouldScaffoldFieldResolver(
  graphQLField: GraphQLTypeField,
  modelFields: ModelField[],
): boolean {
  const modelField = modelFields.find(
    modelField => modelField.fieldName === graphQLField.name,
  )

  if (!modelField) {
    return true
  }

  return modelField.fieldOptional && graphQLField.type.isRequired
}

export function printFieldLikeType(
  field: GraphQLTypeField,
  modelMap: ModelMap,
) {
  if (field.type.isScalar) {
    return `${getTypeFromGraphQLType(field.type.name)}${
      field.type.isArray ? '[]' : ''
    }${!field.type.isRequired ? '| null' : ''}`
  }

  if (field.type.isInput || field.type.isEnum) {
    return `${field.type.name}${field.type.isArray ? '[]' : ''}${
      !field.type.isRequired ? '| null' : ''
    }`
  }

  return `${getModelName(field.type, modelMap)}${
    field.type.isArray ? '[]' : ''
  }${!field.type.isRequired ? '| null' : ''}`
}

export function getTypeFromGraphQLType(
  type: string,
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

function deepResolveInputTypes(
  inputTypesMap: InputTypesMap,
  typeName: string,
  seen: { [k: string]: boolean } = {},
): string[] {
  const type = inputTypesMap[typeName]
  if (type) {
    const childTypes = type.fields
      .filter(t => t.type.isInput && !seen[type.name])
      .map(t => t.type.name)
      .map(name =>
        deepResolveInputTypes(inputTypesMap, name, { ...seen, [name]: true }),
      )
      .reduce(flatten, [])
    return [typeName, ...childTypes]
  } else {
    throw new Error(`Input type ${typeName} not found`)
  }
}

export function getDistinctInputTypes(
  type: GraphQLTypeObject,
  typeToInputTypeAssociation: TypeToInputTypeAssociation,
  inputTypesMap: InputTypesMap,
) {
  return typeToInputTypeAssociation[type.name]
    .map(t => deepResolveInputTypes(inputTypesMap, t))
    .reduce(flatten, [])
    .filter(uniq)
}

export function renderEnums(args: GenerateArgs): string {
  return args.enums
    .map(enumObject => {
      return `type ${enumObject.name} = ${enumObject.values
        .map(value => `'${value}'`)
        .join(' | ')}`
    })
    .join(os.EOL)
}
