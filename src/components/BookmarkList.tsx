import React from 'react';
import type { TreeNode } from '../utils/bookmarkUtils';
import { BookmarkItem } from './BookmarkItem';
import { FolderItem } from './FolderItem';

interface BookmarkListProps {
  nodes: TreeNode[];
  selectedTag: string | null;
  onTagClick: (tag: string) => void;
}

export function BookmarkList({ nodes, selectedTag, onTagClick }: BookmarkListProps) {
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
            />
          );
        }
        if (node.type === 'folder') {
          return (
            <FolderItem key={node.id} node={node}>
              <BookmarkList
                nodes={node.children}
                selectedTag={selectedTag}
                onTagClick={onTagClick}
              />
            </FolderItem>
          );
        }
        return null;
      })}
    </ul>
  );
}
