#!/usr/bin/env node

import * as yargs from "yargs";
import { parse, DocumentNode } from "graphql";
import * as fs from "fs";
import * as chalk from "chalk";
import {
  extractGraphQLTypes,
  extractGraphQLEnums,
  extractGraphQLUnions
} from "./source-helper";
import { IGenerator, GenerateArgs } from "./generators/generator-interface";
import { resolve } from "path";
import {
  generate as generateTS,
  format as formatTS
} from "./generators/ts-generator";
import {
  generate as generateReason,
  format as formatReason
} from "./generators/reason-generator";
import { importSchema } from "graphql-import";

type GeneratorType = "typescript" | "reason";

type CLIArgs = {
  schemaPath: string;
  output: string;
  generator: GeneratorType;
};

type DefaultOptions = {
  output: string;
  generator: GeneratorType;
};

export type GenerateCodeArgs = {
  schema: DocumentNode | undefined;
  prettify?: boolean;
  generator?: GeneratorType;
};

function getGenerator(generator: GeneratorType): IGenerator {
  if (generator === "reason") {
    return { generate: generateReason, format: formatReason };
  }
  return { generate: generateTS, format: formatTS };
}

export function generateCode({
  schema = undefined,
  prettify = true,
  generator = "typescript"
}: GenerateCodeArgs): string {
  if (!schema) {
    console.error(chalk.default.red(`Please provide a parsed GraphQL schema`));
  }

  const generateArgs: GenerateArgs = {
    types: extractGraphQLTypes(schema!),
    enums: extractGraphQLEnums(schema!),
    unions: extractGraphQLUnions(schema!)
  };
  const generatorFn: IGenerator = getGenerator(generator);
  const code = generatorFn.generate(generateArgs);

  if (prettify) {
    return generatorFn.format(code);
  } else {
    return code;
  }
}

function run() {
  const defaults: DefaultOptions = {
    output: "./resolvers.ts",
    generator: "typescript"
  };
  const argv = yargs
    .usage("Usage: $0 -s [schema-path] -o [output-path] -g [generator]")
    .alias("s", "schema-path")
    .describe("s", "GraphQL schema file path")
    .alias("o", "output")
    .describe("o", `Output file path [default: ${defaults.output}]`)
    .alias("g", "generator")
    .describe(
      "g",
      `Generator to use [default: ${defaults.generator}, options: reason]`
    )
    .demandOption(["s"])
    .strict().argv;
  const args: CLIArgs = {
    schemaPath: resolve(argv.schemaPath),
    output: argv.output || defaults.output,
    generator: argv.generator || defaults.generator
  };

  if (!fs.existsSync(args.schemaPath)) {
    console.error(`The schema file ${args.schemaPath} does not exist`);
    process.exit(1);
  }

  let schema = undefined;
  try {
    schema = importSchema(args.schemaPath);
  } catch (e) {
    console.error(
      chalk.default.red(`Error occurred while reading schema: ${e}`)
    );
    process.exit(1);
  }

  let parsedSchema = undefined;
  try {
    parsedSchema = parse(schema!);
  } catch (e) {
    console.error(chalk.default.red(`Failed to parse schema: ${e}`));
    process.exit(1);
  }

  const code = generateCode({
    schema: parsedSchema!,
    generator: args.generator
  });
  try {
    fs.writeFileSync(args.output, code, { encoding: "utf-8" });
  } catch (e) {
    console.error(
      chalk.default.red(
        `Failed to write the file at ${args.output}, error: ${e}`
      )
    );
    process.exit(1);
  }
  console.log(chalk.default.green(`Code generated at ${args.output}`));
  process.exit(0);
}

// Only call run when running from CLI, not when included for tests
if (require.main === module) {
  run();
}
