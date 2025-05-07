import React from "react"
import { bookmarks } from "../data/bookmarks"

// 탭 배열을 외부에서 참조할 수 있도록 export
export const tabs = ["공통", "SM전환", "Wafful Upgrade", "기타"]

export default function StaticBookmarks({
  searchValue,
  selectedTab,
  expanded,
  toggle
}) {
  // 검색어 기반 필터
  const q = searchValue.trim().toLowerCase()
  const filtered = bookmarks.filter((bm) => {
    if (!q) return true
    if (bm.title.toLowerCase().includes(q)) return true
    return bm.children.some((c) => c.toLowerCase().includes(q))
  })

  return (
    <ul>
      {filtered.map((bm) => (
        <li key={bm.title} className="bookmark-item">
          <div
            className="bookmark-title"
            onClick={() => toggle(bm.title)}
            style={{ cursor: bm.children.length ? "pointer" : "default" }}
          >
            {bm.children.length > 0 && (
              <span className="toggle-icon">
                {expanded.has(bm.title) ? "▾" : "▸"}
              </span>
            )}
            {bm.title}
          </div>
          {expanded.has(bm.title) && bm.children.length > 0 && (
            <ul className="bookmark-children">
              {bm.children
                .filter((c) =>
                  !q ? true : c.toLowerCase().includes(q)
                )
                .map((child) => (
                  <li key={child}>{child}</li>
                ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
