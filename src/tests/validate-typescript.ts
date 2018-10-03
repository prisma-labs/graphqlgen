import * as ts from 'typescript';
import * as fs from "fs";
import { CodeFileLike } from "../generators/generator-interface";

const tmpPath = './tmp.ts';
export const isValidTypescript = (code: string | CodeFileLike[]) => {
  if(Array.isArray(code)) {
    for (const codeLike of code) {
      if(!validateTypescriptSourceCode(codeLike.code)) {
        return false
      }
    }
    return true;
  }
  return validateTypescriptSourceCode(code);
};

const validateTypescriptSourceCode = (code: string):boolean => {
  fs.writeFileSync(tmpPath, code);
  const program = ts.createProgram({ rootNames: [tmpPath], options: { skipLibCheck: true }});
  const diagnostics = ts.getPreEmitDiagnostics(program);
  fs.unlinkSync(tmpPath);
  const noErrors = diagnostics.length === 0;
  if(!noErrors){
    console.error(`Found ${diagnostics.length} errors in source code`);
    diagnostics.forEach(({ messageText }) => console.error(messageText));
  }
  return noErrors;
};

