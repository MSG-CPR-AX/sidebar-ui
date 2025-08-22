import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Filter, MoreVertical, X } from 'lucide-react'
import { clsx } from 'clsx'

export interface HeaderProps {
  searchValue: string
  onSearchChange: (value: string) => void
  onAddBookmark?: () => void
  onShowFilters?: () => void
  onShowMenu?: () => void
  showFilters?: boolean
  className?: string
}

export function Header({
  searchValue,
  onSearchChange,
  onAddBookmark,
  onShowFilters,
  onShowMenu,
  showFilters = false,
  className,
}: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleClearSearch = () => {
    onSearchChange('')
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Command/Ctrl + K should focus search
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault()
      const searchInput = event.currentTarget.querySelector('input')
      searchInput?.focus()
    }
  }

  return (
    <header 
      className={clsx(
        'flex items-center gap-3 px-4 py-3 border-b border-sidebar-border bg-sidebar-bg',
        className
      )}
      onKeyDown={handleKeyDown}
    >
      {/* Logo/Title */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center justify-center w-8 h-8 bg-accent-blue rounded-lg">
          <span className="text-white text-sm font-bold">SB</span>
        </div>
        <h1 className="text-lg font-semibold text-bookmark-text truncate">
          SideBeam
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Input
            variant="search"
            placeholder="Search bookmarks... (⌘K)"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            leftIcon={<Search size={16} />}
            rightIcon={
              searchValue ? (
                <button
                  onClick={handleClearSearch}
                  className="p-0.5 hover:bg-dark-600 rounded transition-colors"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              ) : undefined
            }
            className={clsx(
              'transition-all duration-200',
              isSearchFocused && 'ring-2 ring-accent-blue'
            )}
          />
          
          {/* Search shortcut hint */}
          {!isSearchFocused && !searchValue && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden sm:block">
              <kbd className="px-2 py-1 text-xs font-mono text-bookmark-muted bg-dark-600 rounded border border-dark-500">
                ⌘K
              </kbd>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {/* Add Bookmark Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={onAddBookmark}
          className="hidden sm:flex"
          aria-label="Add new bookmark"
        >
          <Plus size={16} />
          <span className="ml-1.5">Add</span>
        </Button>
        
        {/* Mobile Add Button */}
        <Button
          variant="icon"
          size="sm"
          onClick={onAddBookmark}
          className="sm:hidden"
          aria-label="Add new bookmark"
        >
          <Plus size={16} />
        </Button>

        {/* Filter Button */}
        <Button
          variant={showFilters ? 'secondary' : 'icon'}
          size="sm"
          onClick={onShowFilters}
          aria-label="Toggle filters"
          aria-pressed={showFilters}
        >
          <Filter size={16} />
          {showFilters && (
            <span className="ml-1.5 hidden sm:inline">Filters</span>
          )}
        </Button>

        {/* More Menu Button */}
        <Button
          variant="icon"
          size="sm"
          onClick={onShowMenu}
          aria-label="More options"
        >
          <MoreVertical size={16} />
        </Button>
      </div>
    </header>
  )
}

export default Header