import { defaultConfig } from '../default-config'

test('Default config', () => {
  expect(defaultConfig).toMatchSnapshot()
})
