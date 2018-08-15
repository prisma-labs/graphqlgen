#!/usr/bin/env node

import * as yargs from "yargs";
import { parse, DocumentNode } from "graphql";
import * as fs from "fs";
import * as chalk from "chalk";
import * as mkdirp from "mkdirp";
import {
  extractGraphQLTypes,
  extractGraphQLEnums,
  extractGraphQLUnions
} from "./source-helper";
import {
  IGenerator,
  GenerateArgs,
  CodeFileLike
} from "./generators/generator-interface";
import { resolve, join, dirname } from "path";
import {
  generate as generateTS,
  format as formatTS
} from "./generators/ts-generator";
import {
  generate as generateReason,
  format as formatReason
} from "./generators/reason-generator";

import { generate as scaffoldTS } from "./generators/ts-scaffolder";
import { generate as scaffoldReason } from "./generators/reason-scaffolder";

import { importSchema } from "graphql-import";

type GeneratorType = "typescript" | "reason";

type ActualGeneratorType =
  | "interfaces-typescript"
  | "interfaces-reason"
  | "scaffold-typescript"
  | "scaffold-reason";

type CLIArgs = {
  command: string;
  schemaPath: string;
  output: string;
  generator: GeneratorType;
  interfaces: string;
};

type DefaultOptions = {
  output: string;
  generator: GeneratorType;
  interfaces: string;
};

export type GenerateCodeArgs = {
  schema: DocumentNode | undefined;
  prettify?: boolean;
  generator?: ActualGeneratorType;
};

function getGenerator(generator: ActualGeneratorType): IGenerator {
  if (generator === "interfaces-reason") {
    return { generate: generateReason, format: formatReason };
  }
  if (generator === "scaffold-reason") {
    return { generate: scaffoldReason, format: formatReason };
  }
  if (generator === "interfaces-typescript") {
    return { generate: generateTS, format: formatTS };
  }
  if (generator === "scaffold-typescript") {
    return { generate: scaffoldTS, format: formatTS };
  }
  return { generate: generateTS, format: formatTS };
}

export function generateCode({
  schema = undefined,
  prettify = true,
  generator = "interfaces-typescript"
}: GenerateCodeArgs): string | CodeFileLike[] {
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

  if (typeof code === "string") {
    if (prettify) {
      return generatorFn.format(code);
    } else {
      return code;
    }
  } else {
    return code.map(f => {
      return {
        path: f.path,
        code: prettify ? generatorFn.format(f.code) : f.code
      } as CodeFileLike;
    });
  }
}

function run() {
  const defaults: DefaultOptions = {
    output: "./generated/resolvers",
    generator: "typescript",
    interfaces: "./generated/"
  };
  const argv = yargs
    .usage(
      "Usage: <command> $0 -s [schema-path] -o [output-path] -g [generator] -i [interfaces]"
    )
    .alias("s", "schema-path")
    .describe("s", "GraphQL schema file path")
    .alias("o", "output")
    .describe("o", `Output file/folder path [default: ${defaults.output}[.ts]]`)
    .alias("g", "generator")
    .describe(
      "g",
      `Generator to use [default: ${defaults.generator}, options: reason]`
    )
    .describe("i", `Path to the interfaces folder used for scaffolding`)
    .alias("i", "interfaces") // TODO: Make this option only be used with scaffold command
    .demandOption(["s"])
    .demandCommand(1)

    .strict().argv;

  const command = argv._[0];
  if (["scaffold", "interfaces"].indexOf(command.toLowerCase()) <= -1) {
    console.error(
      `Unknown command provided, please provide either scaffold or interfaces as the command`
    );
    process.exit(1);
  }

  const args: CLIArgs = {
    command: command,
    schemaPath: resolve(argv.schemaPath),
    output:
      argv.output ||
      `${defaults.output}${command === "interfaces" ? ".ts" : ""}`,
    generator: argv.generator || defaults.generator,
    interfaces: argv.interfaces || defaults.interfaces
  };

  // TODO: Do a check on interfaces if provided

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
    generator: `${args.command}-${args.generator}` as ActualGeneratorType
  });

  if (typeof code === "string") {
    // Create generation target folder, if it does not exist
    // TODO: Error handling around this
    mkdirp.sync(dirname(args.output));
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
  } else {
    // Create generation target folder, if it does not exist
    // TODO: Error handling around this
    mkdirp.sync(dirname(args.output));
    code.forEach(f => {
      const writePath = join(args.output, f.path);
      try {
        fs.writeFileSync(
          writePath,
          f.code.replace("[TEMPLATE-INTERFACES-PATH]", args.interfaces),
          {
            encoding: "utf-8"
          }
        );
      } catch (e) {
        console.error(
          chalk.default.red(
            `Failed to write the file at ${args.output}, error: ${e}`
          )
        );
        process.exit(1);
      }
      console.log(chalk.default.green(`Code generated at ${writePath}`));
    });
    process.exit(0);
  }
}

// Only call run when running from CLI, not when included for tests
if (require.main === module) {
  run();
}
