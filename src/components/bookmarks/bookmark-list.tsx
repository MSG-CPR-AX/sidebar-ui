import { useMemo, useRef, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { clsx } from 'clsx'
import { BookmarkItem } from './bookmark-item'
import { BookmarkListSkeleton } from '@/components/ui/loading'
import { EmptyState } from '@/components/layout/layout'
import { BookOpen, Search as SearchIcon } from 'lucide-react'
import type { Bookmark } from '@/types/api'

export interface BookmarkListProps {
  bookmarks: Bookmark[]
  isLoading?: boolean
  searchQuery?: string
  selectedBookmarks?: Set<string>
  pinnedBookmarks?: Set<string>
  bookmarkColors?: Map<string, string>
  sortBy?: 'name' | 'url' | 'domain' | 'category' | 'dateAdded'
  sortOrder?: 'asc' | 'desc'
  groupBy?: 'none' | 'category' | 'domain' | 'tags'
  onBookmarkSelect?: (bookmark: Bookmark) => void
  onBookmarkOpen?: (bookmark: Bookmark) => void
  onBookmarkEdit?: (bookmark: Bookmark) => void
  onBookmarkDelete?: (bookmark: Bookmark) => void
  onBookmarkPin?: (bookmark: Bookmark) => void
  onBookmarkCopy?: (bookmark: Bookmark) => void
  onBookmarkAddToLocal?: (bookmark: Bookmark) => void
  className?: string
}

interface GroupedBookmark {
  type: 'group' | 'bookmark'
  id: string
  data: string | Bookmark
  level: number
}

export function BookmarkList({
  bookmarks,
  isLoading = false,
  searchQuery = '',
  selectedBookmarks = new Set(),
  pinnedBookmarks = new Set(),
  bookmarkColors = new Map(),
  sortBy = 'name',
  sortOrder = 'asc',
  groupBy = 'none',
  onBookmarkSelect,
  onBookmarkOpen,
  onBookmarkEdit,
  onBookmarkDelete,
  onBookmarkPin,
  onBookmarkCopy,
  onBookmarkAddToLocal,
  className,
}: BookmarkListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  // Filter bookmarks based on search query
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return bookmarks

    const query = searchQuery.toLowerCase()
    return bookmarks.filter((bookmark) => {
      return (
        bookmark.name.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query) ||
        bookmark.domain.toLowerCase().includes(query) ||
        bookmark.category.toLowerCase().includes(query) ||
        bookmark.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    })
  }, [bookmarks, searchQuery])

  // Sort bookmarks
  const sortedBookmarks = useMemo(() => {
    const sorted = [...filteredBookmarks].sort((a, b) => {
      let compareValue = 0
      
      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name)
          break
        case 'url':
          compareValue = a.url.localeCompare(b.url)
          break
        case 'domain':
          compareValue = a.domain.localeCompare(b.domain)
          break
        case 'category':
          compareValue = a.category.localeCompare(b.category)
          break
        default:
          compareValue = a.name.localeCompare(b.name)
      }

      return sortOrder === 'desc' ? -compareValue : compareValue
    })

    // Always show pinned bookmarks first
    const pinned = sorted.filter((bookmark) => pinnedBookmarks.has(bookmark.url))
    const unpinned = sorted.filter((bookmark) => !pinnedBookmarks.has(bookmark.url))
    
    return [...pinned, ...unpinned]
  }, [filteredBookmarks, sortBy, sortOrder, pinnedBookmarks])

  // Group bookmarks
  const groupedItems = useMemo((): GroupedBookmark[] => {
    if (groupBy === 'none') {
      return sortedBookmarks.map((bookmark) => ({
        type: 'bookmark' as const,
        id: bookmark.url,
        data: bookmark,
        level: 0,
      }))
    }

    const groups = new Map<string, Bookmark[]>()
    
    sortedBookmarks.forEach((bookmark) => {
      let groupKey: string
      
      switch (groupBy) {
        case 'category':
          groupKey = bookmark.category ?? 'Uncategorized'
          break
        case 'domain':
          groupKey = bookmark.domain
          break
        case 'tags':
          groupKey = bookmark.tags?.[0] ?? 'Untagged'
          break
        default:
          groupKey = 'All'
      }
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, [])
      }
      groups.get(groupKey)!.push(bookmark)
    })

    const items: GroupedBookmark[] = []
    
    // Sort groups alphabetically
    const sortedGroups = Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
    
    sortedGroups.forEach(([groupName, groupBookmarks]) => {
      // Add group header
      items.push({
        type: 'group' as const,
        id: `group-${groupName}`,
        data: groupName,
        level: 0,
      })
      
      // Add bookmarks in group
      groupBookmarks.forEach((bookmark) => {
        items.push({
          type: 'bookmark' as const,
          id: bookmark.url,
          data: bookmark,
          level: 1,
        })
      })
    })

    return items
  }, [sortedBookmarks, groupBy])

  // Virtual scrolling
  const rowVirtualizer = useVirtualizer({
    count: groupedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback((index: number) => {
      const item = groupedItems[index]
      return item?.type === 'group' ? 32 : 72 // Group header: 32px, Bookmark: 72px
    }, [groupedItems]),
    overscan: 10,
  })

  const handleBookmarkOpen = useCallback((bookmark: Bookmark) => {
    // Open bookmark in new tab
    window.open(bookmark.url, '_blank', 'noopener,noreferrer')
    onBookmarkOpen?.(bookmark)
  }, [onBookmarkOpen])

  const handleBookmarkCopy = useCallback(async (bookmark: Bookmark) => {
    try {
      await navigator.clipboard.writeText(bookmark.url)
      // TODO: Show success toast
      onBookmarkCopy?.(bookmark)
    } catch (error) {
      console.error('Failed to copy URL:', error)
      // Fallback: select text manually
      const textArea = document.createElement('textarea')
      textArea.value = bookmark.url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }, [onBookmarkCopy])

  // Loading state
  if (isLoading) {
    return (
      <div className={clsx('h-full', className)}>
        <BookmarkListSkeleton count={8} />
      </div>
    )
  }

  // Empty state - no bookmarks
  if (bookmarks.length === 0) {
    return (
      <div className={clsx('h-full', className)}>
        <EmptyState
          icon={<BookOpen size={48} />}
          title="No bookmarks found"
          description="Get started by adding your first bookmark or sync from your GitLab repository."
          action={
            <button className="btn-primary">
              Add Bookmark
            </button>
          }
        />
      </div>
    )
  }

  // Empty state - no search results
  if (filteredBookmarks.length === 0 && searchQuery) {
    return (
      <div className={clsx('h-full', className)}>
        <EmptyState
          icon={<SearchIcon size={48} />}
          title="No results found"
          description={`No bookmarks match "${searchQuery}". Try adjusting your search terms.`}
        />
      </div>
    )
  }

  const virtualItems = rowVirtualizer.getVirtualItems()

  return (
    <div 
      ref={parentRef}
      className={clsx(
        'h-full overflow-auto scrollbar-hide',
        className
      )}
      role="list"
      aria-label="Bookmarks"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const item = groupedItems[virtualItem.index]
          if (!item) return null

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
              {item.type === 'group' ? (
                <div 
                  className="flex items-center px-4 py-2 text-xs font-medium text-bookmark-muted bg-dark-800/50 border-b border-sidebar-border"
                  role="heading"
                  aria-level={2}
                >
                  {item.data as string}
                </div>
              ) : (
                <div className={clsx('px-4', item.level > 0 && 'pl-6')}>
                  <BookmarkItem
                    bookmark={item.data as Bookmark}
                    isSelected={selectedBookmarks.has((item.data as Bookmark).url)}
                    isPinned={pinnedBookmarks.has((item.data as Bookmark).url)}
                    color={bookmarkColors.get((item.data as Bookmark).url)}
                    onSelect={onBookmarkSelect}
                    onOpen={handleBookmarkOpen}
                    onEdit={onBookmarkEdit}
                    onDelete={onBookmarkDelete}
                    onPin={onBookmarkPin}
                    onCopy={handleBookmarkCopy}
                    onAddToLocal={onBookmarkAddToLocal}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BookmarkList