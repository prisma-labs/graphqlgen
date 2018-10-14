export interface GraphQLGenDefinition {
  language: Language
  input: Input
  output: Output
}

export type Language = 'typescript' | 'flow'

export interface Input {
  schema: string
  models: { [typeName: string]: string }
  context: string
}

export interface Output {
  types: string
  models?: string
  resolvers?: string
}
