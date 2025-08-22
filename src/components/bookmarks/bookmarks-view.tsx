import { useState, useMemo, useCallback, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { clsx } from 'clsx'
import { BookmarkList } from './bookmark-list'
import { FilterControls } from './filter-controls'
import { TabContent } from '@/components/layout/layout'
import { useBookmarks } from '@/hooks/use-bookmarks'
import type { Bookmark } from '@/types/api'

export interface BookmarksViewProps {
  searchQuery: string
  className?: string
}

export function BookmarksView({ searchQuery, className }: BookmarksViewProps) {
  // Filter and sort state
  const [sortBy, setSortBy] = useState<'name' | 'url' | 'domain' | 'category' | 'dateAdded'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [groupBy, setGroupBy] = useState<'none' | 'category' | 'domain' | 'tags'>('none')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [pinnedOnly, setPinnedOnly] = useState(false)
  
  // UI state
  const [selectedBookmarks, setSelectedBookmarks] = useState<Set<string>>(new Set())
  const [pinnedBookmarks, setPinnedBookmarks] = useState<Set<string>>(new Set())
  const [bookmarkColors, setBookmarkColors] = useState<Map<string, string>>(new Map())
  const [focusedIndex, setFocusedIndex] = useState(0)

  // Fetch bookmarks data
  const { data: bookmarks = [], isLoading, error } = useBookmarks()

  // Extract available options from bookmarks
  const { availableTags, availableCategories } = useMemo(() => {
    const tags = new Set<string>()
    const categories = new Set<string>()
    
    bookmarks.forEach((bookmark) => {
      if (bookmark.tags) {
        bookmark.tags.forEach(tag => tags.add(tag))
      }
      if (bookmark.category) {
        categories.add(bookmark.category)
      }
    })
    
    return {
      availableTags: Array.from(tags).sort(),
      availableCategories: Array.from(categories).sort(),
    }
  }, [bookmarks])

  // Filter bookmarks based on all criteria
  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((bookmark) => {
        return (
          bookmark.name.toLowerCase().includes(query) ||
          bookmark.url.toLowerCase().includes(query) ||
          bookmark.domain.toLowerCase().includes(query) ||
          bookmark.category.toLowerCase().includes(query) ||
          bookmark.tags?.some((tag) => tag.toLowerCase().includes(query))
        )
      })
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((bookmark) =>
        bookmark.tags?.some((tag) => selectedTags.includes(tag))
      )
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((bookmark) =>
        selectedCategories.includes(bookmark.category)
      )
    }

    // Apply color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter((bookmark) => {
        const color = bookmarkColors.get(bookmark.url)
        return color && selectedColors.includes(color)
      })
    }

    // Apply pinned filter
    if (pinnedOnly) {
      filtered = filtered.filter((bookmark) => pinnedBookmarks.has(bookmark.url))
    }

    return filtered
  }, [bookmarks, searchQuery, selectedTags, selectedCategories, selectedColors, pinnedOnly, bookmarkColors, pinnedBookmarks])

  // Handle bookmark selection
  const handleBookmarkSelect = useCallback((bookmark: Bookmark) => {
    setSelectedBookmarks((prev) => {
      const next = new Set(prev)
      if (next.has(bookmark.url)) {
        next.delete(bookmark.url)
      } else {
        next.add(bookmark.url)
      }
      return next
    })
  }, [])

  // Handle bookmark operations
  const handleBookmarkOpen = useCallback((bookmark: Bookmark) => {
    // Analytics/tracking could go here
    console.log('Opening bookmark:', bookmark.name)
  }, [])

  const handleBookmarkEdit = useCallback((bookmark: Bookmark) => {
    // Route to GitLab for editing
    if (bookmark.sourcePath) {
      const gitLabBaseUrl = import.meta.env.VITE_GITLAB_BASE_URL || 'https://gitlab.com'
      const editUrl = `${gitLabBaseUrl}${bookmark.sourcePath}/-/edit`
      window.open(editUrl, '_blank', 'noopener,noreferrer')
    } else {
      console.warn('No source path available for bookmark:', bookmark.name)
    }
  }, [])

  const handleBookmarkDelete = useCallback((bookmark: Bookmark) => {
    // Route to GitLab for deletion (same as edit, user can delete the entry)
    handleBookmarkEdit(bookmark)
  }, [handleBookmarkEdit])

  const handleBookmarkPin = useCallback((bookmark: Bookmark) => {
    setPinnedBookmarks((prev) => {
      const next = new Set(prev)
      if (next.has(bookmark.url)) {
        next.delete(bookmark.url)
      } else {
        next.add(bookmark.url)
      }
      return next
    })
  }, [])

  const handleBookmarkAddToLocal = useCallback(async (bookmark: Bookmark) => {
    try {
      if (chrome?.bookmarks) {
        await chrome.bookmarks.create({
          title: bookmark.name,
          url: bookmark.url,
        })
        console.log('Added bookmark to local:', bookmark.name)
        // TODO: Show success toast
      }
    } catch (error) {
      console.error('Failed to add bookmark to local:', error)
      // TODO: Show error toast
    }
  }, [])

  // Handle filter changes
  const handleSortChange = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy as any)
    setSortOrder(newSortOrder)
  }, [])

  const handleGroupChange = useCallback((newGroupBy: string) => {
    setGroupBy(newGroupBy as any)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSelectedTags([])
    setSelectedCategories([])
    setSelectedColors([])
    setPinnedOnly(false)
  }, [])

  // Keyboard shortcuts
  useHotkeys('cmd+a, ctrl+a', (event) => {
    event.preventDefault()
    // Select all visible bookmarks
    const allUrls = filteredBookmarks.map(b => b.url)
    setSelectedBookmarks(new Set(allUrls))
  }, { enableOnContentEditable: true })

  useHotkeys('escape', () => {
    // Clear selection
    setSelectedBookmarks(new Set())
    setFocusedIndex(0)
  }, { enableOnContentEditable: true })

  useHotkeys('cmd+d, ctrl+d', (event) => {
    event.preventDefault()
    // Add selected bookmarks to local
    selectedBookmarks.forEach(url => {
      const bookmark = filteredBookmarks.find(b => b.url === url)
      if (bookmark) {
        handleBookmarkAddToLocal(bookmark)
      }
    })
  }, { enableOnContentEditable: true })

  useHotkeys('delete, backspace', (event) => {
    if (selectedBookmarks.size > 0) {
      event.preventDefault()
      // Delete selected bookmarks (route to GitLab)
      selectedBookmarks.forEach(url => {
        const bookmark = filteredBookmarks.find(b => b.url === url)
        if (bookmark) {
          handleBookmarkDelete(bookmark)
        }
      })
    }
  }, { enableOnContentEditable: true })

  useHotkeys('cmd+shift+p, ctrl+shift+p', (event) => {
    event.preventDefault()
    // Toggle pinned only filter
    setPinnedOnly(prev => !prev)
  }, { enableOnContentEditable: true })

  // Arrow key navigation
  useHotkeys('up', (event) => {
    event.preventDefault()
    setFocusedIndex(prev => Math.max(0, prev - 1))
  }, { enableOnContentEditable: true })

  useHotkeys('down', (event) => {
    event.preventDefault()
    setFocusedIndex(prev => Math.min(filteredBookmarks.length - 1, prev + 1))
  }, { enableOnContentEditable: true })

  useHotkeys('enter', (event) => {
    event.preventDefault()
    const bookmark = filteredBookmarks[focusedIndex]
    if (bookmark) {
      handleBookmarkOpen(bookmark)
    }
  }, { enableOnContentEditable: true })

  // Load saved preferences from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sidebeam-bookmark-preferences')
      if (saved) {
        const prefs = JSON.parse(saved)
        if (prefs.sortBy) setSortBy(prefs.sortBy)
        if (prefs.sortOrder) setSortOrder(prefs.sortOrder)
        if (prefs.groupBy) setGroupBy(prefs.groupBy)
        if (prefs.pinnedBookmarks) setPinnedBookmarks(new Set(prefs.pinnedBookmarks))
        if (prefs.bookmarkColors) setBookmarkColors(new Map(prefs.bookmarkColors))
      }
    } catch (error) {
      console.warn('Failed to load bookmark preferences:', error)
    }
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    try {
      const prefs = {
        sortBy,
        sortOrder,
        groupBy,
        pinnedBookmarks: Array.from(pinnedBookmarks),
        bookmarkColors: Array.from(bookmarkColors),
      }
      localStorage.setItem('sidebeam-bookmark-preferences', JSON.stringify(prefs))
    } catch (error) {
      console.warn('Failed to save bookmark preferences:', error)
    }
  }, [sortBy, sortOrder, groupBy, pinnedBookmarks, bookmarkColors])

  if (error) {
    console.error('Error loading bookmarks:', error)
  }

  return (
    <div className={clsx('h-full flex flex-col', className)}>
      {/* Filter Controls */}
      <FilterControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        groupBy={groupBy}
        selectedTags={selectedTags}
        selectedCategories={selectedCategories}
        selectedColors={selectedColors}
        pinnedOnly={pinnedOnly}
        availableTags={availableTags}
        availableCategories={availableCategories}
        onSortChange={handleSortChange}
        onGroupChange={handleGroupChange}
        onTagsChange={setSelectedTags}
        onCategoriesChange={setSelectedCategories}
        onColorsChange={setSelectedColors}
        onPinnedOnlyChange={setPinnedOnly}
        onClearFilters={handleClearFilters}
      />

      {/* Bookmark List */}
      <TabContent padding={false} className="flex-1">
        <BookmarkList
          bookmarks={filteredBookmarks}
          isLoading={isLoading}
          searchQuery={searchQuery}
          selectedBookmarks={selectedBookmarks}
          pinnedBookmarks={pinnedBookmarks}
          bookmarkColors={bookmarkColors}
          sortBy={sortBy}
          sortOrder={sortOrder}
          groupBy={groupBy}
          onBookmarkSelect={handleBookmarkSelect}
          onBookmarkOpen={handleBookmarkOpen}
          onBookmarkEdit={handleBookmarkEdit}
          onBookmarkDelete={handleBookmarkDelete}
          onBookmarkPin={handleBookmarkPin}
          onBookmarkAddToLocal={handleBookmarkAddToLocal}
        />
      </TabContent>

      {/* Status bar with selection info */}
      {selectedBookmarks.size > 0 && (
        <div className="px-4 py-2 bg-dark-800 border-t border-sidebar-border">
          <div className="flex items-center justify-between text-sm text-bookmark-muted">
            <span>
              {selectedBookmarks.size} bookmark{selectedBookmarks.size === 1 ? '' : 's'} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  selectedBookmarks.forEach(url => {
                    const bookmark = filteredBookmarks.find(b => b.url === url)
                    if (bookmark) {
                      handleBookmarkAddToLocal(bookmark)
                    }
                  })
                }}
                className="text-accent-blue hover:text-blue-400 text-xs"
              >
                Add to Local (⌘D)
              </button>
              <button
                onClick={() => setSelectedBookmarks(new Set())}
                className="text-bookmark-muted hover:text-bookmark-text text-xs"
              >
                Clear (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookmarksView