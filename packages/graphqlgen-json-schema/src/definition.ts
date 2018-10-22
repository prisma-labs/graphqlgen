export interface GraphQLGenDefinition {
  language: Language
  schema: string
  context?: string
  models: Models
  output: string
  ['resolver-scaffolding']?: ResolverScaffolding
}

export interface Models {
  files?: string[]
  override?: { [typeName: string]: string }
  defaultName?: string
}

export type Language = 'typescript'

export interface ResolverScaffolding {
  output: string
  layout: string
}
