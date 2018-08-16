import * as os from "os";
import { GenerateArgs, CodeFileLike } from "./generator-interface";
// TODO: isScalar is the wrong name for this function
import { printFieldLikeType, isScalar } from "./ts-generator";
import { GraphQLTypeField } from "../source-helper";

export { format } from "./ts-generator";

function printFieldLikeTypeEmptyCase(field: GraphQLTypeField) {
  if (!field.type.isRequired || field.type.name === "ID") {
    return `null`;
  }
  if (
    field.type.isRequired &&
    field.type.isArray &&
    isScalar(field.type.name)
  ) {
    return `[]`;
  }
  if (
    field.type.isRequired &&
    field.type.name === "String" &&
    isScalar(field.type.name)
  ) {
    return `''`;
  }
  if (
    field.type.isRequired &&
    (field.type.name === "Int" || field.type.name === "Float") &&
    isScalar(field.type.name)
  ) {
    return `0`;
  }
  if (
    field.type.isRequired &&
    field.type.name === "Boolean" &&
    isScalar(field.type.name)
  ) {
    return `false`;
  }
  if (field.type.isRequired && !isScalar(field.type.name)) {
    return `{ throw new Error('Resolver not implemented') }`;
  }
}

function isRootType(name: string) {
  const rootTypes = ["Query", "Mutation", "Subscription"];
  return rootTypes.indexOf(name) > -1;
}

export function generate(args: GenerateArgs): CodeFileLike[] {
  const files: CodeFileLike[] = args.types
    .filter(type => !isRootType(type.name))
    .map(type => {
      const code = `
    ${args.types
      .filter(type => isRootType(type.name))
      .map(type => `import { I${type.name} } from '[TEMPLATE-INTERFACES-PATH]'`)
      .join(";")}
    import { I${type.name} } from '[TEMPLATE-INTERFACES-PATH]'
    import { Types } from './types'
    ${Array.from(
      new Set(
        type.fields
          .filter(field => !args.enums.some(e => e.name === field.type.name))
          .filter(field => !args.unions.some(u => u.name === field.type.name))
          .filter(field => !isScalar(field.type.name))
          .map(
            field => `import { ${field.type.name}Root } from './${
              field.type.name
            }'
  `
          )
      )
    ).join(";")}
      ${args.unions
        .filter(u => type.fields.map(f => f.type.name).indexOf(u.name) > -1)
        .map(
          u => `${u.types
            .map(type => `import { ${type.name}Root } from './${type.name}'`)
            .join(";")}
        
            export type ${u.name}Root = ${u.types
            .map(type => `${type.name}Root`)
            .join("|")}
        `
        )
        .join(os.EOL)}

        ${args.enums
          .filter(e => type.fields.map(f => f.type.name).indexOf(e.name) > -1)
          .map(
            e => `
        export type ${e.name}Root = ${e.values.map(v => `"${v}"`).join("|")}
        `
          )
          .join(os.EOL)}

    ${args.types
      .filter(type => isRootType(type.name))
      .map(type => `export interface ${type.name}Root { }`)
      .join(";")}

    export interface ${type.name}Root {
      ${type.fields
        .map(
          field => `
      ${field.name}: ${printFieldLikeType(field, false)}
      `
        )
        .join(";")}
    }

    ${args.types
      .filter(type => isRootType(type.name))
      .map(
        type => `
        export const ${type.name}: I${type.name}.Resolver<Types> = {
          ${type.fields.map(
            field =>
              `${field.name}: (root${
                field.arguments.length > 0 ? ", args" : ""
              }) => ${printFieldLikeTypeEmptyCase(field)}`
          )}
        }
      `
      )
      .join(";")}

    export const ${type.name}: I${type.name}.Resolver<Types> = {
      ${type.fields.map(
        field => `
        ${field.name}: (root${
          field.arguments.length > 0 ? ", args" : ""
        }) => root.${field.name}
      `
      )}
    }
    `;
      return {
        path: `${type.name}.ts`,
        force: false,
        code
      };
    });

  files.push({
    path: "Context.ts",
    force: false,
    code: `
    export interface Context {
      db: any
      request: any
    }
    `
  });

  files.push({
    path: "types.ts",
    force: true,
    code: `
import { ITypes } from '[TEMPLATE-INTERFACES-PATH]'

${args.types
      .map(type => `import { ${type.name}Root } from './${type.name}'`)
      .join(";")}

import { Context } from './Context'

export interface Types extends ITypes {
  Context: Context
  ${args.types.map(type => `${type.name}Root: ${type.name}Root`).join(";")}
}
    `
  });

  return files;
}
