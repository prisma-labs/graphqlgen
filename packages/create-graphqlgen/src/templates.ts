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
  name: 'typescript-yoga',
  description: 'GraphQL Yoga template with typescript',
  repo: {
    uri: 'https://github.com/prisma/graphqlgen',
    branch: 'master',
    path: '/packages/graphqlgen-templates/typescript-yoga',
  },
}

export const availableTemplates: Template[] = [
  defaultTemplate,
  {
    name: 'flow-yoga',
    description: 'GraphQL Yoga template with flow',
    repo: {
      uri: 'https://github.com/prisma/graphqlgen',
      branch: 'master',
      path: '/packages/graphqlgen-templates/flow-yoga',
    },
  },
]

export const templatesNames = availableTemplates
  .map(t => `\`${t.name}\``)
  .join(', ')
