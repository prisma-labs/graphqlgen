#!/usr/bin/env node

// TODO: Write snapshot tests
// TODO: Split code to separate files
// TODO: Extract template from code as we can easily support multiple languages
// once GraphQL types are "extracted". This does not have to be hardcoded to TS.
import * as yargs from "yargs";
import {
  parse,
  visit,
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  NamedTypeNode,
  NonNullTypeNode,
  ListTypeNode,
  InputValueDefinitionNode
} from "graphql";
import * as fs from "fs";
import * as os from "os";
import * as capitalize from "capitalize";
import * as chalk from "chalk";
import * as prettier from "prettier";

type CLIArgs = {
  schema: string;
  output: string;
};

// TODO: Seek feedback on the names on internal AST
// representation types for GraphQL

// TODO: This structure assumes one type for field/argument and does not account for union etc yet
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

type GraphQLTypeObject = {
  name: string;
  fields: [GraphQLTypeField];
};

const GraphQLScalarTypeArray = [
  "Boolean",
  "Int",
  "Float",
  "String",
  "ID",
  "DateTime"
];
type GraphQLScalarType =
  | "Boolean"
  | "Float"
  | "Int"
  | "String"
  | "ID"
  | "DateTime";
type TSGraphQLScalarType = "boolean" | "number" | "string";

function getTSTypeFromGraphQLType(
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

function generateCode(args: CLIArgs) {
  // TODO: Check if schema exists

  // TODO: Error handling around read
  // TODO: Add support for graphql-import
  const schema = fs.readFileSync(args.schema, "utf-8");

  // TODO: Error handling around parse
  const parsedSchema = parse(schema);

  const types: GraphQLTypeObject[] = [];
  visit(parsedSchema, {
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

  // TODO: Handle field type in case of ID
  // TODO: Handle input object types
  const code = `
import { GraphQLResolveInfo } from 'graphql'

export interface ResolverFn<Root, Args, Ctx, Payload> {
  (root: Root, args: Args, ctx: Ctx, info: GraphQLResolveInfo):
    | Payload
    | Promise<Payload>
}

export interface ITypes {
Context: any
${types.map(type => `   ${type.name}Root: any`).join(os.EOL)}
}

  ${types
    .map(
      type => `export namespace I${type.name} {
  ${type.fields
    .map(
      field => `

  ${
    field.arguments.length > 0
      ? `export interface Args${capitalize(field.name)} {
      ${field.arguments
        .map(
          arg =>
            `${arg.name}: ${
              GraphQLScalarTypeArray.indexOf(arg.type.name) > -1
                ? getTSTypeFromGraphQLType(arg.type.name as GraphQLScalarType)
                : `T['${field.type.name}Root']`
            }${field.type.isArray ? "[]" : ""}`
        )
        .join(os.EOL)}
    }`
      : ""
  }

  export type ${capitalize(field.name)}Resolver<T extends ITypes> = ResolverFn<
    T['${type.name}Root'],
    {},
    T['Context'],
    ${
      GraphQLScalarTypeArray.indexOf(field.type.name) > -1
        ? getTSTypeFromGraphQLType(field.type.name as GraphQLScalarType)
        : `T['${field.type.name}Root']`
    }${field.type.isArray ? "[]" : ""}
  >
  `
    )
    .join(os.EOL)}

  export interface Resolver<T extends ITypes> {
  ${type.fields
    .map(field => `   ${field.name}: ${capitalize(field.name)}Resolver<T>`)
    .join(os.EOL)}
  }
}
`
    )
    .join(os.EOL)}

export interface IResolvers<T extends ITypes> {
  ${types
    .map(type => `   ${type.name}: I${type.name}.Resolver<T>`)
    .join(os.EOL)}
}

  `;

  fs.writeFileSync(
    args.output,
    prettier.format(code, {
      parser: "typescript"
    }),
    {
      encoding: "utf-8"
    }
  );
  console.log(chalk.default.green(`Code generated at ${args.output}`));
  process.exit(0);
}

// TODO: Validation around input args, make invalid states
// unrepresentable
function run() {
  const argv = yargs.argv;
  const args: CLIArgs = {
    schema: argv.schema,
    output: argv.output
  };
  console.log(generateCode(args));
}

run();
