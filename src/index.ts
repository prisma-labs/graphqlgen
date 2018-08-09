#!/usr/bin/env node

import * as yargs from "yargs";
import { parse, DocumentNode } from "graphql";
import * as fs from "fs";
import * as os from "os";
import * as capitalize from "capitalize";
import * as chalk from "chalk";
import * as prettier from "prettier";
import {
  GraphQLTypeObject,
  GraphQLScalarTypeArray,
  GraphQLScalarType,
  getTSTypeFromGraphQLType,
  extractGraphQLTypes
} from "./source-helper";
import { join, resolve } from "path";

type CLIArgs = {
  schemaPath: string;
  output: string;
};

export type GenerateCodeArgs = {
  schema: DocumentNode;
  prettify?: boolean;
};

export function generateCode({
  schema = undefined,
  prettify = true
}: GenerateCodeArgs): string {
  if (!schema) {
    console.error(chalk.default.red(`Please provide a parsed GraphQL schema`));
  }

  const types: GraphQLTypeObject[] = extractGraphQLTypes(schema);

  // TODO: Handle input object types, enum, union
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

  if (prettify) {
    return prettier.format(code, {
      parser: "typescript"
    });
  } else {
    return code;
  }
}

// TODO: Validation around input args, make invalid states
// unrepresentable
function run() {
  const argv = yargs.argv;
  const args: CLIArgs = {
    schemaPath: resolve(argv.schemaPath),
    output: argv.output
  };

  if (!fs.existsSync(args.schemaPath)) {
    console.error(`The schema file ${args.schemaPath} does not exist`);
    process.exit(1);
  }

  // TODO: Add support for graphql-import
  let schema = undefined;
  try {
    schema = fs.readFileSync(args.schemaPath, "utf-8");
  } catch (e) {
    console.error(
      chalk.default.red(`Error occurred while reading schema: ${e}`)
    );
    process.exit(1);
  }

  let parsedSchema = undefined;
  try {
    parsedSchema = parse(schema);
  } catch (e) {
    console.error(chalk.default.red(`Failed to parse schema: ${e}`));
    process.exit(1);
  }

  const code = generateCode({ schema: parsedSchema });
  fs.writeFileSync(args.output, code, { encoding: "utf-8" });
  console.log(chalk.default.green(`Code generated at ${args.output}`));
  process.exit(0);
}

// Only call run when running from CLI, not when included for tests
if (require.main === module) {
  run();
}
