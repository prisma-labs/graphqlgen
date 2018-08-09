#!/usr/bin/env node

import * as yargs from "yargs";
import { parse, DocumentNode } from "graphql";
import * as fs from "fs";
import * as chalk from "chalk";
import * as prettier from "prettier";
import { GraphQLTypeObject, extractGraphQLTypes } from "./source-helper";
import { resolve } from "path";
import { generate } from "./generators/ts-generator";

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
  const code = generate(types);

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
  try {
    fs.writeFileSync(args.output, code, { encoding: "utf-8" });
  } catch (e) {
    console.error(
      chalk.default.red(
        `Failed to write the file at ${args.output}, error: ${e}`
      )
    );
  }
  console.log(chalk.default.green(`Code generated at ${args.output}`));
  process.exit(0);
}

// Only call run when running from CLI, not when included for tests
if (require.main === module) {
  run();
}
