import * as prettier from 'prettier'
import {
  GraphQLTypeObject,
  GraphQLEnumObject,
  GraphQLUnionObject,
} from './source-helper'
import { TypeDefinition } from './introspection/types'

export interface GenerateArgs {
  types: GraphQLTypeObject[]
  enums: GraphQLEnumObject[]
  unions: GraphQLUnionObject[]
  context?: ContextDefinition
  modelMap: ModelMap
}

export interface ModelMap {
  [schemaTypeName: string]: Model
}

export interface Model {
  absoluteFilePath: string
  importPathRelativeToOutput: string
  definition: TypeDefinition
}

export interface ContextDefinition {
  contextPath: string
  interfaceName: string
}

export interface CodeFileLike {
  path: string
  force: boolean
  code: string
}

export interface IGenerator {
  generate: (args: GenerateArgs) => string | CodeFileLike[]
  format: (code: string, options?: prettier.Options) => string
}
