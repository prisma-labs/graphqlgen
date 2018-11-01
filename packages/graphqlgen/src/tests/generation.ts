import { GraphQLGenDefinition } from "graphqlgen-json-schema";
import { parseModels, parseSchema } from "../parse";
import { validateConfig } from "../validation";
import { generateCode } from "../index";

export function testGeneration(config: GraphQLGenDefinition) {
  const schema = parseSchema(config.schema)

  expect(validateConfig(config, schema)).toBe(true)

  const modelMap = parseModels(config.models, schema, config.output, config.language)
  const { generatedTypes, generatedResolvers } = generateCode({
    schema,
    language: config.language,
    config,
    modelMap,
    prettify: true,
  })

  expect(generatedTypes).toMatchSnapshot()
  expect(generatedResolvers).toMatchSnapshot()
}
