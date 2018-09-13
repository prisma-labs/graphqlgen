import * as os from "os";
import { GenerateArgs, CodeFileLike } from "./generator-interface";
import { printFieldLikeType } from "./ts-generator";
import { GraphQLTypeField } from "../source-helper";

export { format } from "./ts-generator";

function printFieldLikeTypeEmptyCase(field: GraphQLTypeField) {
  if (!field.type.isRequired || field.type.name === "ID") {
    return `null`;
  }
  if (field.type.isRequired && field.type.isArray && field.type.isScalar) {
    return `[]`;
  }
  if (
    field.type.isRequired &&
    field.type.name === "String" &&
    field.type.isScalar
  ) {
    return `''`;
  }
  if (
    field.type.isRequired &&
    (field.type.name === "Int" || field.type.name === "Float") &&
    field.type.isScalar
  ) {
    return `0`;
  }
  if (
    field.type.isRequired &&
    field.type.name === "Boolean" &&
    field.type.isScalar
  ) {
    return `false`;
  }
  if (field.type.isRequired && !field.type.isScalar) {
    return `{ throw new Error('Resolver not implemented') }`;
  }
}

function isRootType(name: string) {
  const rootTypes = ["Query", "Mutation", "Subscription"];
  return rootTypes.indexOf(name) > -1;
}

export function generate(args: GenerateArgs): CodeFileLike[] {
  let files: CodeFileLike[] = args.types
    .filter(type => !isRootType(type.name))
    .map(type => {
      const code = `
    import { I${type.name} } from '[TEMPLATE-INTERFACES-PATH]'
    import { Types } from './types'
    ${Array.from(
      new Set(
        type.fields
          .filter(field => !field.type.isEnum && !field.type.isUnion)
          .filter(field => !field.type.isScalar)
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
        
            export type ${u.name} = ${u.types
            .map(type => `${type.name}Root`)
            .join("|")}
        `
        )
        .join(os.EOL)}

        ${args.enums
          .filter(e => type.fields.map(f => f.type.name).indexOf(e.name) > -1)
          .map(
            e => `
        export type ${e.name} = ${e.values.map(v => `"${v}"`).join("|")}
        `
          )
          .join(os.EOL)}

    export interface ${type.name}Root {
      ${type.fields
        .map(
          field => `
      ${field.name}${!field.type.isRequired ? "?" : ""}: ${printFieldLikeType(
            field,
            false
          ).replace("| null", "")}
      `
        )
        .join(";")}
    }

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

  files = files.concat(
    args.types.filter(type => isRootType(type.name)).map(type => {
      const code = `
      import { I${type.name} } from '[TEMPLATE-INTERFACES-PATH]'
      import { Types } from './types'

      export interface ${type.name}Root { }
      
      export const ${type.name}: I${type.name}.Resolver<Types> = {
        ${type.fields.map(
          field =>
            `${field.name}: (root${
              field.arguments.length > 0 ? ", args" : ""
            }) => ${printFieldLikeTypeEmptyCase(field)}`
        )}
      }
      `;
      return {
        path: `${type.name}.ts`,
        force: false,
        code
      };
    })
  );

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
    path: "typemap.ts",
    force: true,
    code: `
import { ITypes } from '[TEMPLATE-INTERFACES-PATH]'

${args.types
      .map(type => `import { ${type.name}Root } from './${type.name}'`)
      .join(";")}

import { Context } from './Context'

export interface Types extends ITypes {
  Context: Context
  ${args.types
    .map(
      type =>
        `${type.name}${type.type.isEnum || type.type.isUnion ? "" : "Root"}: ${
          type.name
        }${type.type.isEnum || type.type.isUnion ? "" : "Root"}`
    )
    .join(";")}
}
    `
  });

  files.push({
    path: "index.ts",
    force: false,
    code: `
    import { IResolvers } from '[TEMPLATE-INTERFACES-PATH]'
    import { Types } from './types'
    ${args.types
      .map(
        type => `
      import { ${type.name} } from './${type.name}'
    `
      )
      .join(";")}

    export const resolvers: IResolvers<Types> = {
      ${args.types.map(type => `${type.name}`).join(",")}   
    }
    `
  });

  return files;
}
