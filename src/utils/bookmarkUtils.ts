import type { Bookmark, Package } from '../services/api';

export type { Bookmark };

export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'bookmark';
  children: TreeNode[];
  data?: Bookmark;
}

export function buildBookmarkTree(bookmarks: Bookmark[]): TreeNode[] {
  const root: TreeNode = { id: 'root', name: 'Root', type: 'folder', children: [] };
  bookmarks.forEach((bookmark) => {
    const categories = bookmark.category.split('/').filter(c => c);
    let currentNode = root;
    categories.forEach((categoryName) => {
      let folderNode = currentNode.children.find(c => c.name === categoryName && c.type === 'folder');
      if (!folderNode) {
        folderNode = { id: `${currentNode.id}/${categoryName}`, name: categoryName, type: 'folder', children: [] };
        currentNode.children.push(folderNode);
      }
      currentNode = folderNode;
    });
    currentNode.children.push({ id: bookmark.url, name: bookmark.name, type: 'bookmark', children: [], data: bookmark });
  });
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'bookmark') return -1;
      if (a.type === 'bookmark' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach(node => sortNodes(node.children));
  };
  sortNodes(root.children);
  return root.children;
}

export function flattenTags(packages: Package[]): string[] {
  const tags: string[] = [];
  const recurse = (pkgs: Package[]) => {
    for (const pkg of pkgs) {
      tags.push(pkg.key);
      if (pkg.children) recurse(pkg.children);
    }
  };
  recurse(packages);
  return tags;
}

export function filterBookmarkTree(nodes: TreeNode[], searchTerm: string, activeTag: string | null): TreeNode[] {
  const lowercasedTerm = searchTerm.toLowerCase();

  const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.reduce((acc, node) => {
      if (node.type === 'bookmark') {
        const bookmark = node.data!;
        const tags = flattenTags(bookmark.packages);

        const hasTag = !activeTag || tags.includes(activeTag);
        const matchesSearch = !lowercasedTerm ||
          bookmark.name.toLowerCase().includes(lowercasedTerm) ||
          bookmark.url.toLowerCase().includes(lowercasedTerm) ||
          bookmark.domain.toLowerCase().includes(lowercasedTerm);

        if (hasTag && matchesSearch) {
          acc.push(node);
        }
      } else { // It's a folder
        const filteredChildren = filterNodes(node.children);

        const matchesSearch = node.name.toLowerCase().includes(lowercasedTerm);

        if (filteredChildren.length > 0 || matchesSearch) {
          const childrenToShow = (matchesSearch && !activeTag) ? node.children : filteredChildren;
          acc.push({ ...node, children: childrenToShow });
        }
      }
      return acc;
    }, [] as TreeNode[]);
  };

  return filterNodes(nodes);
}

const COLOR_PALETTE = [
  'bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400',
  'bg-indigo-400', 'bg-purple-400', 'bg-pink-400', 'bg-teal-400'
];

export function generateColorFromDomain(domain: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    const char = domain.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}
