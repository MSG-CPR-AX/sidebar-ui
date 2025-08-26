const mockBookmarks = [
  {
    id: '1',
    type: 'folder',
    name: 'DevOps',
    children: [
      {
        id: '2',
        type: 'folder',
        name: 'GitLab',
        children: [
          {
            id: '3',
            type: 'bookmark',
            name: 'GitLab Docs',
            url: 'https://docs.gitlab.com',
            domain: 'docs.gitlab.com',
            category: 'DevOps/GitLab',
            packages: [
              { key: 'dev', children: [{ key: 'doc', children: [{ key: 'gitlab' }] }] }
            ],
            meta: { priority: 1, owner: 'devops-team' }
          },
          {
            id: '4',
            type: 'bookmark',
            name: 'GitLab CI/CD',
            url: 'https://docs.gitlab.com/ee/ci/',
            domain: 'docs.gitlab.com',
            category: 'DevOps/GitLab',
            meta: { owner: 'ci-team' }
          }
        ]
      },
      {
        id: '5',
        type: 'folder',
        name: 'Kubernetes',
        children: [
          {
            id: '6',
            type: 'bookmark',
            name: 'Kubernetes Docs',
            url: 'https://kubernetes.io/docs/home/',
            domain: 'kubernetes.io',
            category: 'DevOps/Kubernetes'
          }
        ]
      }
    ]
  },
  {
    id: '7',
    type: 'folder',
    name: 'Search Engines',
    children: [
      {
        id: '8',
        type: 'bookmark',
        name: 'Google',
        url: 'https://www.google.com',
        domain: 'www.google.com',
        category: 'Search/Engine'
      },
      {
        id: '9',
        type: 'bookmark',
        name: 'DuckDuckGo',
        url: 'https://duckduckgo.com',
        domain: 'duckduckgo.com',
        category: 'Search/Engine'
      }
    ]
  },
  {
    id: '10',
    type: 'bookmark',
    name: 'GitHub',
    url: 'https://github.com',
    domain: 'github.com',
    category: 'Development'
  }
];

const mockCategories = [
  { name: 'DevOps', count: 3 },
  { name: 'Search', count: 2 },
  { name: 'Development', count: 1 }
];

export const getMockBookmarks = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: mockBookmarks });
    }, 500);
  });
};

export const getMockCategories = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: mockCategories });
    }, 300);
  });
};
