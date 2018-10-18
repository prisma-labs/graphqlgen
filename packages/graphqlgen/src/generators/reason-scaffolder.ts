import { GenerateArgs } from '../types'

export { format } from './reason-generator'

const noop = (s: string) => s

export function generate(args: GenerateArgs) {
  noop(JSON.stringify(args))
  return 'Reason code scaffolder is not yet implmented'
}
