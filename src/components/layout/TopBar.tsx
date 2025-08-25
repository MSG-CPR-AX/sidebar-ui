import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'

interface TopBarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export const TopBar = ({ searchTerm, setSearchTerm }: TopBarProps) => {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-700 bg-gray-800 p-2">
      <div className="flex items-center gap-2">
        <Icon name="Bookmark" className="text-blue-500" size={20} />
        <h1 className="text-lg font-bold">SideBeam</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Icon
            name="Search"
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search... (Ctrl+K)"
            className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="sm" aria-label="Add new">
          <Icon name="Plus" size={20} />
        </Button>
        <Button variant="ghost" size="sm" aria-label="Filter">
          <Icon name="ListFilter" size={20} />
        </Button>
        <Button variant="ghost" size="sm" aria-label="More options">
          <Icon name="MoveHorizontal" size={20} />
        </Button>
      </div>
    </header>
  )
}
