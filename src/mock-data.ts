import type { Bookmark } from './services/api';

export const mockBookmarks: Bookmark[] = [
  {
    name: 'GitLab Docs',
    url: 'https://docs.gitlab.com',
    domain: 'docs.gitlab.com',
    category: 'DevOps/GitLab',
    packages: [
      {
        key: 'dev',
        children: [
          {
            key: 'doc',
            children: [{ key: 'gitlab' }]
          }
        ]
      }
    ],
    meta: {
      priority: 1,
      owner: 'devops-team',
    },
  },
  {
    name: 'Google',
    url: 'https://www.google.com',
    domain: 'www.google.com',
    category: 'Search/Engine',
    packages: [],
    meta: {
      priority: 2,
      owner: 'public',
    },
  },
  {
    name: 'Naver',
    url: 'https://www.naver.com',
    domain: 'www.naver.com',
    category: 'Search/Engine',
    packages: [],
    meta: {
      priority: 3,
      owner: 'public',
    },
  },
  {
    name: 'React Docs',
    url: 'https://react.dev/',
    domain: 'react.dev',
    category: 'Frontend/React',
    packages: [
        {key: 'frontend'},
        {key: 'react'},
        {key: 'javascript'}
    ],
    meta: {
      priority: 1,
      owner: 'frontend-team',
    },
  },
];
