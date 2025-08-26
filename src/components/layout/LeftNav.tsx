import { Icon } from '../atoms/Icon'

export type NavItem = 'Bookmarks' | 'Folders' | 'Tags' | 'Local' | 'Settings'

const navItems: { name: NavItem; icon: string }[] = [
  { name: 'Bookmarks', icon: 'bookmark' },
  { name: 'Folders', icon: 'folder' },
  { name: 'Tags', icon: 'sort' },
  { name: 'Local', icon: 'reorder' },
]

const bottomNavItems: { name: NavItem; icon: string }[] = [
  { name: 'Settings', icon: 'menu' },
]

interface LeftNavProps {
  activeItem: NavItem
  setActiveItem: (item: NavItem) => void
}

export const LeftNav = ({ activeItem, setActiveItem }: LeftNavProps) => {
  return (
    <nav className="flex h-full w-16 flex-col border-r border-divider bg-surface p-2 transition-all md:w-56">
      <div className="flex flex-col space-y-2">
        {/* Logo/Main Action */}
        <div className="flex h-12 items-center px-3">
          <Icon name="menu" size={24} className="text-primary" />
          <span className="ml-3 hidden text-lg font-bold text-primary md:inline">
            SideBeam
          </span>
        </div>

        {/* Navigation Items */}
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveItem(item.name)}
            className={`flex items-center rounded-md px-3 py-2 transition-colors ${
              activeItem === item.name
                ? 'bg-accent-blue text-white'
                : 'text-secondary hover:bg-surface hover:text-primary'
            }`}
            aria-label={item.name}
            title={item.name}
          >
            <Icon name={item.icon} size={20} />
            <span className="ml-3 hidden md:inline">{item.name}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col space-y-2">
        {/* Bottom Navigation Items */}
        {bottomNavItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveItem(item.name)}
            className={`flex items-center rounded-md px-3 py-2 transition-colors ${
              activeItem === item.name
                ? 'bg-accent-blue text-white'
                : 'text-secondary hover:bg-surface hover:text-primary'
            }`}
            aria-label={item.name}
            title={item.name}
          >
            <Icon name={item.icon} size={20} />
            <span className="ml-3 hidden md:inline">{item.name}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
