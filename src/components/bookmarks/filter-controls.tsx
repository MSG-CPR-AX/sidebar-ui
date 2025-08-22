import { useState } from 'react'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/button'
import { 
  Filter, 
  ArrowUpDown, 
  ChevronDown, 
  X,
  Tag,
  Globe,
  Folder,
  Calendar,
  Type,
  Link,
  Hash
} from 'lucide-react'

export interface FilterControlsProps {
  sortBy: 'name' | 'url' | 'domain' | 'category' | 'dateAdded'
  sortOrder: 'asc' | 'desc'
  groupBy: 'none' | 'category' | 'domain' | 'tags'
  selectedTags: string[]
  selectedCategories: string[]
  selectedColors: string[]
  pinnedOnly: boolean
  availableTags: string[]
  availableCategories: string[]
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  onGroupChange: (groupBy: string) => void
  onTagsChange: (tags: string[]) => void
  onCategoriesChange: (categories: string[]) => void
  onColorsChange: (colors: string[]) => void
  onPinnedOnlyChange: (pinnedOnly: boolean) => void
  onClearFilters: () => void
  className?: string
}

const sortOptions = [
  { value: 'name', label: 'Name', icon: Type },
  { value: 'url', label: 'URL', icon: Link },
  { value: 'domain', label: 'Domain', icon: Globe },
  { value: 'category', label: 'Category', icon: Folder },
  { value: 'dateAdded', label: 'Date Added', icon: Calendar },
]

const groupOptions = [
  { value: 'none', label: 'No Grouping', icon: Hash },
  { value: 'category', label: 'By Category', icon: Folder },
  { value: 'domain', label: 'By Domain', icon: Globe },
  { value: 'tags', label: 'By Tags', icon: Tag },
]

const colorOptions = [
  { value: 'blue', label: 'Blue', color: 'bg-accent-blue' },
  { value: 'green', label: 'Green', color: 'bg-accent-green' },
  { value: 'yellow', label: 'Yellow', color: 'bg-accent-yellow' },
  { value: 'red', label: 'Red', color: 'bg-accent-red' },
  { value: 'purple', label: 'Purple', color: 'bg-accent-purple' },
  { value: 'pink', label: 'Pink', color: 'bg-accent-pink' },
  { value: 'orange', label: 'Orange', color: 'bg-accent-orange' },
  { value: 'teal', label: 'Teal', color: 'bg-accent-teal' },
]

export function FilterControls({
  sortBy,
  sortOrder,
  groupBy,
  selectedTags,
  selectedCategories,
  selectedColors,
  pinnedOnly,
  availableTags,
  availableCategories,
  onSortChange,
  onGroupChange,
  onTagsChange,
  onCategoriesChange,
  onColorsChange,
  onPinnedOnlyChange,
  onClearFilters,
  className,
}: FilterControlsProps) {
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showGroupMenu, setShowGroupMenu] = useState(false)
  const [showTagsMenu, setShowTagsMenu] = useState(false)
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false)
  const [showColorsMenu, setShowColorsMenu] = useState(false)

  const hasActiveFilters = selectedTags.length > 0 || 
                          selectedCategories.length > 0 || 
                          selectedColors.length > 0 || 
                          pinnedOnly

  const currentSortOption = sortOptions.find(option => option.value === sortBy)
  const currentGroupOption = groupOptions.find(option => option.value === groupBy)

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category))
    } else {
      onCategoriesChange([...selectedCategories, category])
    }
  }

  const handleColorToggle = (color: string) => {
    if (selectedColors.includes(color)) {
      onColorsChange(selectedColors.filter(c => c !== color))
    } else {
      onColorsChange([...selectedColors, color])
    }
  }

  return (
    <div className={clsx('flex items-center gap-2 px-4 py-2 border-b border-sidebar-border', className)}>
      {/* Sort Controls */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSortMenu(!showSortMenu)}
          className="gap-2"
        >
          {currentSortOption && <currentSortOption.icon size={14} />}
          <span className="hidden sm:inline">{currentSortOption?.label}</span>
          <ArrowUpDown size={12} className={clsx(sortOrder === 'desc' && 'rotate-180')} />
          <ChevronDown size={12} />
        </Button>

        {showSortMenu && (
          <>
            <div
              role="presentation"
              className="fixed inset-0 z-10"
              onClick={() => setShowSortMenu(false)}
              onContextMenu={(e) => {
                e.preventDefault()
                setShowSortMenu(false)
              }}
            />
            <div className="dropdown-menu absolute left-0 top-full mt-1 z-20 min-w-40">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={clsx(
                    'dropdown-item',
                    sortBy === option.value && 'bg-dark-700'
                  )}
                  onClick={() => {
                    const newOrder = sortBy === option.value && sortOrder === 'asc' ? 'desc' : 'asc'
                    onSortChange(option.value, newOrder)
                    setShowSortMenu(false)
                  }}
                >
                  <option.icon size={14} />
                  {option.label}
                  {sortBy === option.value && (
                    <ArrowUpDown size={12} className={clsx('ml-auto', sortOrder === 'desc' && 'rotate-180')} />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Group Controls */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowGroupMenu(!showGroupMenu)}
          className="gap-2"
        >
          {currentGroupOption && <currentGroupOption.icon size={14} />}
          <span className="hidden sm:inline">{currentGroupOption?.label}</span>
          <ChevronDown size={12} />
        </Button>

        {showGroupMenu && (
          <>
            <div
              role="presentation"
              className="fixed inset-0 z-10"
              onClick={() => setShowGroupMenu(false)}
              onContextMenu={(e) => {
                e.preventDefault()
                setShowGroupMenu(false)
              }}
            />
            <div className="dropdown-menu absolute left-0 top-full mt-1 z-20 min-w-44">
              {groupOptions.map((option) => (
                <button
                  key={option.value}
                  className={clsx(
                    'dropdown-item',
                    groupBy === option.value && 'bg-dark-700'
                  )}
                  onClick={() => {
                    onGroupChange(option.value)
                    setShowGroupMenu(false)
                  }}
                >
                  <option.icon size={14} />
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <div className="relative">
            <Button
              variant={selectedTags.length > 0 ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowTagsMenu(!showTagsMenu)}
              className="gap-2"
            >
              <Tag size={14} />
              <span className="hidden sm:inline">Tags</span>
              {selectedTags.length > 0 && (
                <span className="bg-accent-blue text-white text-xs px-1.5 py-0.5 rounded-full">
                  {selectedTags.length}
                </span>
              )}
              <ChevronDown size={12} />
            </Button>

            {showTagsMenu && (
              <>
                <div
                  role="presentation"
                  className="fixed inset-0 z-10"
                  onClick={() => setShowTagsMenu(false)}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setShowTagsMenu(false)
                  }}
                />
                <div className="dropdown-menu absolute right-0 top-full mt-1 z-20 min-w-48 max-h-60 overflow-y-auto">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      className={clsx(
                        'dropdown-item justify-between',
                        selectedTags.includes(tag) && 'bg-dark-700'
                      )}
                      onClick={() => handleTagToggle(tag)}
                    >
                      <span className="truncate">{tag}</span>
                      {selectedTags.includes(tag) && (
                        <div className="w-2 h-2 bg-accent-blue rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Categories Filter */}
        {availableCategories.length > 0 && (
          <div className="relative">
            <Button
              variant={selectedCategories.length > 0 ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
              className="gap-2"
            >
              <Folder size={14} />
              <span className="hidden sm:inline">Categories</span>
              {selectedCategories.length > 0 && (
                <span className="bg-accent-blue text-white text-xs px-1.5 py-0.5 rounded-full">
                  {selectedCategories.length}
                </span>
              )}
              <ChevronDown size={12} />
            </Button>

            {showCategoriesMenu && (
              <>
                <div
                  role="presentation"
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCategoriesMenu(false)}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setShowCategoriesMenu(false)
                  }}
                />
                <div className="dropdown-menu absolute right-0 top-full mt-1 z-20 min-w-48 max-h-60 overflow-y-auto">
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      className={clsx(
                        'dropdown-item justify-between',
                        selectedCategories.includes(category) && 'bg-dark-700'
                      )}
                      onClick={() => handleCategoryToggle(category)}
                    >
                      <span className="truncate">{category}</span>
                      {selectedCategories.includes(category) && (
                        <div className="w-2 h-2 bg-accent-blue rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Colors Filter */}
        <div className="relative">
          <Button
            variant={selectedColors.length > 0 ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setShowColorsMenu(!showColorsMenu)}
            className="gap-2"
          >
            <div className="flex items-center gap-1">
              {selectedColors.length > 0 ? (
                selectedColors.slice(0, 3).map((color) => {
                  const colorOption = colorOptions.find(opt => opt.value === color)
                  return (
                    <div key={color} className={clsx('w-2 h-2 rounded-full', colorOption?.color)} />
                  )
                })
              ) : (
                <Filter size={14} />
              )}
            </div>
            <span className="hidden sm:inline">Colors</span>
            {selectedColors.length > 0 && selectedColors.length > 3 && (
              <span className="text-xs">+{selectedColors.length - 3}</span>
            )}
            <ChevronDown size={12} />
          </Button>

          {showColorsMenu && (
            <>
              <div
                role="presentation"
                className="fixed inset-0 z-10"
                onClick={() => setShowColorsMenu(false)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  setShowColorsMenu(false)
                }}
              />
              <div className="dropdown-menu absolute right-0 top-full mt-1 z-20 min-w-36">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    className={clsx(
                      'dropdown-item justify-between',
                      selectedColors.includes(color.value) && 'bg-dark-700'
                    )}
                    onClick={() => handleColorToggle(color.value)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={clsx('w-3 h-3 rounded-full', color.color)} />
                      {color.label}
                    </div>
                    {selectedColors.includes(color.value) && (
                      <div className="w-2 h-2 bg-accent-blue rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pinned Only Toggle */}
        <Button
          variant={pinnedOnly ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onPinnedOnlyChange(!pinnedOnly)}
          className="gap-2"
        >
          <div className={clsx('w-2 h-2 rounded-full', pinnedOnly ? 'bg-accent-yellow' : 'bg-dark-600')} />
          <span className="hidden sm:inline">Pinned</span>
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-2"
            title="Clear all filters"
          >
            <X size={14} />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>
    </div>
  )
}

export default FilterControls