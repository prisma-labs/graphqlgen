import { validateDefinition } from '../../validation'
import { join } from 'path'

const relative = (p: string) => join(__dirname, p)

const language = 'typescript'

describe('test validateDefinition()', () => {
  test('invalid syntax', () => {
    const definition = './src/toto.ts::ModelName'
    const validation = validateDefinition('User', definition, language)

    expect(validation).toMatchObject({
      validSyntax: false,
      fileExists: false,
      interfaceExists: false,
      definition: {
        rawDefinition: definition,
      },
    })
  })

  test('invalid path', () => {
    const definition = './src/toto.ts:ModelName'
    const validation = validateDefinition('User', definition, language)

    expect(validation).toMatchObject({
      validSyntax: true,
      fileExists: false,
      interfaceExists: false,
      definition: {
        rawDefinition: definition,
      },
    })
  })

  test('invalid interface name', () => {
    const filePath = relative('../fixtures/basic/index.ts')
    const definition = `${filePath}:ModelName`
    const validation = validateDefinition('User', definition, language)

    expect(validation).toMatchObject({
      validSyntax: true,
      fileExists: true,
      interfaceExists: false,
      definition: {
        rawDefinition: definition,
      },
    })
  })

  test('invalid interface name', () => {
    const filePath = relative('../fixtures/basic/index.ts')
    const definition = `${filePath}:Number`
    const validation = validateDefinition('User', definition, language)

    expect(validation).toMatchObject({
      validSyntax: true,
      fileExists: true,
      interfaceExists: true,
      definition: {
        rawDefinition: definition,
        filePath,
        typeName: 'User',
        modelName: 'Number',
      },
    })
  })
})
