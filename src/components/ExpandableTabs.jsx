import React, { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function ExpandableTabs({ tabs, selectedTabs, setSelectedTabs }) {
  const [isExpanded, setIsExpanded] = useState(false)

  // 최초 1회 "공통"만 선택되게 보장
  useEffect(() => {
    if (selectedTabs.length === 0 && tabs.includes("공통")) {
      setSelectedTabs(["공통"])
    }
  }, [tabs, selectedTabs, setSelectedTabs])

  const toggleTab = (tab) => {
    if (selectedTabs.includes(tab)) {
      setSelectedTabs(selectedTabs.filter((t) => t !== tab))
    } else {
      setSelectedTabs([...selectedTabs, tab])
    }
  }

  return (
    <div className="expandable-tabs-wrapper">
      <div className="selected-tabs-preview">
        {selectedTabs.map((tab) => (
          <div
            key={tab}
            className={`preview-badge ${selectedTabs.includes(tab) ? "selected" : ""}`}
            onClick={() => toggleTab(tab)}
            title="클릭 시 선택 해제"
          >
            {tab}
          </div>
        ))}

        <button
          className={`tab-toggle-btn ${isExpanded ? "expanded" : ""}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="expandable-tab-overlay">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`rounded-tab ${selectedTabs.includes(tab) ? "selected" : ""}`}
              onClick={() => toggleTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
