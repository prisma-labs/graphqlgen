import * as os from 'os'

import {
  GraphQLTypeObject,
  GraphQLType,
  GraphQLTypeField,
  getGraphQLEnumValues,
} from '../source-helper'
import { ModelMap, ContextDefinition, GenerateArgs, Model } from '../types'
import {
  TypeDefinition,
  FieldDefinition,
  InterfaceDefinition,
  TypeAliasDefinition,
  AnonymousInterfaceAnnotation,
} from '../introspection/types'
import {
  isFieldDefinitionEnumOrLiteral,
  getEnumValues,
} from '../introspection/utils'

type SpecificGraphQLScalarType = 'boolean' | 'number' | 'string'

export interface InputTypesMap {
  [inputTypeName: string]: GraphQLTypeObject
}

export interface TypeToInputTypeAssociation {
  [objectTypeName: string]: string[]
}

export function fieldsFromModelDefinition(
  modelDef: TypeDefinition,
): FieldDefinition[] {
  // If model is of type `interface InterfaceName { ... }`
  if (modelDef.kind === 'InterfaceDefinition') {
    const interfaceDef = modelDef as InterfaceDefinition

    return interfaceDef.fields
  }
  // If model is of type `type TypeName = { ... }`
  if (
    modelDef.kind === 'TypeAliasDefinition' &&
    (modelDef as TypeAliasDefinition).getType().kind ===
      'AnonymousInterfaceAnnotation'
  ) {
    const interfaceDef = (modelDef as TypeAliasDefinition).getType() as AnonymousInterfaceAnnotation

    return interfaceDef.fields
  }

  return []
}

export function renderDefaultResolvers(
  graphQLTypeObject: GraphQLTypeObject,
  args: GenerateArgs,
  variableName: string,
): string {
  const model = args.modelMap[graphQLTypeObject.name]

  if (model === undefined) {
    return `export const ${variableName} = {}`
  }

  const modelDef = model.definition

  return `export const ${variableName} = {
    ${fieldsFromModelDefinition(modelDef)
      .filter(modelField => {
        const graphQLField = graphQLTypeObject.fields.find(
          field => field.name === modelField.name,
        )

        return shouldRenderDefaultResolver(graphQLField, modelField, args)
      })
      .map(modelField =>
        renderDefaultResolver(
          modelField.name,
          modelField.optional,
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

export function getModelName(
  type: GraphQLType,
  modelMap: ModelMap,
  emptyType: string = '{}',
): string {
  const model = modelMap[type.name]

  if (type.isEnum) {
    return type.name
  }

  // NOTE if no model is found, return the empty type
  // It's usually assumed that every GraphQL type has a model associated
  // expect for the `Query`, `Mutation` and `Subscription` type
  if (model === undefined) {
    return emptyType
  }

  return model.definition.name
}

function isModelEnumSubsetOfGraphQLEnum(
  graphQLEnumValues: string[],
  modelEnumValues: string[],
) {
  return modelEnumValues.every(enumValue =>
    graphQLEnumValues.includes(enumValue),
  )
}

function shouldRenderDefaultResolver(
  graphQLField: GraphQLTypeField | undefined,
  modelField: FieldDefinition | undefined,
  args: GenerateArgs,
) {
  if (graphQLField === undefined) {
    return false
  }

  if (modelField === undefined) {
    return false
  }

  const modelFieldType = modelField.getType()

  // If both types are enums, and model definition enum is a subset of the graphql enum
  // Then render as defaultResolver
  // eg: given GraphQLEnum = 'A' | 'B' | 'C'
  // render when FieldDefinition = ('A') | ('A' | 'B') | ('A | 'B' | 'C')
  if (
    graphQLField.type.isEnum &&
    isFieldDefinitionEnumOrLiteral(modelFieldType)
  ) {
    return isModelEnumSubsetOfGraphQLEnum(
      getGraphQLEnumValues(graphQLField, args.enums),
      getEnumValues(modelFieldType),
    )
  }

  return !(modelField.optional && graphQLField.type.isRequired)
}

export function shouldScaffoldFieldResolver(
  graphQLField: GraphQLTypeField,
  modelFields: FieldDefinition[],
  args: GenerateArgs,
): boolean {
  const modelField = modelFields.find(
    modelField => modelField.name === graphQLField.name,
  )

  return !shouldRenderDefaultResolver(graphQLField, modelField, args)
}

const voidable = (type: string): string => {
  return `${type} | null | undefined`
}

const nullable = (type: string): string => {
  return `${type} | null`
}

export const printFieldLikeType = (
  field: GraphQLTypeField,
  modelMap: ModelMap,
): string => {
  const name = field.type.isScalar
    ? getTypeFromGraphQLType(field.type.name)
    : field.type.isInput || field.type.isEnum
    ? field.type.name
    : getModelName(field.type, modelMap)

  if (field.type.isArray) {
    // A void array member is not possible
    const innerTypeRendering = field.type.isRequired ? name : nullable(name)

    const typeRendering = field.type.isArrayRequired
      ? `Array<${innerTypeRendering}>`
      : field.defaultValue === null
      ? nullable(`Array<${innerTypeRendering}>`)
      : field.defaultValue === undefined
      ? voidable(`Array<${innerTypeRendering}>`)
      : // field.defaultValue has has been set to non-null in the schema
        `Array<${innerTypeRendering}>`

    return typeRendering
  } else {
    const typeRendering = field.type.isRequired
      ? name
      : field.defaultValue === null
      ? nullable(name)
      : field.defaultValue === undefined
      ? voidable(name)
      : // field.defaultValue has has been set to non-null in the schema
        name

    return typeRendering
  }
}

export function printFieldLikeFlowType(
  field: GraphQLTypeField,
  modelMap: ModelMap,
) {
  const name = field.type.isScalar
    ? getTypeFromGraphQLType(field.type.name)
    : field.type.isInput || field.type.isEnum
    ? field.type.name
    : getModelName(field.type, modelMap)

  const isRequired = field.type.isArray
    ? field.type.isArrayRequired
    : field.type.isRequired

  const suffix = isRequired
    ? ''
    : field.defaultValue === null
    ? ' | null'
    : field.defaultValue === undefined
    ? ' | null | void'
    : ''

  const type = field.type.isArray
    ? name + (field.type.isRequired ? '' : ' | null | void')
    : name + suffix

  return field.type.isArray ? `Array<${type}>${suffix}` : type
}

export function printFieldLikeReturnType(
  field: GraphQLTypeField,
  modelMap: ModelMap,
) {
  const name = field.type.isScalar
    ? getTypeFromGraphQLType(field.type.name)
    : field.type.isInput || field.type.isEnum
    ? field.type.name
    : getModelName(field.type, modelMap)

  const isRequired = field.type.isArray
    ? field.type.isArrayRequired
    : field.type.isRequired

  const suffix = isRequired
    ? ''
    : field.defaultValue === null
    ? ' | null'
    : field.defaultValue === undefined
    ? ' | null'
    : ''

  const type = field.type.isArray
    ? name + (field.type.isRequired ? '' : ' | null')
    : name + suffix

  return field.type.isArray ? `Array<${type}>${suffix}` : type
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

export const getDistinctInputTypes = (
  type: GraphQLTypeObject,
  typeToInputTypeAssociation: TypeToInputTypeAssociation,
  inputTypesMap: InputTypesMap,
) => {
  const inputTypes: GraphQLTypeObject[] = []
  const seen: Record<string, boolean> = {}
  const inputTypeNames: string[] = []
  const see = (typeName: string): void => {
    if (!seen[typeName]) {
      seen[typeName] = true
      inputTypes.push(inputTypesMap[typeName])
    }
  }

  typeToInputTypeAssociation[type.name].forEach(see)

  for (const inputType of inputTypes) {
    inputTypeNames.push(inputType.type.name)

    // Keep seeing (aka. traversing the tree) until we've seen everything.
    for (const field of inputType.fields) {
      if (field.type.isInput) {
        see(field.type.name)
      }
    }
  }

  return inputTypeNames
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

export function isParentType(name: string) {
  const parentTypes = ['Query', 'Mutation', 'Subscription']

  return parentTypes.indexOf(name) > -1
}

export function groupModelsNameByImportPath(models: Model[]) {
  return models.reduce<{ [importPath: string]: string[] }>((acc, model) => {
    if (acc[model.importPathRelativeToOutput] === undefined) {
      acc[model.importPathRelativeToOutput] = []
    }

    acc[model.importPathRelativeToOutput].push(model.definition.name)

    return acc
  }, {})
}
