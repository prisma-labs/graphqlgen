import * as os from 'os'

import {
  GraphQLTypeObject,
  GraphQLTypeField,
  getGraphQLEnumValues,
  GraphQLTypeDefinition,
} from '../source-helper'
import { ModelMap, ContextDefinition, GenerateArgs, Model } from '../types'
import { flatten, uniq } from '../utils'
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

export interface InterfacesMap {
  [interfaceName: string]: GraphQLTypeDefinition[]
}

export interface UnionsMap {
  [unionName: string]: GraphQLTypeDefinition[]
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
  type: GraphQLTypeDefinition,
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

export function printFieldLikeType(
  field: GraphQLTypeField,
  modelMap: ModelMap,
  interfacesMap: InterfacesMap,
  unionsMap: UnionsMap,
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

  if (field.type.isInterface) {
    let types = interfacesMap[field.type.name]
      .map(type => getModelName(type, modelMap))
      .filter(uniq)
      .join(' | ')
    if (field.type.isArray) {
      types = `Array<${types}>`
    }
    return `${types}${!field.type.isRequired ? '| null' : ''}`
  }

  if (field.type.isUnion) {
    let types = unionsMap[field.type.name]
      .map(type => getModelName(type, modelMap))
      .filter(uniq)
      .join(' | ')
    if (field.type.isArray) {
      types = `Array<${types}>`
    }
    return `${types}${!field.type.isRequired ? '| null' : ''}`
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
      .filter(t => t.type.isInput && !seen[t.type.name])
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

export function isParentType(name: string) {
  const parentTypes = ['Query', 'Mutation', 'Subscription']

  return parentTypes.indexOf(name) > -1
}

export function groupModelsNameByImportPath(models: Model[]) {
  return models.reduce<{ [importPath: string]: string[] }>((acc, model) => {
    const fileModels = acc[model.importPathRelativeToOutput] || []

    if (fileModels.indexOf(model.definition.name) === -1) {
      fileModels.push(model.definition.name)
    }

    acc[model.importPathRelativeToOutput] = fileModels

    return acc
  }, {})
}
