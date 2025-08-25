import { useLocalBookmarks } from '../../../lib/hooks/useLocalBookmarks'
import { LocalBookmarkNode } from './LocalBookmarkNode'

export const LocalBookmarkTree = () => {
  const { bookmarks, loading, error } = useLocalBookmarks()

  if (loading) {
    return <div className="p-4 text-gray-400">Loading local bookmarks...</div>
  }

  if (error) {
    return <div className="p-4 text-red-400">{error}</div>
  }

  if (bookmarks.length === 0) {
    return <div className="p-4 text-gray-400">No local bookmarks found.</div>
  }

  return (
    <div className="space-y-1 p-2">
      {bookmarks.map((node) => (
        <LocalBookmarkNode key={node.id} node={node} level={0} />
      ))}
    </div>
  )
}
