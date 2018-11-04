import { Data } from './types'

const users = [
  { id: '1', name: 'Alice', postIDs: ['3', '4'] },
  { id: '2', name: 'Bob', postIDs: [] },
]

const posts = [
  {
    id: '3',
    title: 'GraphQL Conf 2019',
    content: 'An awesome GraphQL conference in Berlin.',
    published: true,
    authorId: '1',
  },
  {
    id: '4',
    title: 'GraphQL Weekly',
    content: 'Weekly news about the Grap[hQL ecosystem and community.',
    published: false,
    authorId: '1',
  },
]

let idCount = 4
function idProvider(): string {
  return `${idCount++}`
}

export const data: Data = { posts, users, idProvider }
