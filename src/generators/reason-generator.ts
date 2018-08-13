import { GenerateArgs } from "./generator-interface";

export function format(code: string) {
  return code;
}

export function generate(args: GenerateArgs) {
  return `Reason code will be generated here ${args}`;
}
