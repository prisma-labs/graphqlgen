import * as Core from '../../src/generators/common'
import * as Benchmark from '../lib/benchmark'

const type = {
  name: 'Z',
  implements: null,
  type: {
    name: 'Z',
    isInput: false,
    isEnum: false,
    isInterface: false,
    isObject: true,
    isScalar: false,
    isUnion: false,
  },
  fields: [],
}

const typeMap: Core.InputTypesMap = {
  A: {
    name: 'A',
    implements: null,
    type: {
      name: 'A',
      isInput: true,
      isEnum: false,
      isInterface: false,
      isObject: false,
      isScalar: false,
      isUnion: false,
    },
    fields: [
      {
        name: 'b',
        arguments: [],
        type: {
          name: 'B',
          isInput: true,
          isEnum: false,
          isInterface: false,
          isObject: false,
          isScalar: false,
          isUnion: false,
          isRequired: false,
          isArray: false,
          isArrayRequired: false,
        },
      },
      {
        name: 'c',
        arguments: [],
        type: {
          name: 'C',
          isInput: true,
          isEnum: false,
          isInterface: false,
          isObject: false,
          isScalar: false,
          isUnion: false,
          isRequired: false,
          isArray: false,
          isArrayRequired: false,
        },
      },
    ],
  },
  B: {
    name: 'B',
    implements: null,
    type: {
      name: 'B',
      isInput: true,
      isEnum: false,
      isInterface: false,
      isObject: false,
      isScalar: false,
      isUnion: false,
    },
    fields: [
      {
        name: 'd',
        arguments: [],
        type: {
          name: 'D',
          isInput: true,
          isEnum: false,
          isInterface: false,
          isObject: false,
          isScalar: false,
          isUnion: false,
          isRequired: false,
          isArray: false,
          isArrayRequired: false,
        },
      },
    ],
  },
  C: {
    name: 'C',
    implements: null,
    type: {
      name: 'C',
      isInput: true,
      isEnum: false,
      isInterface: false,
      isObject: false,
      isScalar: false,
      isUnion: false,
    },
    fields: [
      {
        name: 'd',
        arguments: [],
        type: {
          name: 'D',
          isInput: true,
          isEnum: false,
          isInterface: false,
          isObject: false,
          isScalar: false,
          isUnion: false,
          isRequired: false,
          isArray: false,
          isArrayRequired: false,
        },
      },
    ],
  },
  D: {
    name: 'D',
    implements: null,
    type: {
      name: 'D',
      isInput: true,
      isEnum: false,
      isInterface: false,
      isObject: false,
      isScalar: false,
      isUnion: false,
    },
    fields: [
      {
        name: 'foo',
        arguments: [],
        type: {
          name: 'String',
          isInput: false,
          isEnum: false,
          isInterface: false,
          isObject: false,
          isScalar: true,
          isUnion: false,
          isRequired: false,
          isArray: false,
          isArrayRequired: false,
        },
      },
    ],
  },
}

const benchGetDistinctInputTypes = new Benchmark.Benchmark({
  name: 'getDistinctInputTypes',
  test: () => {
    Core.getDistinctInputTypes(type, { Z: ['A'] }, typeMap)
  },
})

const collect: Benchmark.Collect = () => {
  return [benchGetDistinctInputTypes]
}

export { collect }
