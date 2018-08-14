import {
  visit,
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  NamedTypeNode,
  InputValueDefinitionNode,
  DocumentNode,
  EnumTypeDefinitionNode,
  EnumValueDefinitionNode,
  UnionTypeDefinitionNode
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

export type GraphQLTypeField = {
  name: string;
  type: GraphQLType;
  arguments: [GraphQLTypeArgument];
};

export type GraphQLTypeObject = {
  name: string;
  fields: [GraphQLTypeField];
};

export type GraphQLEnumObject = {
  name: string;
  values: [string];
};

export type GraphQLUnionObject = {
  name: string;
  types: [GraphQLTypeObject];
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
  visit(node, {
    FieldDefinition(fieldNode: FieldDefinitionNode) {
      const fieldType: GraphQLType = extractTypeLike(fieldNode);

      const fieldArguments: GraphQLTypeArgument[] = [];
      visit(fieldNode, {
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

function extractEnumValues(node: EnumTypeDefinitionNode) {
  const values: string[] = [];
  visit(node, {
    EnumValueDefinition(node: EnumValueDefinitionNode) {
      values.push(node.name.value);
    }
  });
  return values;
}

export function extractGraphQLEnums(schema: DocumentNode) {
  const types: GraphQLEnumObject[] = [];
  visit(schema, {
    EnumTypeDefinition(node: EnumTypeDefinitionNode) {
      const values: string[] = extractEnumValues(node);
      types.push({
        name: node.name.value,
        values: values
      } as GraphQLEnumObject);
    }
  });
  return types;
}

function extractUnionTypes(
  node: UnionTypeDefinitionNode,
  types: GraphQLTypeObject[]
) {
  const unionTypesStrings: string[] = [];
  visit(node, {
    NamedType(node: NamedTypeNode) {
      unionTypesStrings.push(node.name.value);
    }
  });
  return types.filter(type => unionTypesStrings.indexOf(type.name) > -1);
}

export function extractGraphQLUnions(schema: DocumentNode) {
  const types: GraphQLUnionObject[] = [];
  visit(schema, {
    UnionTypeDefinition(node: UnionTypeDefinitionNode) {
      const allTypes: GraphQLTypeObject[] = extractGraphQLTypes(schema);
      const unionTypes: GraphQLTypeObject[] = extractUnionTypes(node, allTypes);
      types.push({
        name: node.name.value,
        types: unionTypes
      } as GraphQLUnionObject);
    }
  });
  return types;
}
