export interface GraphQLGenDefinition {
  language: Language
  schema: string
  context?: string
  models: Models
  output: string
  ['schema-output']: string
  ['resolver-scaffolding']?: ResolverScaffolding
}

export interface Models {
  files?: File[]
  override?: { [typeName: string]: string }
}

export type File =
  | string
  | {
      path: string
      defaultName?: string
    }

export type Language = 'typescript'

export interface ResolverScaffolding {
  output: string
  layout: string
}

export * from './default-config'
