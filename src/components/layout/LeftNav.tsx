import { Icon } from '../atoms/Icon'

export type NavItem = 'Bookmarks' | 'Folders' | 'Tags' | 'Local' | 'Settings'

const navItems: { name: NavItem; icon: React.ComponentProps<typeof Icon>['name'] }[] = [
  { name: 'Bookmarks', icon: 'Bookmark' },
  { name: 'Folders', icon: 'Folder' },
  { name: 'Tags', icon: 'Tag' },
  { name: 'Local', icon: 'Laptop' },
  { name: 'Settings', icon: 'Settings' },
]

interface LeftNavProps {
  activeItem: NavItem
  setActiveItem: (item: NavItem) => void
}

export const LeftNav = ({ activeItem, setActiveItem }: LeftNavProps) => {
  return (
    <nav className="flex flex-col items-center space-y-4 border-r border-gray-700 bg-gray-800 p-2">
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => setActiveItem(item.name)}
          className={`rounded-lg p-2 transition-colors ${
            activeItem === item.name
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
          aria-label={item.name}
          title={item.name}
        >
          <Icon name={item.icon} size={24} />
        </button>
      ))}
    </nav>
  )
}
