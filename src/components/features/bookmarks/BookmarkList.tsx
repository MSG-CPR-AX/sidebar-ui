import React, { useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useBookmarkData } from '../../../lib/hooks/useBookmarkData'
import { BookmarkListItem } from './BookmarkListItem'
import { Bookmark } from '../../../lib/types'

interface BookmarkListProps {
  searchTerm: string
  onEditBookmark: (bookmark: Bookmark) => void
}

export const BookmarkList = ({
  searchTerm,
  onEditBookmark,
}: BookmarkListProps) => {
  const { data, isLoading, isError, error } = useBookmarkData()
  const parentRef = React.useRef<HTMLDivElement>(null)

  const filteredBookmarks = useMemo(() => {
    if (!data) return []
    if (!searchTerm) return data.bookmarks

    const lowercasedFilter = searchTerm.toLowerCase()
    return data.bookmarks.filter(
      (bm) =>
        bm.title.toLowerCase().includes(lowercasedFilter) ||
        bm.url.toLowerCase().includes(lowercasedFilter) ||
        (bm.description &&
          bm.description.toLowerCase().includes(lowercasedFilter))
    )
  }, [data, searchTerm])

  const rowVirtualizer = useVirtualizer({
    count: filteredBookmarks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  })

  if (isLoading) return <div className="p-4 text-gray-400">Loading...</div>
  if (isError)
    return <div className="p-4 text-red-400">Error: {error.message}</div>
  if (!data) return <div className="p-4 text-gray-400">No data.</div>
  if (filteredBookmarks.length === 0)
    return <div className="p-4 text-gray-400">No matches.</div>

  return (
    <div ref={parentRef} className="h-full overflow-y-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const bookmark = filteredBookmarks[virtualItem.index]
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <BookmarkListItem
                bookmark={bookmark}
                allTags={data.tags}
                onEdit={() => onEditBookmark(bookmark)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
