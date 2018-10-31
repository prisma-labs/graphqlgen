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
  types: GraphQLTypeObject[],
  unions: GraphQLUnionObject[],
  enums: GraphQLEnumObject[],
}

/** Converts typeDefs, e.g. the raw SDL string, into our `GraphQLTypes`. */
export function extractTypes(typeDefs: string): GraphQLTypes {
  const schema = buildASTSchema(parse(typeDefs));
  const types = extractGraphQLTypes(schema)
  const unions = extractGraphQLUnions(schema)
  const enums = extractGraphQLEnums(schema)
  return { types, enums, unions }
}

type GraphQLTypeDefinition = {
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
  isRequired: boolean
}

type GraphQLTypeArgument = {
  name: string
  type: GraphQLType
}

export type GraphQLTypeField = {
  name: string
  type: GraphQLType
  arguments: GraphQLTypeArgument[]
}

export type GraphQLTypeObject = {
  name: string
  type: GraphQLTypeDefinition
  fields: GraphQLTypeField[]
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

function extractTypeLike(
  schema: GraphQLSchema,
  type: GraphQLInputType | GraphQLOutputType,
): GraphQLType {
  const typeLike: GraphQLType = {} as GraphQLType
  if (type instanceof GraphQLNonNull) {
    typeLike.isRequired = true
    type = (type as GraphQLNonNull<any>).ofType
  }
  if (type instanceof GraphQLList) {
    typeLike.isArray = true
    type = (type as GraphQLList<any>).ofType
  }
  if (type instanceof GraphQLObjectType
    || type instanceof GraphQLInterfaceType
    || type instanceof GraphQLEnumType
    || type instanceof GraphQLUnionType
    || type instanceof GraphQLInputObjectType
    || type instanceof GraphQLScalarType
  ) {
    typeLike.name = type.name
  }
  const typeDefinitionLike = extractTypeDefinition(schema, typeLike)
  return {
    ...typeLike,
    ...typeDefinitionLike,
  }
}

function extractTypeFieldsFromObjectType(schema: GraphQLSchema, node: GraphQLObjectType) {
  const fields: GraphQLTypeField[] = []
  Object.values(node.getFields()).forEach((fieldNode: GraphQLField<any, any>) => {
    const fieldType: GraphQLType = extractTypeLike(schema, fieldNode.type)
    const fieldArguments: GraphQLTypeArgument[] = []
    fieldNode.args.forEach((arg: GraphQLArgument) => {
      fieldArguments.push({
        name: arg.name,
        type: extractTypeLike(schema, arg.type),
      })
    })
    fields.push({
      name: fieldNode.name,
      type: fieldType,
      arguments: fieldArguments,
    })
  })
  return fields
}

function extractTypeFieldsFromInputType(schema: GraphQLSchema, node: GraphQLInputObjectType) {
  const fields: GraphQLTypeField[] = []
  Object.values(node.getFields()).forEach((input: GraphQLInputField) => {
    fields.push({
      name: input.name,
      type: extractTypeLike(schema, input.type),
      arguments: [],
    })
  })
  return fields
}

function extractGraphQLTypes(schema: GraphQLSchema) {
  const types: GraphQLTypeObject[] = []
  Object.values(schema.getTypeMap()).forEach((node: GraphQLNamedType) => {
    // Ignore meta types like __Schema and __TypeKind
    if (node.name.startsWith("__")) {
      return;
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
        fields: [] // extractTypeFields(schema, node),
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
  Object.values(schema.getTypeMap()).forEach((node: GraphQLNamedType) => {
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

const graphqlToTypescript: { [key: string]: string } = {
  String: 'string',
  Boolean: 'boolean',
  ID: 'string',
  Int: 'number',
  Float: 'number',
}

export function graphQLToTypecriptType(type: GraphQLType): string {
  let typescriptType = type.isScalar ? graphqlToTypescript[type.name] : 'any'
  if (type.isArray) {
    typescriptType += '[]'
  }
  if (!type.isRequired) {
    typescriptType += ' | null'
  }
  return typescriptType
}

export function extractGraphQLTypesWithoutRootsAndInputs(
  schema: GraphQLTypes,
): GraphQLTypeObject[] {
  return schema.types
    .filter(type => !type.type.isInput)
    .filter(
      type => ['Query', 'Mutation', 'Subscription'].indexOf(type.name) === -1,
    )
}
