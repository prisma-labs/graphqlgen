export interface GraphQLGenDefinition {
  language: Language
  schema: string
  context?: string
  models: Models
  output: string
  ['resolver-scaffolding']?: ResolverScaffolding
  ['default-resolvers']?: boolean
  ['iresolvers-augmentation']?: boolean
  ['delegated-parent-resolvers']?: boolean
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

export type Language = 'typescript' | 'flow'

export interface ResolverScaffolding {
  output: string
  layout: string
}
