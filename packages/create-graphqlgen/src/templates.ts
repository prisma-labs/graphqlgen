export interface Template {
  name: string
  description: string
  repo: TemplateRepository
}

export interface TemplateRepository {
  uri: string
  branch: string
  path: string
}

export const defaultTemplate: Template = {
  name: 'yoga',
  description: 'GraphQL Yoga template',
  repo: {
    uri: 'https://github.com/prisma/graphqlgen',
    branch: 'master',
    path: '/packages/graphqlgen-templates/yoga',
  },
}
