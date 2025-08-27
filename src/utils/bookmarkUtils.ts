import type { Bookmark, Package } from '../services/api';

// Re-exporting the Bookmark type so other modules can import it from here
export type { Bookmark };

/**
 * Represents a node in the bookmark tree.
 * The tree is composed of these nodes.
 */
export interface TreeNode {
  id: string; // A unique identifier for the node
  name: string; // The display name (folder name or bookmark title)
  type: 'folder' | 'bookmark'; // Distinguishes between folders and bookmarks
  children: TreeNode[]; // Child nodes (for folders)
  data?: Bookmark; // The original bookmark data, only present for bookmark nodes
}

/**
 * Transforms a flat array of bookmarks into a hierarchical tree structure
 * based on the `category` path (e.g., "DevOps/GitLab").
 * @param bookmarks - The flat array of bookmark objects.
 * @returns An array of TreeNode objects representing the root of the tree.
 */
export function buildBookmarkTree(bookmarks: Bookmark[]): TreeNode[] {
  // Create a virtual root node to serve as the base for the tree.
  const root: TreeNode = { id: 'root', name: 'Root', type: 'folder', children: [] };

  // Process each bookmark to place it in the correct position in the tree.
  bookmarks.forEach((bookmark) => {
    // Split the category path into individual folder names.
    const categories = bookmark.category.split('/').filter(c => c);
    let currentNode = root;

    // Traverse the tree, creating folder nodes as needed.
    categories.forEach((categoryName) => {
      // Check if a folder with this name already exists at the current level.
      let folderNode = currentNode.children.find(c => c.name === categoryName && c.type === 'folder');
      if (!folderNode) {
        // If it doesn't exist, create a new folder node.
        folderNode = { id: `${currentNode.id}/${categoryName}`, name: categoryName, type: 'folder', children: [] };
        currentNode.children.push(folderNode);
      }
      // Move down to the next level in the tree.
      currentNode = folderNode;
    });

    // Finally, add the bookmark itself as a leaf node.
    currentNode.children.push({ id: bookmark.url, name: bookmark.name, type: 'bookmark', children: [], data: bookmark });
  });

  // A recursive helper function to sort nodes.
  // It sorts folders before bookmarks, and then alphabetically.
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'bookmark') return -1;
      if (a.type === 'bookmark' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
    // Recursively sort the children of each folder.
    nodes.forEach(node => {
      if (node.children.length) sortNodes(node.children);
    });
  };

  sortNodes(root.children);

  return root.children;
}

/**
 * Recursively flattens the nested `packages` structure into a simple array of strings.
 * @param packages - The array of package objects from a bookmark.
 * @returns A flat array of tag strings.
 */
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

/**
 * Filters the bookmark tree based on a search term and an active tag.
 * @param nodes - The current array of nodes to filter.
 * @param searchTerm - The text to search for.
 *- @param activeTag - The tag to filter by. If null, no tag filter is applied.
 * @returns A new array of nodes that match the filter criteria.
 */
export function filterBookmarkTree(nodes: TreeNode[], searchTerm: string, activeTag: string | null): TreeNode[] {
  const lowercasedTerm = searchTerm.toLowerCase();

  // A recursive helper function to perform the filtering.
  const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.reduce((acc, node) => {
      if (node.type === 'bookmark') {
        const bookmark = node.data!;
        const tags = flattenTags(bookmark.packages);

        // A bookmark is included if it matches the active tag (or if no tag is active)
        // AND if it matches the search term (or if no search term is entered).
        const hasTag = !activeTag || tags.includes(activeTag);
        const matchesSearch = !lowercasedTerm ||
          bookmark.name.toLowerCase().includes(lowercasedTerm) ||
          bookmark.url.toLowerCase().includes(lowercasedTerm) ||
          bookmark.domain.toLowerCase().includes(lowercasedTerm);

        if (hasTag && matchesSearch) {
          acc.push(node);
        }
      } else { // It's a folder
        // Recursively filter the children of the folder.
        const filteredChildren = filterNodes(node.children);

        // A folder is included if its own name matches the search, OR if it has any children that match.
        const matchesSearch = node.name.toLowerCase().includes(lowercasedTerm);

        if (filteredChildren.length > 0 || matchesSearch) {
          // If the folder name itself matches the search and there's no tag filter,
          // show all its original children. Otherwise, show only the filtered children.
          const childrenToShow = (matchesSearch && !activeTag) ? node.children : filteredChildren;
          acc.push({ ...node, children: childrenToShow });
        }
      }
      return acc;
    }, [] as TreeNode[]);
  };

  return filterNodes(nodes);
}

// --- Color Generation Utility ---
// A predefined palette of Tailwind CSS background color classes.
const COLOR_PALETTE = [
  'bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400',
  'bg-indigo-400', 'bg-purple-400', 'bg-pink-400', 'bg-teal-400'
];

/**
 * Generates a consistent color class from a string (e.g., a domain name).
 * This uses a simple hashing algorithm to create a deterministic mapping.
 * @param domain - The input string.
 * @returns A Tailwind CSS color class string.
 */
export function generateColorFromDomain(domain: string): string {
  // Simple hash function to convert a string to a number.
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    const char = domain.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use the hash to pick a color from the palette.
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}
