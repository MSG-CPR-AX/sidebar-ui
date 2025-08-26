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
    <nav className="flex h-full w-14 flex-col items-center justify-between border-r border-divider bg-surface p-1">
      <div className="flex flex-col items-center space-y-2">
        {/* Logo/Main Action */}
        <div className="p-2.5">
          <Icon name="Bookmark" size={24} className="text-primary" />
        </div>

        {/* Navigation Items */}
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveItem(item.name)}
            className={`border-l-2 p-2.5 transition-colors ${
              activeItem === item.name
                ? 'border-accent-blue text-accent-blue'
                : 'border-transparent text-secondary hover:text-primary'
            }`}
            aria-label={item.name}
            title={item.name}
          >
            <Icon name={item.icon} size={22} />
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center space-y-2">
        {/* Bottom Navigation Items */}
        {bottomNavItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveItem(item.name)}
            className={`border-l-2 p-2.5 transition-colors ${
              activeItem === item.name
                ? 'border-accent-blue text-accent-blue'
                : 'border-transparent text-secondary hover:text-primary'
            }`}
            aria-label={item.name}
            title={item.name}
          >
            <Icon name={item.icon} size={22} />
          </button>
        ))}
      </div>
    </nav>
  )
}
