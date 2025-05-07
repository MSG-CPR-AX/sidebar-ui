// src/App.js
import React, { useState, useEffect } from "react"
import "./App.css"
import CustomBookmarks, { tabs as customTabs } from "./components/CustomBookmarks"
import LocalBookmarks from "./components/LocalBookmarks"
import NoticeList from "./components/NoticeList"
import SearchBar from "./components/SearchBar"
import { posts } from "./data/posts"

function App() {
  const [selectedTab, setSelectedTab] = useState("공통")
  const [searchValue, setSearchValue] = useState("")
  const [expanded, setExpanded] = useState(new Set())
  const [pane, setPane] = useState("북마크")
  const [localBms, setLocalBms] = useState([])

  const rightButtons = ["북마크", "로컬\n북마크", "공지"]

  // 로컬 북마크 로드 및 실시간 업데이트
  useEffect(() => {
    const chromeBms = window.chrome?.bookmarks
    if (!chromeBms || pane !== "로컬\n북마크") return

    const reload = () => {
      chromeBms.getTree((nodes) => {
        const roots = nodes[0]?.children || []
        setLocalBms(roots)
      })
    }

    reload()
    chromeBms.onCreated.addListener(reload)
    chromeBms.onRemoved.addListener(reload)
    chromeBms.onChanged.addListener(reload)
    chromeBms.onMoved.addListener(reload)

    return () => {
      chromeBms.onCreated.removeListener(reload)
      chromeBms.onRemoved.removeListener(reload)
      chromeBms.onChanged.removeListener(reload)
      chromeBms.onMoved.removeListener(reload)
    }
  }, [pane])

  // expand/collapse toggle
  const toggle = (key) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="container">
      <div className="sidebar-left">
        {/* Static 북마크 탭(‘북마크’ pane일 때만) */}
        {pane === "북마크" && (
          <div className="tabs">
            {customTabs.map((tab) => (
              <div
                key={tab}
                className={`tab ${selectedTab === tab ? "selected" : ""}`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
        )}

        {/* 검색창 (‘북마크’ or ‘공지’ pane일 때만) */}
        {(pane === "북마크" || pane === "공지") && (
          <div className="search-container">
            <SearchBar
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <div className="bookmark-list">
          {pane === "북마크" && (
            <CustomBookmarks
              searchValue={searchValue}
              selectedTab={selectedTab}
              expanded={expanded}
              toggle={toggle}
            />
          )}
          {pane === "로컬\n북마크" && (
            <LocalBookmarks
              nodes={localBms}
              expanded={expanded}
              toggle={toggle}
            />
          )}
          {pane === "공지" && (
            <NoticeList searchValue={searchValue} posts={posts} />
          )}
        </div>
      </div>

      {/* 오른쪽 버튼바 */}
      <div className="right-button-bar">
        {rightButtons.map((label) => (
          <button
            key={label}
            className={`right-button ${pane === label ? "active" : ""}`}
            onClick={() => setPane(label)}
          >
            {label}
          </button>
        ))}
        <button className="edit-button">수정</button>
      </div>
    </div>
  )
}

export default App