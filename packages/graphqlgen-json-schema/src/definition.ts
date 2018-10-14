export interface GraphQLGenDefinition {
  input: Input
  output: Output
}

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
