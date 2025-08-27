import React, { useState } from 'react';
import type { TreeNode } from '../utils/bookmarkUtils';
import { FolderIcon } from './icons/FolderIcon';

interface FolderItemProps {
  node: TreeNode;
  children: React.ReactNode;
}

export function FolderItem({ node, children }: FolderItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <li className="my-1">
      <div
        className="flex items-center p-1 rounded-md hover:bg-gray-100 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className={`w-4 h-4 mr-1 transition-transform duration-100 ${isExpanded ? 'rotate-90' : ''}`}>
          <svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5v10z" fill="currentColor"/></svg>
        </span>
        <FolderIcon className="w-5 h-5 mr-2 text-gray-600" />
        <span className="font-medium text-sm truncate">{node.name}</span>
      </div>
      {isExpanded && (
        <ul className="pl-5 border-l border-gray-200 ml-2">
          {children}
        </ul>
      )}
    </li>
  );
}
