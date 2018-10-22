import {
  visit,
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  NamedTypeNode,
  InputValueDefinitionNode,
  DocumentNode,
  EnumTypeDefinitionNode,
  EnumValueDefinitionNode,
  UnionTypeDefinitionNode,
  ScalarTypeDefinitionNode,
  InterfaceTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql'

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
  types: GraphQLTypeObject[]
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
  schema: DocumentNode,
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
  visit(schema, {
    ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
      if (fromNode.name === node.name.value) {
        typeLike.isObject = true
      }
    },
    InputObjectTypeDefinition(node: InputObjectTypeDefinitionNode) {
      if (fromNode.name === node.name.value) {
        typeLike.isInput = true
      }
    },
    EnumTypeDefinition(node: EnumTypeDefinitionNode) {
      if (fromNode.name === node.name.value) {
        typeLike.isEnum = true
      }
    },
    UnionTypeDefinition(node: UnionTypeDefinitionNode) {
      if (fromNode.name === node.name.value) {
        typeLike.isUnion = true
      }
    },
    ScalarTypeDefinition(node: ScalarTypeDefinitionNode) {
      if (fromNode.name === node.name.value) {
        typeLike.isScalar = true
      }
    },
    InterfaceTypeDefinition(node: InterfaceTypeDefinitionNode) {
      if (fromNode.name === node.name.value) {
        typeLike.isInterface = true
      }
    },
  })
  // Handle built-in scalars
  if (GraphQLScalarTypeArray.indexOf(fromNode.name) > -1) {
    typeLike.isScalar = true
  }
  return typeLike
}

function extractTypeLike(
  schema: DocumentNode,
  node: FieldDefinitionNode | InputValueDefinitionNode,
) {
  const typeLike: GraphQLType = {} as GraphQLType
  visit(node.type, {
    NonNullType() {
      typeLike.isRequired = true
    },
    ListType() {
      typeLike.isArray = true
    },
    NamedType(namedTypeNode: NamedTypeNode) {
      typeLike.name = namedTypeNode.name.value
    },
  })

  const typeDefinitionLike = extractTypeDefinition(schema, typeLike)

  return {
    ...typeLike,
    ...typeDefinitionLike,
  }
}

function extractTypeFields(
  schema: DocumentNode,
  node:
    | ObjectTypeDefinitionNode
    | InputObjectTypeDefinitionNode
    | EnumTypeDefinitionNode,
) {
  const fields: GraphQLTypeField[] = []
  if (node.kind === 'ObjectTypeDefinition') {
    visit(node, {
      FieldDefinition(fieldNode: FieldDefinitionNode) {
        const fieldType: GraphQLType = extractTypeLike(schema, fieldNode)

        const fieldArguments: GraphQLTypeArgument[] = []
        visit(fieldNode, {
          InputValueDefinition(
            inputValueDefinitionNode: InputValueDefinitionNode,
          ) {
            const argumentType: GraphQLType = extractTypeLike(
              schema,
              inputValueDefinitionNode,
            )

            fieldArguments.push({
              name: inputValueDefinitionNode.name.value,
              type: argumentType,
            })
          },
        })

        fields.push({
          name: fieldNode.name.value,
          type: fieldType,
          arguments: fieldArguments,
        })
      },
    })
  } else {
    // Is input type based on current code/types!
    visit(node, {
      InputValueDefinition(inputValueDefinitionNode: InputValueDefinitionNode) {
        const argumentType: GraphQLType = extractTypeLike(
          schema,
          inputValueDefinitionNode,
        )

        fields.push({
          name: inputValueDefinitionNode.name.value,
          type: argumentType,
          arguments: [],
        })
      },
    })
  }

  return fields
}

export function extractGraphQLTypes(schema: DocumentNode) {
  const types: GraphQLTypeObject[] = []
  visit(schema, {
    EnumTypeDefinition(node: EnumTypeDefinitionNode) {
      const fields: GraphQLTypeField[] = extractTypeFields(schema, node)
      types.push({
        name: node.name.value,
        type: {
          name: node.name.value,
          isObject: false,
          isInput: false,
          isEnum: true,
          isUnion: false,
          isScalar: false,
          isInterface: false,
        },
        fields: fields,
      })
    },
    ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
      const fields: GraphQLTypeField[] = extractTypeFields(schema, node)
      types.push({
        name: node.name.value,
        type: {
          name: node.name.value,
          isObject: true,
          isInput: false,
          isEnum: false,
          isUnion: false,
          isScalar: false,
          isInterface: false,
        },
        fields: fields,
      })
    },
    InputObjectTypeDefinition(node: InputObjectTypeDefinitionNode) {
      const fields: GraphQLTypeField[] = extractTypeFields(schema, node)
      types.push({
        name: node.name.value,
        type: {
          name: node.name.value,
          isObject: false,
          isInput: true,
          isEnum: false,
          isUnion: false,
          isScalar: false,
          isInterface: false,
        },
        fields: fields,
      })
    },
  })
  return types
}

function extractEnumValues(node: EnumTypeDefinitionNode) {
  const values: string[] = []
  visit(node, {
    EnumValueDefinition(node: EnumValueDefinitionNode) {
      values.push(node.name.value)
    },
  })
  return values
}

export function extractGraphQLEnums(schema: DocumentNode) {
  const types: GraphQLEnumObject[] = []
  visit(schema, {
    EnumTypeDefinition(node: EnumTypeDefinitionNode) {
      const values: string[] = extractEnumValues(node)
      types.push({
        name: node.name.value,
        type: {
          name: node.name.value,
          isObject: false,
          isInput: false,
          isEnum: true,
          isUnion: false,
          isScalar: false,
          isInterface: false,
        },
        values: values,
      })
    },
  })
  return types
}

function extractUnionTypes(
  node: UnionTypeDefinitionNode,
  types: GraphQLTypeObject[],
) {
  const unionTypesStrings: string[] = []
  visit(node, {
    NamedType(node: NamedTypeNode) {
      unionTypesStrings.push(node.name.value)
    },
  })
  return types.filter(type => unionTypesStrings.indexOf(type.name) > -1)
}

export function extractGraphQLUnions(schema: DocumentNode) {
  const types: GraphQLUnionObject[] = []
  visit(schema, {
    UnionTypeDefinition(node: UnionTypeDefinitionNode) {
      const allTypes: GraphQLTypeObject[] = extractGraphQLTypes(schema)
      const unionTypes: GraphQLTypeObject[] = extractUnionTypes(node, allTypes)
      types.push({
        name: node.name.value,
        type: {
          name: node.name.value,
          isObject: false,
          isInput: false,
          isEnum: false,
          isUnion: true,
          isScalar: false,
          isInterface: false,
        },
        types: unionTypes,
      })
    },
  })
  return types
}

export function graphQLToTypecriptType(type: GraphQLType): string {
  const graphqlToTypescript: { [key: string]: string } = {
    String: 'string',
    Boolean: 'boolean',
    ID: 'string',
    Int: 'number',
    Float: 'number',
  }

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
  schema: DocumentNode,
): GraphQLTypeObject[] {
  return extractGraphQLTypes(schema)
    .filter(type => !type.type.isInput)
    .filter(
      type => ['Query', 'Mutation', 'Subscription'].indexOf(type.name) === -1,
    )
}
