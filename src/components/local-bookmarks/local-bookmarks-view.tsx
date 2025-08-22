import { useState, useEffect, useCallback } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { clsx } from 'clsx'
import { TabContent, EmptyState } from '@/components/layout/layout'
import { LoadingState } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  BookOpen, 
  ExternalLink,
  MoreVertical,
  Edit3,
  Copy,
  Trash2,
  Plus,
  Home
} from 'lucide-react'

interface BookmarkNode {
  id: string
  title: string
  url?: string
  children?: BookmarkNode[]
  dateAdded?: number
  dateGroupModified?: number
  parentId?: string
  index?: number
}

export interface LocalBookmarksViewProps {
  searchQuery: string
  className?: string
}

export function LocalBookmarksView({ searchQuery, className }: LocalBookmarksViewProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkNode[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [selectedBookmarks, setSelectedBookmarks] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    bookmark: BookmarkNode
  } | null>(null)

  // Load bookmarks from Chrome API
  const loadBookmarks = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (!chrome?.bookmarks) {
        throw new Error('Chrome bookmarks API not available')
      }

      const bookmarkTree = await chrome.bookmarks.getTree()
      const rootNodes = bookmarkTree[0]?.children || []
      
      setBookmarks(rootNodes)
    } catch (err) {
      console.error('Failed to load bookmarks:', err)
      setError(err instanceof Error ? err.message : 'Failed to load bookmarks')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Set up Chrome bookmarks event listeners
  useEffect(() => {
    loadBookmarks()

    if (chrome?.bookmarks) {
      const handleBookmarkCreated = () => loadBookmarks()
      const handleBookmarkRemoved = () => loadBookmarks()
      const handleBookmarkChanged = () => loadBookmarks()
      const handleBookmarkMoved = () => loadBookmarks()

      chrome.bookmarks.onCreated.addListener(handleBookmarkCreated)
      chrome.bookmarks.onRemoved.addListener(handleBookmarkRemoved)
      chrome.bookmarks.onChanged.addListener(handleBookmarkChanged)
      chrome.bookmarks.onMoved.addListener(handleBookmarkMoved)

      return () => {
        chrome.bookmarks.onCreated.removeListener(handleBookmarkCreated)
        chrome.bookmarks.onRemoved.removeListener(handleBookmarkRemoved)
        chrome.bookmarks.onChanged.removeListener(handleBookmarkChanged)
        chrome.bookmarks.onMoved.removeListener(handleBookmarkMoved)
      }
    }
  }, [loadBookmarks])

  // Filter bookmarks based on search query
  const filterBookmarks = useCallback((nodes: BookmarkNode[], query: string): BookmarkNode[] => {
    if (!query.trim()) return nodes

    const searchTerm = query.toLowerCase()
    const filtered: BookmarkNode[] = []

    const searchNode = (node: BookmarkNode): BookmarkNode | null => {
      const matchesTitle = node.title.toLowerCase().includes(searchTerm)
      const matchesUrl = node.url?.toLowerCase().includes(searchTerm) || false
      
      if (node.children) {
        // For folders, check if any children match
        const matchingChildren = node.children
          .map(child => searchNode(child))
          .filter(Boolean) as BookmarkNode[]
        
        if (matchingChildren.length > 0 || matchesTitle) {
          return {
            ...node,
            children: matchingChildren.length > 0 ? matchingChildren : node.children,
          }
        }
      } else if (matchesTitle || matchesUrl) {
        // For bookmarks, include if title or URL matches
        return node
      }
      
      return null
    }

    nodes.forEach(node => {
      const result = searchNode(node)
      if (result) {
        filtered.push(result)
        // Auto-expand folders with search results
        if (result.children && query.trim()) {
          setExpandedFolders(prev => new Set([...prev, result.id]))
        }
      }
    })

    return filtered
  }, [])

  const filteredBookmarks = filterBookmarks(bookmarks, searchQuery)

  // Toggle folder expansion
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }, [])

  // Handle bookmark operations
  const handleBookmarkOpen = useCallback((bookmark: BookmarkNode) => {
    if (bookmark.url) {
      window.open(bookmark.url, '_blank', 'noopener,noreferrer')
    }
  }, [])

  const handleBookmarkEdit = useCallback(async (bookmark: BookmarkNode) => {
    try {
      if (!chrome?.bookmarks) return

      const newTitle = prompt('Edit bookmark title:', bookmark.title)
      if (newTitle && newTitle !== bookmark.title) {
        await chrome.bookmarks.update(bookmark.id, { title: newTitle })
      }

      if (bookmark.url) {
        const newUrl = prompt('Edit bookmark URL:', bookmark.url)
        if (newUrl && newUrl !== bookmark.url) {
          await chrome.bookmarks.update(bookmark.id, { url: newUrl })
        }
      }
    } catch (error) {
      console.error('Failed to edit bookmark:', error)
    }
  }, [])

  const handleBookmarkDelete = useCallback(async (bookmark: BookmarkNode) => {
    try {
      if (!chrome?.bookmarks) return

      const confirmDelete = confirm(
        `Are you sure you want to delete "${bookmark.title}"?${
          bookmark.children ? ' This will delete all bookmarks in this folder.' : ''
        }`
      )

      if (confirmDelete) {
        await chrome.bookmarks.remove(bookmark.id)
      }
    } catch (error) {
      console.error('Failed to delete bookmark:', error)
    }
  }, [])

  const handleBookmarkCopy = useCallback(async (bookmark: BookmarkNode) => {
    if (!bookmark.url) return

    try {
      await navigator.clipboard.writeText(bookmark.url)
      // TODO: Show success toast
    } catch (error) {
      console.error('Failed to copy URL:', error)
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = bookmark.url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }, [])

  const handleCreateBookmark = useCallback(async (parentId?: string) => {
    try {
      if (!chrome?.bookmarks) return

      const title = prompt('Bookmark title:')
      const url = prompt('Bookmark URL:')
      
      if (title && url) {
        await chrome.bookmarks.create({
          parentId: parentId || '1', // Default to bookmarks bar
          title,
          url,
        })
      }
    } catch (error) {
      console.error('Failed to create bookmark:', error)
    }
  }, [])

  const handleCreateFolder = useCallback(async (parentId?: string) => {
    try {
      if (!chrome?.bookmarks) return

      const title = prompt('Folder name:')
      
      if (title) {
        await chrome.bookmarks.create({
          parentId: parentId || '1', // Default to bookmarks bar
          title,
        })
      }
    } catch (error) {
      console.error('Failed to create folder:', error)
    }
  }, [])

  // Handle context menu
  const handleContextMenu = useCallback((event: React.MouseEvent, bookmark: BookmarkNode) => {
    event.preventDefault()
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      bookmark,
    })
  }, [])

  // Close context menu
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null)
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContextMenu(null)
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  // Keyboard shortcuts
  useHotkeys('cmd+n, ctrl+n', (event) => {
    event.preventDefault()
    handleCreateBookmark()
  }, { enableOnContentEditable: true })

  useHotkeys('cmd+shift+n, ctrl+shift+n', (event) => {
    event.preventDefault()
    handleCreateFolder()
  }, { enableOnContentEditable: true })

  // Render bookmark node
  const renderBookmark = useCallback((
    node: BookmarkNode, 
    level: number = 0,
    parentId?: string
  ) => {
    const isFolder = !!node.children
    const isExpanded = expandedFolders.has(node.id)
    const isSelected = selectedBookmarks.has(node.id)

    return (
      <div key={node.id}>
        <div
          className={clsx(
            'flex items-center gap-2 px-3 py-2 hover:bg-bookmark-hover rounded-lg cursor-pointer group',
            isSelected && 'bg-bookmark-selected',
            level > 0 && 'ml-4'
          )}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={() => {
            if (isFolder) {
              toggleFolder(node.id)
            } else {
              handleBookmarkOpen(node)
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, node)}
          role="button"
          tabIndex={0}
          aria-expanded={isFolder ? isExpanded : undefined}
        >
          {/* Folder icon or chevron */}
          {isFolder ? (
            <div className="flex items-center gap-1">
              {isExpanded ? (
                <ChevronDown size={16} className="text-bookmark-muted" />
              ) : (
                <ChevronRight size={16} className="text-bookmark-muted" />
              )}
              <Folder size={16} className="text-accent-yellow" />
            </div>
          ) : (
            <div className="flex items-center gap-1 ml-4">
              <BookOpen size={16} className="text-accent-blue" />
            </div>
          )}

          {/* Title */}
          <span className="flex-1 text-sm text-bookmark-text truncate">
            {node.title || 'Untitled'}
          </span>

          {/* Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="icon"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleContextMenu(e, node)
              }}
            >
              <MoreVertical size={14} />
            </Button>
          </div>
        </div>

        {/* Children */}
        {isFolder && isExpanded && node.children && (
          <div>
            {node.children.map(child => 
              renderBookmark(child, level + 1, node.id)
            )}
          </div>
        )}
      </div>
    )
  }, [expandedFolders, selectedBookmarks, toggleFolder, handleBookmarkOpen, handleContextMenu])

  // Loading state
  if (isLoading) {
    return (
      <TabContent className={className}>
        <LoadingState message="Loading local bookmarks..." />
      </TabContent>
    )
  }

  // Error state
  if (error) {
    return (
      <TabContent className={className}>
        <EmptyState
          icon={<Home size={48} />}
          title="Cannot access local bookmarks"
          description={error}
          action={
            <Button onClick={loadBookmarks}>
              Try Again
            </Button>
          }
        />
      </TabContent>
    )
  }

  // Empty state
  if (filteredBookmarks.length === 0 && !searchQuery) {
    return (
      <TabContent className={className}>
        <EmptyState
          icon={<BookOpen size={48} />}
          title="No local bookmarks"
          description="Your Chrome bookmarks will appear here. Start by adding some bookmarks to your browser."
          action={
            <Button onClick={() => handleCreateBookmark()}>
              <Plus size={16} />
              Add Bookmark
            </Button>
          }
        />
      </TabContent>
    )
  }

  return (
    <TabContent padding={false} className={clsx('relative', className)}>
      {/* Action bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCreateBookmark()}
          className="gap-2"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Bookmark</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCreateFolder()}
          className="gap-2"
        >
          <Folder size={14} />
          <span className="hidden sm:inline">Folder</span>
        </Button>
      </div>

      {/* Bookmarks list */}
      <div className="p-4 space-y-1 overflow-auto scrollbar-hide">
        {filteredBookmarks.length > 0 ? (
          filteredBookmarks.map(node => renderBookmark(node))
        ) : (
          <EmptyState
            icon={<BookOpen size={32} />}
            title="No matching bookmarks"
            description={`No bookmarks match "${searchQuery}"`}
          />
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="dropdown-menu fixed z-30"
            style={{
              left: Math.min(contextMenu.x, window.innerWidth - 200),
              top: Math.min(contextMenu.y, window.innerHeight - 200),
            }}
          >
            {contextMenu.bookmark.url && (
              <>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    handleBookmarkOpen(contextMenu.bookmark)
                    setContextMenu(null)
                  }}
                >
                  <ExternalLink size={14} />
                  Open
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    handleBookmarkCopy(contextMenu.bookmark)
                    setContextMenu(null)
                  }}
                >
                  <Copy size={14} />
                  Copy URL
                </button>
                <div className="dropdown-separator" />
              </>
            )}
            
            <button
              className="dropdown-item"
              onClick={() => {
                handleBookmarkEdit(contextMenu.bookmark)
                setContextMenu(null)
              }}
            >
              <Edit3 size={14} />
              Edit
            </button>
            
            <div className="dropdown-separator" />
            
            <button
              className="dropdown-item text-accent-red hover:bg-accent-red/10"
              onClick={() => {
                handleBookmarkDelete(contextMenu.bookmark)
                setContextMenu(null)
              }}
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </>
      )}
    </TabContent>
  )
}

export default LocalBookmarksView