import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import { Header } from './header'
import { Sidebar, type SidebarTab } from './sidebar'

export interface LayoutProps {
  children: ReactNode
  activeTab: SidebarTab
  onTabChange: (tab: SidebarTab) => void
  searchValue: string
  onSearchChange: (value: string) => void
  onAddBookmark?: () => void
  onShowFilters?: () => void
  onShowMenu?: () => void
  showFilters?: boolean
  className?: string
}

export function Layout({
  children,
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  onAddBookmark,
  onShowFilters,
  onShowMenu,
  showFilters = false,
  className,
}: LayoutProps) {
  return (
    <div 
      className={clsx(
        'h-full flex bg-sidebar-bg text-bookmark-text',
        className
      )}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        className="w-20 flex-shrink-0"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onAddBookmark={onAddBookmark}
          onShowFilters={onShowFilters}
          onShowMenu={onShowMenu}
          showFilters={showFilters}
        />

        {/* Content */}
        <main 
          className="flex-1 overflow-hidden"
          role="main"
          aria-label={`${activeTab} content`}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

// Layout wrapper for different tab content
export interface TabContentProps {
  children: ReactNode
  className?: string
  padding?: boolean
}

export function TabContent({ 
  children, 
  className, 
  padding = true 
}: TabContentProps) {
  return (
    <div 
      className={clsx(
        'h-full overflow-auto scrollbar-hide',
        padding && 'p-4',
        className
      )}
    >
      {children}
    </div>
  )
}

// Empty state component for tabs without content
export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div 
      className={clsx(
        'flex flex-col items-center justify-center h-full text-center px-6 py-12',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-bookmark-muted">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-bookmark-text mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-bookmark-muted mb-6 max-w-sm">
          {description}
        </p>
      )}
      
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  )
}

// Error boundary fallback for layout content
export interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 rounded-full bg-accent-red/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-accent-red"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      }
      title="Something went wrong"
      description={error.message || 'An unexpected error occurred while loading this content.'}
      action={
        <button
          onClick={resetError}
          className="btn-primary"
        >
          Try again
        </button>
      }
    />
  )
}

export default Layout