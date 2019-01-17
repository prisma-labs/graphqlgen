interface Template {
  name: string
  description: string
  repo: TemplateRepository
}

interface TemplateRepository {
  uri: string
  branch: string
  path: string
}

const defaultTemplate: Template = {
  name: 'typescript-yoga',
  description: 'GraphQL Yoga template with TypeScript',
  repo: {
    uri: 'https://github.com/prisma/graphqlgen',
    branch: 'master',
    path: '/packages/graphqlgen-templates/typescript-yoga',
  },
}

const availableTemplates: Template[] = [
  defaultTemplate,
  {
    name: 'flow-yoga',
    description: 'GraphQL Yoga template with Flow',
    repo: {
      uri: 'https://github.com/prisma/graphqlgen',
      branch: 'master',
      path: '/packages/graphqlgen-templates/flow-yoga',
    },
  },
]

const templatesNames = availableTemplates.map(t => `\`${t.name}\``).join(', ')

export {
  Template,
  TemplateRepository,
  defaultTemplate,
  availableTemplates,
  templatesNames,
}
