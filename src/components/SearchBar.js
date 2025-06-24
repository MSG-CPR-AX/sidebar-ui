import React from "react"

export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="search-bar">
      <input
        className="search-input"
        type="text"
        placeholder="검색"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch?.()
        }}
      />
      <button className="search-button" onClick={onSearch}>
        🔍
      </button>
    </div>
  )
}