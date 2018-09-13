import { generateCode } from "../../";
import * as fs from "fs";
import { parse } from "graphql";
import { join } from "path";

test("basic schema", async () => {
 const schema = fs.readFileSync(
  join(__dirname, "../fixtures/basic.graphql"),
  "utf-8"
 );
 const parsedSchema = parse(schema);
 const code = generateCode({
  schema: parsedSchema,
  generator: "scaffold-typescript"
 });
 expect(code.length).toBe(5);
 expect(code).toMatchSnapshot();
});

test("basic enum", async () => {
 const schema = fs.readFileSync(
  join(__dirname, "../fixtures/enum.graphql"),
  "utf-8"
 );
 const parsedSchema = parse(schema);
 const code = generateCode({
  schema: parsedSchema,
  generator: "scaffold-typescript"
 });
 expect(code.length).toBe(4);
 expect(code).toMatchSnapshot();
});

test("basic union", async () => {
 const schema = fs.readFileSync(
  join(__dirname, "../fixtures/union.graphql"),
  "utf-8"
 );
 const parsedSchema = parse(schema);
 const code = generateCode({
  schema: parsedSchema,
  generator: "scaffold-typescript"
 });
 expect(code.length).toBe(6);
 expect(code).toMatchSnapshot();
});

test("basic scalar", async () => {
 const schema = fs.readFileSync(
  join(__dirname, "../fixtures/scalar.graphql"),
  "utf-8"
 );
 const parsedSchema = parse(schema);
 const code = generateCode({
  schema: parsedSchema,
  generator: "scaffold-typescript"
 });
 expect(code.length).toBe(5);
 expect(code).toMatchSnapshot();
});
