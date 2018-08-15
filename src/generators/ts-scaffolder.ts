import * as os from "os";
import { GenerateArgs, CodeFileLike } from "./generator-interface";
import { printFieldLikeType, isScalar } from "./ts-generator";

export { format } from "./ts-generator";

export function generate(args: GenerateArgs): CodeFileLike[] {
  const files: CodeFileLike[] = args.types.map(type => {
    const code = `
    import { I${type.name} } from '[TEMPLATE-INTERFACES-PATH]'
    import { Types } from '../types'

    ${args.enums
      .filter(e => type.fields.map(f => f.type.name).indexOf(e.name) > -1)
      .map(
        e => `
    type ${e.name}Root = ${e.values.map(v => `"${v}"`).join("|")}
    `
      )
      .join(os.EOL)}

      ${args.unions
        .filter(u => type.fields.map(f => f.type.name).indexOf(u.name) > -1)
        .map(
          u => `
          ${u.types
            .map(
              type => `
          import { ${type.name}Root } from './${type.name}'
          `
            )
            .join(os.EOL)}
      type ${u.name}Root = ${u.types.map(type => `${type.name}Root`).join("|")}
      `
        )
        .join(os.EOL)}

    ${Array.from(
      new Set(
        type.fields
          .filter(field => !args.enums.some(e => e.name === field.type.name))
          .filter(field => !args.unions.some(u => u.name === field.type.name))
          .filter(field => !isScalar(field.type.name))
          .map(
            field => `
    import { ${field.type.name}Root } from './${field.type.name}'
  `
          )
      )
    ).join(os.EOL)}

    export interface ${type.name}Root {
      ${type.fields
        .map(
          field => `
      ${field.name}: ${printFieldLikeType(field, false)}
      `
        )
        .join(os.EOL)}
    }

    export const ${type.name}: I${type.name}.Resolver<Types> = {
      ${type.fields.map(
        field => `
        ${field.name}: async (root, args, ctx, info) => {
          return null
        }
      `
      )}
    }
    `;
    return {
      path: `${type.name}.ts`,
      code
    } as CodeFileLike;
  });
  return files;
}
