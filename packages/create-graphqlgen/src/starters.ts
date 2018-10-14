export interface Starter {
  name: string
  description: string
  repo: string
}

export const defaultStarters: Starter[] = [
  {
    name: 'standard',
    description: 'standard starter',
    repo:
      'https://github.com/prisma/graphqlgen/tree/master/packages/graphqlgen-starters/standard',
  },
]
