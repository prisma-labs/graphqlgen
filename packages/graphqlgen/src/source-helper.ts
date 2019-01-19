import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLField,
  GraphQLNonNull,
  GraphQLList,
  GraphQLArgument,
  GraphQLInputField,
  GraphQLInputType,
  GraphQLOutputType,
  GraphQLScalarType,
  buildASTSchema,
  parse,
} from 'graphql'

/** Our own GraphQL schema/types abstraction. */
export type GraphQLTypes = {
  types: GraphQLTypeObject[]
  unions: GraphQLUnionObject[]
  enums: GraphQLEnumObject[]
  interfaces: GraphQLInterfaceObject[]
}

/** Converts typeDefs, e.g. the raw SDL string, into our `GraphQLTypes`. */
export function extractTypes(typeDefs: string): GraphQLTypes {
  const schema = buildASTSchema(parse(typeDefs))
  const types = extractGraphQLTypes(schema)
  const unions = extractGraphQLUnions(schema)
  const enums = extractGraphQLEnums(schema)
  const interfaces = extractGraphQLInterfaces(schema, types)
  return { types, enums, unions, interfaces }
}

export type GraphQLTypeDefinition = {
  name: string
  isScalar: boolean
  isEnum: boolean
  isUnion: boolean
  isInput: boolean
  isObject: boolean
  isInterface: boolean
}

export type GraphQLType = GraphQLTypeDefinition & {
  isArray: boolean
  isArrayRequired: boolean
  isRequired: boolean
}

export type GraphQLTypeArgument = {
  name: string
  type: GraphQLType
  defaultValue?: unknown
}

export type GraphQLTypeField = {
  name: string
  type: GraphQLType
  defaultValue?: unknown
  arguments: GraphQLTypeArgument[]
}

export type GraphQLTypeObject = {
  name: string
  type: GraphQLTypeDefinition
  fields: GraphQLTypeField[]
  interfaces?: string[]
}

export type GraphQLEnumObject = {
  name: string
  type: GraphQLTypeDefinition
  values: string[]
}

export type GraphQLUnionObject = {
  name: string
  type: GraphQLTypeDefinition
  types: GraphQLTypeDefinition[]
}

export type GraphQLInterfaceObject = {
  name: string
  type: GraphQLTypeDefinition
  fields: any // TODO
  implementors: GraphQLTypeDefinition[]
}

interface FinalType {
  isRequired: boolean
  isArray: boolean
  isArrayRequired: boolean
  type: GraphQLInputType | GraphQLOutputType
}

export const GraphQLScalarTypeArray = [
  'Boolean',
  'Int',
  'Float',
  'String',
  'ID',
]
export type GraphQLScalarType = 'Boolean' | 'Float' | 'Int' | 'String' | 'ID'

function extractTypeDefinition(
  schema: GraphQLSchema,
  fromNode: GraphQLType,
): GraphQLTypeDefinition {
  let typeLike: GraphQLTypeDefinition = {
    isObject: false,
    isInput: false,
    isEnum: false,
    isUnion: false,
    isScalar: false,
    isInterface: false,
  } as GraphQLTypeDefinition
  const node = schema.getType(fromNode.name)
  if (node instanceof GraphQLObjectType) {
    typeLike.isObject = true
  } else if (node instanceof GraphQLInputObjectType) {
    typeLike.isInput = true
  } else if (node instanceof GraphQLEnumType) {
    typeLike.isEnum = true
  } else if (node instanceof GraphQLUnionType) {
    typeLike.isUnion = true
  } else if (node instanceof GraphQLScalarType) {
    typeLike.isScalar = true
  } else if (node instanceof GraphQLInterfaceType) {
    typeLike.isInterface = true
  }
  // Handle built-in scalars
  if (GraphQLScalarTypeArray.indexOf(fromNode.name) > -1) {
    typeLike.isScalar = true
  }
  return typeLike
}

const getFinalType = (
  type: GraphQLInputType | GraphQLOutputType,
  acc: FinalType = {
    isArray: false,
    isArrayRequired: false,
    isRequired: false,
    type,
  },
): FinalType => {
  if (type instanceof GraphQLNonNull) {
    acc.isRequired = true
  }
  if (type instanceof GraphQLList) {
    acc.isArray = true
    acc.isArrayRequired = acc.isRequired
    acc.isRequired = false
  }

  if (type instanceof GraphQLNonNull || type instanceof GraphQLList) {
    return getFinalType(
      (type as GraphQLNonNull<any> | GraphQLList<any>).ofType,
      acc,
    )
  }

  return {
    ...acc,
    type,
  }
}

function extractTypeLike(
  schema: GraphQLSchema,
  type: GraphQLInputType | GraphQLOutputType,
): GraphQLType {
  const typeLike: GraphQLType = {} as GraphQLType
  const {
    isArray,
    isArrayRequired,
    isRequired,
    type: finalType,
  } = getFinalType(type)
  if (isRequired) {
    typeLike.isRequired = true
  }
  if (isArray) {
    typeLike.isArray = true
  }
  if (isArrayRequired) {
    typeLike.isArrayRequired = true
  }
  if (
    finalType instanceof GraphQLObjectType ||
    finalType instanceof GraphQLInterfaceType ||
    finalType instanceof GraphQLEnumType ||
    finalType instanceof GraphQLUnionType ||
    finalType instanceof GraphQLInputObjectType ||
    finalType instanceof GraphQLScalarType
  ) {
    typeLike.name = finalType.name
  }
  const typeDefinitionLike = extractTypeDefinition(schema, typeLike)
  return {
    ...typeLike,
    ...typeDefinitionLike,
  }
}

function extractTypeFieldsFromObjectType(
  schema: GraphQLSchema,
  node: GraphQLObjectType | GraphQLInterfaceType,
) {
  const fields: GraphQLTypeField[] = []
  Object.values(node.getFields()).forEach(
    (fieldNode: GraphQLField<any, any>) => {
      const fieldType: GraphQLType = extractTypeLike(schema, fieldNode.type)
      const fieldArguments: GraphQLTypeArgument[] = []
      fieldNode.args.forEach((arg: GraphQLArgument) => {
        fieldArguments.push({
          name: arg.name,
          defaultValue: arg.defaultValue,
          type: extractTypeLike(schema, arg.type),
        })
      })
      fields.push({
        name: fieldNode.name,
        type: fieldType,
        arguments: fieldArguments,
      })
    },
  )
  return fields
}

function extractTypeFieldsFromInputType(
  schema: GraphQLSchema,
  node: GraphQLInputObjectType,
) {
  const fields: GraphQLTypeField[] = []
  Object.values(node.getFields()).forEach((input: GraphQLInputField) => {
    fields.push({
      name: input.name,
      type: extractTypeLike(schema, input.type),
      defaultValue: input.defaultValue,
      arguments: [],
    })
  })
  return fields
}

function extractGraphQLTypes(schema: GraphQLSchema): GraphQLTypeObject[] {
  const types: GraphQLTypeObject[] = []
  Object.values(schema.getTypeMap()).forEach((node: GraphQLNamedType) => {
    // Ignore meta types like __Schema and __TypeKind
    if (node.name.startsWith('__')) {
      return
    }
    if (node instanceof GraphQLEnumType) {
      types.push({
        name: node.name,
        type: {
          name: node.name,
          isObject: false,
          isInput: false,
          isEnum: true,
          isUnion: false,
          isScalar: false,
          isInterface: false,
        },
        fields: [], // extractTypeFields(schema, node),
      })
    } else if (node instanceof GraphQLObjectType) {
      types.push({
        name: node.name,
        type: {
          name: node.name,
          isObject: true,
          isInput: false,
          isEnum: false,
          isUnion: false,
          isScalar: false,
          isInterface: false,
        },
        fields: extractTypeFieldsFromObjectType(schema, node),
        interfaces: node
          .getInterfaces()
          .map(interfaceType => interfaceType.name),
      })
    } else if (node instanceof GraphQLInputObjectType) {
      types.push({
        name: node.name,
        type: {
          name: node.name,
          isObject: false,
          isInput: true,
          isEnum: false,
          isUnion: false,
          isScalar: false,
          isInterface: false,
        },
        fields: extractTypeFieldsFromInputType(schema, node),
      })
    }
  })
  return types
}

function extractGraphQLEnums(schema: GraphQLSchema) {
  const types: GraphQLEnumObject[] = []
  Object.values(schema.getTypeMap())
    .filter(
      (node: GraphQLNamedType) =>
        node.name !== '__TypeKind' && node.name !== '__DirectiveLocation',
    )
    .forEach((node: GraphQLNamedType) => {
      if (node instanceof GraphQLEnumType) {
        types.push({
          name: node.name,
          type: {
            name: node.name,
            isObject: false,
            isInput: false,
            isEnum: true,
            isUnion: false,
            isScalar: false,
            isInterface: false,
          },
          values: node.getValues().map(v => v.name),
        })
      }
    })
  return types
}

function extractGraphQLUnions(schema: GraphQLSchema) {
  const types: GraphQLUnionObject[] = []
  Object.values(schema.getTypeMap()).forEach((node: GraphQLNamedType) => {
    if (node instanceof GraphQLUnionType) {
      const unionTypes = node.getTypes().map((t: GraphQLObjectType) => {
        return extractTypeLike(schema, t)
      })
      types.push({
        name: node.name,
        type: {
          name: node.name,
          isObject: false,
          isInput: false,
          isEnum: false,
          isUnion: true,
          isScalar: false,
          isInterface: false,
        },
        types: unionTypes,
      })
    }
  })
  return types
}

function extractGraphQLInterfaces(
  schema: GraphQLSchema,
  types: GraphQLTypeObject[],
): GraphQLInterfaceObject[] {
  const typesUsingInterfaces = types.filter(
    type => type.interfaces !== undefined,
  )

  return Object.values(schema.getTypeMap())
    .filter(node => node instanceof GraphQLInterfaceType)
    .reduce(
      (interfaces, node) => {
        node = node as GraphQLInterfaceType

        const implementorTypes = typesUsingInterfaces
          .filter(type => type.interfaces!.includes(node.name))
          .map(type => type.type)

        interfaces.push({
          name: node.name,
          type: {
            name: node.name,
            isObject: false,
            isInput: false,
            isEnum: false,
            isUnion: false,
            isScalar: false,
            isInterface: true,
          },
          implementors: implementorTypes,
          fields: extractTypeFieldsFromObjectType(schema, node),
        })

        return interfaces
      },
      [] as GraphQLInterfaceObject[],
    )
}

const graphqlToTypescriptFlow: { [key: string]: string } = {
  String: 'string',
  Boolean: 'boolean',
  ID: 'string',
  Int: 'number',
  Float: 'number',
  DateTime: 'string',
}

export function graphQLToTypecriptFlowType(type: GraphQLType): string {
  let typescriptType = graphqlToTypescriptFlow[type.name]

  if (typescriptType === undefined) {
    typescriptType = 'any'
  }

  if (type.isArray) {
    typescriptType += '[]'
  }
  if (!type.isRequired) {
    typescriptType += ' | null'
  }
  return typescriptType
}

export function extractGraphQLTypesWithoutRootsAndInputsAndEnums(
  schema: GraphQLTypes,
): GraphQLTypeObject[] {
  return schema.types
    .filter(type => !type.type.isInput)
    .filter(type => !type.type.isEnum)
    .filter(
      type => ['Query', 'Mutation', 'Subscription'].indexOf(type.name) === -1,
    )
}

export function getGraphQLEnumValues(
  enumField: GraphQLTypeField,
  graphQLEnumObjects: GraphQLEnumObject[],
): string[] {
  if (!enumField.type.isEnum) {
    return []
  }

  const graphQLEnumObject = graphQLEnumObjects.find(
    graphqlEnum => graphqlEnum.name === enumField.type.name,
  )

  if (!graphQLEnumObject) {
    return []
  }

  return graphQLEnumObject.values
}
