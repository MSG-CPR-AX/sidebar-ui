import React, { useState } from 'react'
import { clsx } from 'clsx'
import { MoreVertical, ExternalLink, Pin, Star, Edit3, Copy, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Bookmark } from '@/types/api'

export interface BookmarkItemProps {
  bookmark: Bookmark
  isSelected?: boolean
  isPinned?: boolean
  color?: string
  onSelect?: (bookmark: Bookmark) => void
  onOpen?: (bookmark: Bookmark) => void
  onEdit?: (bookmark: Bookmark) => void
  onDelete?: (bookmark: Bookmark) => void
  onPin?: (bookmark: Bookmark) => void
  onCopy?: (bookmark: Bookmark) => void
  onAddToLocal?: (bookmark: Bookmark) => void
  className?: string
}

export function BookmarkItem({
  bookmark,
  isSelected = false,
  isPinned = false,
  color,
  onSelect,
  onOpen,
  onEdit,
  onDelete,
  onPin,
  onCopy,
  onAddToLocal,
  className,
}: BookmarkItemProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [favicon] = useState(`https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=16`)
  const [faviconError, setFaviconError] = useState(false)

  const handleClick = (event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select mode
      onSelect?.(bookmark)
    } else {
      // Normal click - open bookmark
      onOpen?.(bookmark)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        onOpen?.(bookmark)
        break
      case 'Delete':
      case 'Backspace':
        event.preventDefault()
        onDelete?.(bookmark)
        break
      case 'e':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          onEdit?.(bookmark)
        }
        break
      case 'c':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          onCopy?.(bookmark)
        }
        break
    }
  }

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    setShowMenu(!showMenu)
  }

  const handleFaviconError = () => {
    setFaviconError(true)
    // Fallback to generic globe icon
  }

  const colorDot = color ? (
    <div 
      className={`w-2 h-2 rounded-full flex-shrink-0 ${
        color === 'blue' ? 'bg-accent-blue' :
        color === 'green' ? 'bg-accent-green' :
        color === 'yellow' ? 'bg-accent-yellow' :
        color === 'red' ? 'bg-accent-red' :
        color === 'purple' ? 'bg-accent-purple' :
        color === 'pink' ? 'bg-accent-pink' :
        color === 'orange' ? 'bg-accent-orange' :
        color === 'teal' ? 'bg-accent-teal' :
        'bg-dark-600'
      }`} 
    />
  ) : null

  return (
    <div
      className={clsx(
        'bookmark-item relative group',
        isSelected && 'selected',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onContextMenu={handleContextMenu}
      tabIndex={0}
      role="option"
      aria-label={`Bookmark: ${bookmark.name}`}
      aria-selected={isSelected}
    >
      {/* Main content */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Favicon */}
        <div className="flex-shrink-0 w-5 h-5 mt-0.5">
          {!faviconError ? (
            <img
              src={favicon}
              alt=""
              className="w-full h-full"
              onError={handleFaviconError}
            />
          ) : (
            <div className="w-full h-full bg-dark-600 rounded flex items-center justify-center">
              <ExternalLink size={12} className="text-bookmark-muted" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-bookmark-text truncate">
              {bookmark.name}
            </h3>
            {isPinned && (
              <Pin size={12} className="text-accent-yellow flex-shrink-0" />
            )}
            {colorDot}
          </div>

          {/* URL/Domain */}
          <p className="text-xs text-bookmark-muted truncate mb-1">
            {bookmark.domain}
          </p>

          {/* Tags */}
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {bookmark.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-dark-700 text-bookmark-muted"
                >
                  {tag}
                </span>
              ))}
              {bookmark.tags.length > 3 && (
                <span className="text-xs text-bookmark-muted">
                  +{bookmark.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Star/Favorite */}
        <Button
          variant="icon"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            // Handle favorite toggle
          }}
          aria-label="Add to favorites"
        >
          <Star size={14} />
        </Button>

        {/* More menu */}
        <div className="relative">
          <Button
            variant="icon"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            aria-label="More options"
            aria-expanded={showMenu}
          >
            <MoreVertical size={14} />
          </Button>

          {/* Dropdown menu */}
          {showMenu && (
            <>
              {/* Backdrop */}
              <div
                role="presentation"
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowMenu(false);
                }}
              />
              
              {/* Menu */}
              <div className="dropdown-menu absolute right-0 top-full mt-1 z-20">
                <button
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpen?.(bookmark)
                    setShowMenu(false)
                  }}
                >
                  <ExternalLink size={14} />
                  Open
                </button>
                
                <button
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit?.(bookmark)
                    setShowMenu(false)
                  }}
                >
                  <Edit3 size={14} />
                  Edit
                </button>
                
                <button
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCopy?.(bookmark)
                    setShowMenu(false)
                  }}
                >
                  <Copy size={14} />
                  Copy URL
                </button>
                
                <button
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation()
                    onPin?.(bookmark)
                    setShowMenu(false)
                  }}
                >
                  <Pin size={14} />
                  {isPinned ? 'Unpin' : 'Pin'}
                </button>

                <button
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddToLocal?.(bookmark)
                    setShowMenu(false)
                  }}
                >
                  <Star size={14} />
                  Add to Local
                </button>

                <div className="dropdown-separator" />
                
                <button
                  className="dropdown-item text-accent-red hover:bg-accent-red/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.(bookmark)
                    setShowMenu(false)
                  }}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookmarkItem