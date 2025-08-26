import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'

interface TopBarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export const TopBar = ({ searchTerm, setSearchTerm }: TopBarProps) => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-divider bg-background px-4">
      <div className="relative flex-1">
        <Icon
          name="Search"
          size={18}
          className="absolute top-1/2 left-3 -translate-y-1/2 text-secondary"
        />
        <input
          type="text"
          placeholder="Search all bookmarks..."
          className="w-full rounded-md border border-transparent bg-surface py-2 pr-4 pl-10 text-sm text-primary placeholder-secondary transition-colors focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button variant="ghost" size="icon" aria-label="Add new bookmark">
        <Icon name="Plus" size={20} />
      </Button>
    </header>
  )
}
