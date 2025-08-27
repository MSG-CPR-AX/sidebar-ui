import type { TreeNode, Bookmark } from '../utils/bookmarkUtils';
import { BookmarkItem } from './BookmarkItem';
import { FolderItem } from './FolderItem';

/**
 * Props for the BookmarkList component.
 */
interface BookmarkListProps {
  nodes: TreeNode[]; // The array of tree nodes to render.
  selectedTag: string | null; // The currently active tag filter.
  onTagClick: (tag: string) => void; // Callback for when a tag is clicked.
  onCopyToLocal: (bookmark: Bookmark) => void; // Callback to copy a bookmark.
  onShowDetails: (bookmark: Bookmark) => void; // Callback to show the detail modal.
}

/**
 * A recursive component that renders the bookmark tree.
 * It iterates over an array of nodes and renders either a `BookmarkItem` or a `FolderItem`.
 * For folders, it recursively renders another `BookmarkList` for the children.
 */
export function BookmarkList({ nodes, selectedTag, onTagClick, onCopyToLocal, onShowDetails }: BookmarkListProps) {
  if (!nodes || nodes.length === 0) {
    return null;
  }

  return (
    <ul>
      {nodes.map((node) => {
        if (node.type === 'bookmark') {
          return (
            <BookmarkItem
              key={node.id}
              node={node}
              selectedTag={selectedTag}
              onTagClick={onTagClick}
              onCopyToLocal={onCopyToLocal}
              onShowDetails={onShowDetails}
            />
          );
        }
        if (node.type === 'folder') {
          return (
            <FolderItem key={node.id} node={node}>
              {/* This is the recursion: a FolderItem contains another BookmarkList. */}
              <BookmarkList
                nodes={node.children}
                selectedTag={selectedTag}
                onTagClick={onTagClick}
                onCopyToLocal={onCopyToLocal}
                onShowDetails={onShowDetails}
              />
            </FolderItem>
          );
        }
        return null;
      })}
    </ul>
  );
}
