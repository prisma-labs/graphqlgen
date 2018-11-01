import { createConfig, defaultConfig } from '../default-config'

test('Default config', () => {
  expect(defaultConfig).toMatchSnapshot()
})

test('Custom config', () => {
  expect(
    createConfig('./src/custom-folder', '__generated_custom__'),
  ).toMatchSnapshot()
})
