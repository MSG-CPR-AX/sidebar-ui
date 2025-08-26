import type { Bookmark } from '../services/api';

export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'bookmark';
  children: TreeNode[];
  data?: Bookmark; // Original bookmark data for leaf nodes
}

export function buildBookmarkTree(bookmarks: Bookmark[]): TreeNode[] {
  const root: TreeNode = {
    id: 'root',
    name: 'Root',
    type: 'folder',
    children: [],
  };

  bookmarks.forEach((bookmark) => {
    const categories = bookmark.category.split('/').filter(c => c); // Split and remove empty strings
    let currentNode = root;

    // Traverse or create folder nodes
    categories.forEach((categoryName) => {
      let folderNode = currentNode.children.find(
        (child) => child.name === categoryName && child.type === 'folder'
      );

      if (!folderNode) {
        folderNode = {
          id: `${currentNode.id}/${categoryName}`,
          name: categoryName,
          type: 'folder',
          children: [],
        };
        currentNode.children.push(folderNode);
      }
      currentNode = folderNode;
    });

    // Add the bookmark leaf node
    currentNode.children.push({
      id: bookmark.url, // Use URL as a unique ID for bookmarks
      name: bookmark.name,
      type: 'bookmark',
      children: [],
      data: bookmark,
    });
  });

  // Sort children at each level: folders first, then alphabetically
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'bookmark') return -1;
      if (a.type === 'bookmark' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach(node => {
      if (node.children.length) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(root.children);

  return root.children;
}

export function filterBookmarkTree(nodes: TreeNode[], searchTerm: string): TreeNode[] {
  if (!searchTerm) {
    return nodes;
  }

  const lowercasedTerm = searchTerm.toLowerCase();

  const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.reduce((acc, node) => {
      if (node.type === 'bookmark') {
        const bookmark = node.data;
        if (
          bookmark &&
          (bookmark.name.toLowerCase().includes(lowercasedTerm) ||
            bookmark.url.toLowerCase().includes(lowercasedTerm) ||
            bookmark.domain.toLowerCase().includes(lowercasedTerm))
        ) {
          acc.push(node);
        }
      } else { // It's a folder
        const filteredChildren = filterNodes(node.children);
        if (filteredChildren.length > 0 || node.name.toLowerCase().includes(lowercasedTerm)) {
          // If the folder name matches, include all original children
          const childrenToShow = node.name.toLowerCase().includes(lowercasedTerm)
            ? node.children
            : filteredChildren;

          acc.push({ ...node, children: childrenToShow });
        }
      }
      return acc;
    }, [] as TreeNode[]);
  };

  return filterNodes(nodes);
}

import { Package } from '../services/api';

export function flattenTags(packages: Package[]): string[] {
  const tags: string[] = [];

  const recurse = (pkgs: Package[]) => {
    for (const pkg of pkgs) {
      tags.push(pkg.key);
      if (pkg.children) {
        recurse(pkg.children);
      }
    }
  };

  recurse(packages);
  return tags;
}
