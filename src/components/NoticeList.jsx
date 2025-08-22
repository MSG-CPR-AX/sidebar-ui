import React from "react"
import { posts } from "../data/posts"

export default function NoticeList({ searchValue }) {
  const q = searchValue.trim().toLowerCase()
  const filtered = posts.filter((p) => {
    if (!q) return true
    return (
      p.title.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.date.includes(q) ||
      String(p.id).includes(q)
    )
  })

  return (
    <table className="notice-table">
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((post) => (
          <tr key={post.id}>
            <td>{post.id}</td>
            <td>{post.title}</td>
            <td>{post.author}</td>
            <td>{post.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
