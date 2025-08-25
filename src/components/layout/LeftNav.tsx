import { Icon } from '../atoms/Icon'

export type NavItem = 'Bookmarks' | 'Folders' | 'Tags' | 'Local' | 'Settings'

const navItems: { name: NavItem; icon: React.ComponentProps<typeof Icon>['name'] }[] = [
  { name: 'Bookmarks', icon: 'Bookmark' },
  { name: 'Folders', icon: 'Folder' },
  { name: 'Tags', icon: 'Tag' },
  { name: 'Local', icon: 'Laptop' },
]

const bottomNavItems: { name: NavItem; icon: React.ComponentProps<typeof Icon>['name'] }[] = [
    { name: 'Settings', icon: 'Settings' },
]

interface LeftNavProps {
  activeItem: NavItem
  setActiveItem: (item: NavItem) => void
}

export const LeftNav = ({ activeItem, setActiveItem }: LeftNavProps) => {
  return (
    <nav className="flex h-full w-16 flex-col items-center justify-between border-r border-divider bg-background p-2">
        <div className="flex flex-col items-center space-y-2">
            {navItems.map((item) => (
                <button
                key={item.name}
                onClick={() => setActiveItem(item.name)}
                className={`rounded-lg p-3 transition-colors ${
                    activeItem === item.name
                    ? 'bg-accent-blue text-white'
                    : 'text-secondary hover:bg-surface hover:text-primary'
                }`}
                aria-label={item.name}
                title={item.name}
                >
                <Icon name={item.icon} size={24} />
                </button>
            ))}
        </div>
        <div className="flex flex-col items-center space-y-2">
            {bottomNavItems.map((item) => (
                <button
                key={item.name}
                onClick={() => setActiveItem(item.name)}
                className={`rounded-lg p-3 transition-colors ${
                    activeItem === item.name
                    ? 'bg-accent-blue text-white'
                    : 'text-secondary hover:bg-surface hover:text-primary'
                }`}
                aria-label={item.name}
                title={item.name}
                >
                <Icon name={item.icon} size={24} />
                </button>
            ))}
        </div>
    </nav>
  )
}
