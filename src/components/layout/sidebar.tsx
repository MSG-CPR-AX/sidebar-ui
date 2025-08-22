import React from 'react'
import { clsx } from 'clsx'
import { BookOpen, Folder, Tag, Settings, Home } from 'lucide-react'

export type SidebarTab = 'bookmarks' | 'folders' | 'tags' | 'settings' | 'local'

export interface SidebarProps {
  activeTab: SidebarTab
  onTabChange: (tab: SidebarTab) => void
  className?: string
}

interface TabItem {
  id: SidebarTab
  label: string
  icon: React.ComponentType<{ size?: number | string; className?: string }>
  shortLabel: string
}

const tabs: TabItem[] = [
  {
    id: 'local',
    label: 'Local Bookmarks',
    icon: Home,
    shortLabel: '로컬\n북마크',
  },
  {
    id: 'bookmarks',
    label: 'Remote Bookmarks',
    icon: BookOpen,
    shortLabel: '북마크',
  },
  {
    id: 'folders',
    label: 'Folders',
    icon: Folder,
    shortLabel: '폴더',
  },
  {
    id: 'tags',
    label: 'Tags',
    icon: Tag,
    shortLabel: '태그',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    shortLabel: '설정',
  },
]

export function Sidebar({ activeTab, onTabChange, className }: SidebarProps) {
  return (
    <div
      className={clsx(
        'flex flex-col bg-sidebar-bg border-r border-sidebar-border',
        className
      )}
      role="tablist"
      aria-orientation="vertical"
    >
      {/* Tab Navigation */}
      <nav className="flex flex-col">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'relative flex flex-col items-center justify-center p-4 text-xs font-medium transition-colors group',
                'min-h-[80px] border-b border-sidebar-border/50',
                'hover:bg-sidebar-hover focus-visible:bg-sidebar-hover',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-inset',
                isActive 
                  ? 'bg-sidebar-active text-bookmark-text' 
                  : 'text-bookmark-muted hover:text-bookmark-text'
              )}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              title={tab.label}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-blue" />
              )}
              
              {/* Icon */}
              <div className="mb-2">
                <Icon 
                  size={20}
                  className={clsx(
                    'transition-transform group-hover:scale-110',
                    isActive ? 'text-accent-blue' : 'inherit'
                  )}
                />
              </div>
              
              {/* Label */}
              <span className="text-center leading-tight whitespace-pre-line">
                {tab.shortLabel}
              </span>
              
              {/* Ripple effect */}
              <div className="absolute inset-0 opacity-0 group-active:opacity-10 bg-white rounded transition-opacity" />
            </button>
          )
        })}
      </nav>
      
      {/* Bottom spacer */}
      <div className="flex-1" />
      
      {/* Connection status indicator */}
      <div className="p-4 border-t border-sidebar-border/50">
        <div className="flex items-center gap-2 text-xs text-bookmark-muted">
          <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
          <span>Connected</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar