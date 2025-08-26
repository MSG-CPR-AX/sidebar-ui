// components/BookmarkList.js
// Displays a scrollable list of bookmarks.  To handle large datasets
// efficiently, this component uses react-window for virtualization.
// Each row displays the bookmark name and URL along with actions to
// open, copy and view details.

import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { ExternalLink, Copy, Info } from 'lucide-react';

export default function BookmarkList({ bookmarks, onSelect, onCopy, onOpen }) {
  // Render a single row.  The style prop is applied by react-window.
  const Row = ({ index, style }) => {
    const bm = bookmarks[index];
    return (
      <div
        style={style}
        className="flex items-center justify-between px-2 py-1 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <div className="flex-1 overflow-hidden">
          <div className="font-medium truncate text-gray-900 dark:text-gray-100">
            {bm.name}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {bm.url}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          <button
            onClick={() => onOpen(bm)}
            title="열기"
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ExternalLink size={16} />
          </button>
          <button
            onClick={() => onCopy(bm)}
            title="로컬에 복사"
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={() => onSelect(bm)}
            title="상세 보기"
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
          >
            <Info size={16} />
          </button>
        </div>
      </div>
    );
  };
  // Provide a fixed height based on the number of rows and a minimum height.
  const height = Math.min(bookmarks.length * 48, 400);
  return (
    <List
      height={height}
      itemCount={bookmarks.length}
      itemSize={48}
      width={'100%'}
      className="no-scrollbar"
    >
      {Row}
    </List>
  );
}