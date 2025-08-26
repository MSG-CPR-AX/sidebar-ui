import React from 'react';
import type { TreeNode } from '../utils/bookmarkUtils';
import { flattenTags } from '../utils/bookmarkUtils';
import { TagPill } from './TagPill';

interface BookmarkItemProps {
  node: TreeNode;
  selectedTag: string | null;
  onTagClick: (tag: string) => void;
}

export function BookmarkItem({ node, selectedTag, onTagClick }: BookmarkItemProps) {
  const tags = node.data ? flattenTags(node.data.packages) : [];

  return (
    <li className="p-2 hover:bg-gray-100 rounded-md">
      <div className="flex items-center">
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
        <a href={node.data?.url} target="_blank" rel="noopener noreferrer" className="truncate font-medium">
          {node.name}
        </a>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 pl-5 flex flex-wrap gap-2">
          {tags.map(tag => (
            <TagPill
              key={tag}
              tag={tag}
              isSelected={selectedTag === tag}
              onClick={onTagClick}
            />
          ))}
        </div>
      )}
    </li>
  );
}
