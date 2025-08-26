// components/Header.js
// Displays the top navigation with pane selectors and a refresh button.
// Pane selectors are small buttons that toggle between remote bookmarks,
// local bookmarks and the notice board.  A refresh button triggers
// invalidation of the bookmark cache.

import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function Header({ pane, setPane, onRefresh }) {
  const buttons = [
    { key: 'remote', label: '북마크' },
    { key: 'local', label: '로컬' },
    { key: 'notice', label: '공지' }
  ];
  return (
    <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-base font-semibold">사이드북마크</h1>
      <div className="flex items-center gap-2">
        {buttons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setPane(btn.key)}
            className={`text-sm px-2 py-1 rounded transition-colors duration-100 ${
              pane === btn.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
            }`}
          >
            {btn.label}
          </button>
        ))}
        <button
          onClick={onRefresh}
          title="새로고침"
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </div>
  );
}