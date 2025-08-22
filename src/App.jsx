// App.js
import React, { useState, useEffect } from "react"
import "./App.css"
import SearchBar from "./components/SearchBar"
import ExpandableTabs from "./components/ExpandableTabs"
import LocalBookmarks from "./components/LocalBookmarks"
import NoticeList from "./components/NoticeList"
import { posts } from "./data/posts"
import * as bookmarkFiles from "./data/bookmarkFiles"

function App() {
  const [pane, setPane] = useState("북마크")
  const [searchValue, setSearchValue] = useState("")
  const [selectedTabs, setSelectedTabs] = useState(["공통"])
  const [expanded, setExpanded] = useState(new Set())
  const [localBms, setLocalBms] = useState([])
  const [showMenu, setShowMenu] = useState(false)

  const toggle = (key) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const rightButtons = ["로컬\n북마크", "북마크", "공지"]
  const availableTabs = Object.keys(bookmarkFiles)

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

  useEffect(() => {
    setShowMenu(false)
  }, [pane])

  return (
    <div className="container">
      <div className="sidebar-left">
        {/* 상단 타이틀 */}
        <div className="pane-title">
          <div className="pane-title-left">{pane.replace("\n", " ")}</div>
          {(pane === "북마크" || pane === "공지") && (
            <button
              className="pane-menu-button"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              ⋮
            </button>
          )}
        </div>

        {/* 뱃지 펼치기 UI */}
        {pane === "북마크" && (
          <>
            <ExpandableTabs
              tabs={availableTabs}
              selectedTabs={selectedTabs}
              setSelectedTabs={setSelectedTabs}
            />
          </>
        )}

        {/* 검색 */}
        {(pane === "북마크" || pane === "공지") && (
          <div className="search-container">
            <SearchBar
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={() => console.log("검색:", searchValue)}
            />
          </div>
        )}

        {/* 북마크 콘텐츠 */}
        <div className="bookmark-list">
          {pane === "로컬\n북마크" && (
            <LocalBookmarks nodes={localBms} expanded={expanded} toggle={toggle} />
          )}

          {pane === "북마크" &&
            selectedTabs.map((tab) => (
              <div key={tab}>
                <div className="section-title">{tab}</div>
                <ul>
                  {bookmarkFiles[tab]
                    .filter((item) =>
                      !searchValue.trim() || item.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((url) => (
                      <li key={url} onClick={() => toggle(url)} className="bookmark-title">
                        {expanded.has(url) ? "▾" : "▸"} {url}
                      </li>
                    ))}
                </ul>
              </div>
            ))}

          {pane === "공지" && <NoticeList searchValue={searchValue} posts={posts} />}
        </div>
      </div>

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
