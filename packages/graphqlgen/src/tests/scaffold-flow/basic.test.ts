import { generateCode } from '../../'
import * as fs from 'fs'
import { parse } from 'graphql'
import { join } from 'path'

test('basic schema', async () => {
  const schema = fs.readFileSync(
    join(__dirname, '../fixtures/basic.graphql'),
    'utf-8',
  )
  const parsedSchema = parse(schema)
  const code = generateCode({
    schema: parsedSchema,
    language: 'flow',
  }).generatedResolvers
  expect(code).toMatchSnapshot()
  expect(code.length).toBe(5)
})

test('basic enum', async () => {
  const schema = fs.readFileSync(
    join(__dirname, '../fixtures/enum.graphql'),
    'utf-8',
  )
  const parsedSchema = parse(schema)
  const code = generateCode({
    schema: parsedSchema,
    language: 'flow',
  }).generatedResolvers
  expect(code).toMatchSnapshot()
  expect(code.length).toBe(5)
})

test('basic union', async () => {
  const schema = fs.readFileSync(
    join(__dirname, '../fixtures/union.graphql'),
    'utf-8',
  )
  const parsedSchema = parse(schema)
  const code = generateCode({
    schema: parsedSchema,
    language: 'flow',
  }).generatedResolvers
  expect(code).toMatchSnapshot()
  expect(code.length).toBe(6)
})

test('basic scalar', async () => {
  const schema = fs.readFileSync(
    join(__dirname, '../fixtures/scalar.graphql'),
    'utf-8',
  )
  const parsedSchema = parse(schema)
  const code = generateCode({
    schema: parsedSchema,
    language: 'flow',
  }).generatedResolvers
  expect(code).toMatchSnapshot()
  expect(code.length).toBe(6)
})
