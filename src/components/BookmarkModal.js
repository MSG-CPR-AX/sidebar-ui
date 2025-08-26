// components/BookmarkModal.js
// Modal dialog for displaying detailed information about a bookmark.
// Shows name, URL, domain, category, optional packages and metadata,
// and a link to the source YAML file in GitLab for editing.

import React from 'react';

export default function BookmarkModal({ bookmark, onClose }) {
  if (!bookmark) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white dark:bg-gray-800 rounded shadow-lg w-80 max-w-sm p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {bookmark.name}
        </h2>
        <div className="space-y-1 text-sm">
          <div>
            <span className="font-medium">URL:</span>{' '}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 underline break-all"
            >
              {bookmark.url}
            </a>
          </div>
          <div>
            <span className="font-medium">도메인:</span> {bookmark.domain}
          </div>
          <div>
            <span className="font-medium">카테고리:</span> {bookmark.category}
          </div>
          {bookmark.packages && bookmark.packages.length > 0 && (
            <div>
              <span className="font-medium">패키지:</span>{' '}
              {bookmark.packages.map((pkg) => pkg.key).join(' / ')}
            </div>
          )}
          {bookmark.meta && Object.keys(bookmark.meta).length > 0 && (
            <div>
              <span className="font-medium">메타정보:</span>{' '}
              {Object.entries(bookmark.meta)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')}
            </div>
          )}
          {bookmark.sourcePath && (
            <div>
              <span className="font-medium">소스:</span>{' '}
              <a
                href={bookmark.sourcePath}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 underline break-all"
              >
                {bookmark.sourcePath}
              </a>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}