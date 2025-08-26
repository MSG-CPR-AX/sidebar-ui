import React, { useState } from 'react';
import type { TreeNode } from '../utils/bookmarkUtils';

interface FolderItemProps {
  node: TreeNode;
  children: React.ReactNode; // To render the nested list
}

export function FolderItem({ node, children }: FolderItemProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded

  return (
    <li>
      <div
        className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="mr-2">
          {isExpanded ? '▼' : '►'}
        </span>
        {/* Folder Icon will go here */}
        <span className="font-bold">{node.name}</span>
      </div>
      {isExpanded && (
        <ul className="pl-4">
          {children}
        </ul>
      )}
    </li>
  );
}
