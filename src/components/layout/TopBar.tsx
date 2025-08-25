import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'

interface TopBarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export const TopBar = ({ searchTerm, setSearchTerm }: TopBarProps) => {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-divider bg-background px-3">
      <div className="flex items-center gap-2">
        <Icon name="Bookmark" className="text-accent-blue" size={22} />
        <h1 className="text-lg font-bold text-primary">SideBeam</h1>
      </div>
      <div className="flex items-center gap-1">
        <div className="relative w-48 md:w-64">
          <Icon
            name="Search"
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-secondary"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-transparent bg-surface py-2 pr-4 pl-9 text-sm text-primary placeholder-secondary transition-colors focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
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
