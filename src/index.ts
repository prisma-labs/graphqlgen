#!/usr/bin/env node

import * as yargs from "yargs";
import { parse, DocumentNode } from "graphql";
import * as fs from "fs";
import * as chalk from "chalk";
import * as mkdirp from "mkdirp";
import * as prettier from "prettier";
import * as os from "os";
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
import {
  generate as generateFlow,
  format as formatFlow
} from "./generators/flow-generator";

import { generate as scaffoldTS } from "./generators/ts-scaffolder";
import { generate as scaffoldReason } from "./generators/reason-scaffolder";
import { generate as scaffoldFlow } from "./generators/flow-scaffolder";

import { importSchema } from "graphql-import";

type GeneratorType = "typescript" | "reason" | "flow";

type ActualGeneratorType =
  | "interfaces-typescript"
  | "interfaces-reason"
  | "interfaces-flow"
  | "scaffold-typescript"
  | "scaffold-reason"
  | "scaffold-flow";

type CLIArgs = {
  command: string;
  schemaPath: string;
  output: string;
  generator: GeneratorType;
  interfaces: string;
  force: boolean;
};

type DefaultOptions = {
  outputInterfaces: string;
  outputScaffold: string;
  generator: GeneratorType;
  interfaces: string;
  force: boolean;
};

export type GenerateCodeArgs = {
  schema: DocumentNode | undefined;
  prettify?: boolean;
  prettifyOptions?: prettier.Options;
  generator?: ActualGeneratorType;
};

function getGenerator(generator: ActualGeneratorType): IGenerator {
  if (generator === "interfaces-flow") {
    return { generate: generateFlow, format: formatFlow };
  }
  if (generator === "scaffold-flow") {
    return { generate: scaffoldFlow, format: formatFlow };
  }
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
  prettifyOptions,
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
      return generatorFn.format(code, prettifyOptions);
    } else {
      return code;
    }
  } else {
    return code.map(f => {
      return {
        path: f.path,
        force: f.force,
        code: prettify ? generatorFn.format(f.code, prettifyOptions) : f.code
      };
    });
  }
}

async function run() {
  const defaults: DefaultOptions = {
    outputInterfaces: "src/generated/resolvers.ts",
    outputScaffold: "src/resolvers/",
    generator: "typescript",
    interfaces: "../generated/resolvers.ts",
    force: false
  };
  const argv = yargs
    .usage(
      "Usage: <command> $0 -s [schema-path] -o [output-path] -g [generator] -i [interfaces]"
    )
    .alias("s", "schema-path")
    .describe("s", "GraphQL schema file path")
    .alias("o", "output")
    .describe(
      "o",
      `Output file/folder path [default: ${defaults.outputInterfaces}]`
    )
    .alias("g", "generator")
    .describe(
      "g",
      `Generator to use [default: ${defaults.generator}, options: reason]`
    )
    .describe("i", `Path to the interfaces folder used for scaffolding`)
    .alias("i", "interfaces") // TODO: Make this option only be used with scaffold command
    .describe("f", `Force write files when there is a clash while scaffolding`)
    .alias("f", "force") // TODO: Make this option only be used with scaffold command
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
      `${
        command === "interfaces"
          ? `${defaults.outputInterfaces}`
          : `${defaults.outputScaffold}`
      }`,
    generator: argv.generator || defaults.generator,
    interfaces: (argv.interfaces || defaults.interfaces)
      .trim()
      .replace(".ts", "")
      .replace(".js", ""),
    force: Boolean(argv.force) || defaults.force
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

  const options = (await prettier.resolveConfig(process.cwd())) || {}; // TODO: Abstract this TS specific behavior better
  if (JSON.stringify(options) !== "{}") {
    console.log(chalk.default.blue(`Found a prettier configuration to use`));
  }

  const code = generateCode({
    schema: parsedSchema!,
    generator: `${args.command}-${args.generator}` as ActualGeneratorType,
    prettify: true,
    prettifyOptions: options
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

    let didWarn = false;

    code.forEach(f => {
      const writePath = join(args.output, f.path);
      if (
        !args.force &&
        !f.force &&
        (fs.existsSync(writePath) ||
          (resolve(dirname(writePath)) !== resolve(args.output) &&
            fs.existsSync(dirname(writePath))))
      ) {
        didWarn = true;
        console.log(
          chalk.default.yellow(`Warning: file (${writePath}) already exists.`)
        );
        return;
      }

      mkdirp.sync(dirname(writePath));
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
    if (didWarn) {
      console.log(
        chalk.default.yellow(
          `${
            os.EOL
          }Please us the force flag (-f, --force) to overwrite the files.`
        )
      );
    }
    process.exit(0);
  }
}

// Only call run when running from CLI, not when included for tests
if (require.main === module) {
  run();
}
