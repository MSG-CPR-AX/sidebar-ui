import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'

interface TopBarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export const TopBar = ({ searchTerm, setSearchTerm }: TopBarProps) => {
  return (
    <header className="border-divider bg-background flex h-14 shrink-0 items-center justify-between border-b p-2">
      <div className="flex items-center gap-2">
        <Icon name="Bookmark" className="text-accent-blue" size={20} />
        <h1 className="text-lg font-bold">SideBeam</h1>
      </div>
      <div className="flex items-center gap-1">
        <div className="relative w-64">
          <Icon
            name="Search"
            size={16}
            className="text-secondary absolute top-1/2 left-3 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Search... (Ctrl+K)"
            className="bg-surface text-primary placeholder-secondary focus:border-accent-blue focus:ring-accent-blue w-full rounded-lg border border-transparent py-1.5 pr-4 pl-9 text-sm focus:ring-1 focus:outline-none"
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
