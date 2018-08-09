import {
  visit,
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  NamedTypeNode,
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
  return "string";
}

function extractTypeLike(node: FieldDefinitionNode | InputValueDefinitionNode) {
  const typeLike: GraphQLType = {} as any;
  visit(node.type, {
    NonNullType() {
      typeLike.isRequired = true;
    },
    ListType() {
      typeLike.isArray = true;
    },
    NamedType(namedTypeNode: NamedTypeNode) {
      typeLike.name = namedTypeNode.name.value;
    }
  });
  return typeLike;
}

function extractTypeFields(node: ObjectTypeDefinitionNode) {
  const fields: GraphQLTypeField[] = [];
  visit(node.fields, {
    FieldDefinition(fieldNode: FieldDefinitionNode) {
      const fieldType: GraphQLType = extractTypeLike(fieldNode);

      const fieldArguments: GraphQLTypeArgument[] = [] as any;
      visit(fieldNode.arguments, {
        InputValueDefinition(
          inputValueDefinitionNode: InputValueDefinitionNode
        ) {
          const argumentType: GraphQLType = extractTypeLike(
            inputValueDefinitionNode
          );

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
  return fields;
}

export function extractGraphQLTypes(schema: DocumentNode) {
  const types: GraphQLTypeObject[] = [];
  visit(schema, {
    ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
      const fields: GraphQLTypeField[] = extractTypeFields(node);
      types.push({
        name: node.name.value,
        fields: fields
      } as GraphQLTypeObject);
    }
  });
  return types;
}
