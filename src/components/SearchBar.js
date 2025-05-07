import React from "react"

export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="search-input"
      type="text"
      placeholder="검색"
      value={value}
      onChange={onChange}
    />
  )
}
