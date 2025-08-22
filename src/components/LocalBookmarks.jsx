import React from "react"

/**
 * nodes: chrome.bookmarks.BookmarkTreeNode[]
 * expanded: Set<string|number>
 * toggle: (key: string|number) => void
 */
export default function LocalBookmarks({ nodes, expanded, toggle }) {
  const renderTree = (items) => (
    <ul>
      {items.map((n) => (
        <li key={n.id} className="bookmark-item">
          {n.children && n.children.length > 0 ? (
            <>
              <div
                className="bookmark-title"
                onClick={() => toggle(n.id)}
                style={{ cursor: "pointer" }}
              >
                <span className="toggle-icon">
                  {expanded.has(n.id) ? "▾" : "▸"}
                </span>
                <strong>{n.title}</strong>
              </div>
              {expanded.has(n.id) && renderTree(n.children)}
            </>
          ) : (
            <a href={n.url} target="_blank" rel="noreferrer">
              {n.title || n.url}
            </a>
          )}
        </li>
      ))}
    </ul>
  )

  return renderTree(nodes)
}
