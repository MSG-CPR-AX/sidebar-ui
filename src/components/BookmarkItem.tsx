import { useState } from 'react';
import type { TreeNode, Bookmark } from '../utils/bookmarkUtils';
import { flattenTags, generateColorFromDomain } from '../utils/bookmarkUtils';
import { TagPill } from './TagPill';
import { ContextMenu } from './ContextMenu';
import type { MenuItem } from './ContextMenu';
import { LinkIcon } from './icons/LinkIcon';

interface BookmarkItemProps {
  node: TreeNode;
  selectedTag: string | null;
  onTagClick: (tag: string) => void;
  onCopyToLocal: (bookmark: Bookmark) => void;
  onShowDetails: (bookmark: Bookmark) => void;
}

export function BookmarkItem({ node, selectedTag, onTagClick, onCopyToLocal, onShowDetails }: BookmarkItemProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

  const tags = node.data ? flattenTags(node.data.packages) : [];
  const colorClass = node.data ? generateColorFromDomain(node.data.domain) : 'bg-gray-400';

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  const handleShowDetails = () => {
    if (node.data) {
      onShowDetails(node.data);
    }
  }

  const menuItems: MenuItem[] = [
    {
      label: 'Copy to Local Bookmarks',
      action: () => {
        if (node.data) onCopyToLocal(node.data);
      },
    },
  ];

  return (
    <li
      className="my-1 p-2 rounded-md hover:bg-gray-100"
      onContextMenu={handleContextMenu}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center cursor-pointer flex-grow truncate" onClick={handleShowDetails}>
          <span className={`w-2 h-2 ${colorClass} rounded-full mr-3 flex-shrink-0`}></span>
          <span className="truncate font-medium text-sm">{node.name}</span>
        </div>
        <a
          href={node.data?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 p-1 text-gray-400 hover:text-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <LinkIcon className="w-4 h-4" />
        </a>
      </div>

      {tags.length > 0 && (
        <div className="mt-2 ml-5 flex flex-wrap gap-2">
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

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={menuItems}
          onClose={() => setContextMenu(null)}
        />
      )}
    </li>
  );
}
