import * as Core from '../../src/generators/common'
import * as Benchmark from '../lib/benchmark'

const type = {
  name: 'Z',
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
        },
      },
    ],
  },
  B: {
    name: 'B',
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
        },
      },
    ],
  },
  C: {
    name: 'C',
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
        },
      },
    ],
  },
  D: {
    name: 'D',
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
