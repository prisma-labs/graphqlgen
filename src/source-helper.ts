import {
  parse,
  visit,
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  NamedTypeNode,
  NonNullTypeNode,
  ListTypeNode,
  InputValueDefinitionNode,
  DocumentNode
} from "graphql";

type GraphQLType = {
  name: string;
  isArray: boolean;
  isRequired: boolean;
};

type GraphQLTypeArgument = {
  name: string;
  type: GraphQLType;
};

type GraphQLTypeField = {
  name: string;
  type: GraphQLType;
  arguments: [GraphQLTypeArgument];
};

export type GraphQLTypeObject = {
  name: string;
  fields: [GraphQLTypeField];
};

export const GraphQLScalarTypeArray = [
  "Boolean",
  "Int",
  "Float",
  "String",
  "ID",
  "DateTime"
];
export type GraphQLScalarType =
  | "Boolean"
  | "Float"
  | "Int"
  | "String"
  | "ID"
  | "DateTime";
type TSGraphQLScalarType = "boolean" | "number" | "string";

export function getTSTypeFromGraphQLType(
  type: GraphQLScalarType
): TSGraphQLScalarType {
  if (type === "Int" || type === "Float") {
    return "number";
  }
  if (type === "Boolean") {
    return "boolean";
  }
  if (type === "String" || type === "ID" || type === "DateTime") {
    return "string";
  }
}

export function extractGraphQLTypes(schema: DocumentNode) {
  const types: GraphQLTypeObject[] = [];
  visit(schema, {
    ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
      const fields: GraphQLTypeField[] = [];
      visit(node.fields, {
        FieldDefinition(fieldNode: FieldDefinitionNode) {
          const fieldType: GraphQLType = {} as any;
          visit(fieldNode.type, {
            NonNullType(nonNullTypeNode: NonNullTypeNode) {
              fieldType.isRequired = true;
            },
            ListType(listTypeNode: ListTypeNode) {
              fieldType.isArray = true;
            },
            NamedType(namedTypeNode: NamedTypeNode) {
              fieldType.name = namedTypeNode.name.value;
            }
          });

          const fieldArguments: GraphQLTypeArgument[] = [] as any;
          visit(fieldNode.arguments, {
            InputValueDefinition(
              inputValueDefinitionNode: InputValueDefinitionNode
            ) {
              const argumentType: GraphQLType = {} as any;
              visit(inputValueDefinitionNode.type, {
                NonNullType(nonNullTypeNode: NonNullTypeNode) {
                  argumentType.isRequired = true;
                },
                ListType(listTypeNode: ListTypeNode) {
                  argumentType.isArray = true;
                },
                NamedType(namedTypeNode: NamedTypeNode) {
                  argumentType.name = namedTypeNode.name.value;
                }
              });

              fieldArguments.push({
                name: inputValueDefinitionNode.name.value,
                type: argumentType
              } as GraphQLTypeArgument);
            }
          });

          fields.push({
            name: fieldNode.name.value,
            type: fieldType,
            arguments: fieldArguments
          } as GraphQLTypeField);
        }
      });

      types.push({
        name: node.name.value,
        fields: fields
      } as GraphQLTypeObject);
    }
  });
  return types;
}
