import { useState, useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useHotkeys } from 'react-hotkeys-hook'
import { Layout } from '@/components/layout/layout'
import { BookmarksView } from '@/components/bookmarks/bookmarks-view'
import { LocalBookmarksView } from '@/components/local-bookmarks/local-bookmarks-view'
import { EmptyState } from '@/components/layout/layout'
import { queryClient } from '@/lib/query-client'
import type { SidebarTab } from '@/components/layout/sidebar'
import { Settings, Folder, Tag } from 'lucide-react'
import '@/styles/globals.css'

function App() {
  // Core app state
  const [activeTab, setActiveTab] = useState<SidebarTab>('bookmarks')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Global keyboard shortcuts
  useHotkeys('cmd+k, ctrl+k', (event) => {
    event.preventDefault()
    // Focus search is handled by the Header component
  }, { enableOnContentEditable: true, preventDefault: true })

  useHotkeys('cmd+1, ctrl+1', (event) => {
    event.preventDefault()
    setActiveTab('local')
  }, { enableOnContentEditable: true })

  useHotkeys('cmd+2, ctrl+2', (event) => {
    event.preventDefault()
    setActiveTab('bookmarks')
  }, { enableOnContentEditable: true })

  useHotkeys('cmd+3, ctrl+3', (event) => {
    event.preventDefault()
    setActiveTab('folders')
  }, { enableOnContentEditable: true })

  useHotkeys('cmd+4, ctrl+4', (event) => {
    event.preventDefault()
    setActiveTab('tags')
  }, { enableOnContentEditable: true })

  useHotkeys('cmd+5, ctrl+5', (event) => {
    event.preventDefault()
    setActiveTab('settings')
  }, { enableOnContentEditable: true })

  useHotkeys('cmd+f, ctrl+f', (event) => {
    event.preventDefault()
    setShowFilters(!showFilters)
  }, { enableOnContentEditable: true })

  // Handle search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  // Handle add bookmark action
  const handleAddBookmark = () => {
    if (activeTab === 'local') {
      // Trigger create bookmark in local view
      // This will be handled by the LocalBookmarksView component
      const event = new CustomEvent('create-local-bookmark')
      document.dispatchEvent(event)
    } else if (activeTab === 'bookmarks') {
      // Route to GitLab for creating new bookmark
      const gitLabBaseUrl = import.meta.env.VITE_GITLAB_BASE_URL ?? 'https://gitlab.com'
      const projectPath = import.meta.env.VITE_GITLAB_PROJECT_PATH ?? ''
      const newBookmarkUrl = `${gitLabBaseUrl}/${projectPath}/-/new/main?file_name=bookmarks.yml`
      window.open(newBookmarkUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // Handle show filters toggle
  const handleShowFilters = () => {
    setShowFilters(!showFilters)
  }

  // Handle more menu actions
  const handleShowMenu = () => {
    // This could open a dropdown with additional options
    console.log('Show more menu')
  }

  // Load saved preferences
  useEffect(() => {
    try {
      const savedTab = localStorage.getItem('sidebeam-active-tab')
      if (savedTab && ['local', 'bookmarks', 'folders', 'tags', 'settings'].includes(savedTab)) {
        setActiveTab(savedTab as SidebarTab)
      }
    } catch (error) {
      console.warn('Failed to load saved tab preference:', error)
    }
  }, [])

  // Save tab preference
  useEffect(() => {
    try {
      localStorage.setItem('sidebeam-active-tab', activeTab)
    } catch (error) {
      console.warn('Failed to save tab preference:', error)
    }
  }, [activeTab])

  // Clear search when switching tabs
  useEffect(() => {
    setSearchQuery('')
    setShowFilters(false)
  }, [activeTab])

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'local':
        return <LocalBookmarksView searchQuery={searchQuery} />
      
      case 'bookmarks':
        return <BookmarksView searchQuery={searchQuery} />
      
      case 'folders':
        return (
          <EmptyState
            icon={<Folder size={48} />}
            title="Folders"
            description="Folder management features are coming soon. For now, you can organize bookmarks using categories in the bookmark data."
          />
        )
      
      case 'tags':
        return (
          <EmptyState
            icon={<Tag size={48} />}
            title="Tags"
            description="Tag management features are coming soon. Tags are automatically extracted from your bookmark data."
          />
        )
      
      case 'settings':
        return (
          <EmptyState
            icon={<Settings size={48} />}
            title="Settings"
            description="Settings panel is coming soon. You can configure GitLab integration and other preferences here."
          />
        )
      
      default:
        return (
          <EmptyState
            title="Unknown Tab"
            description="The requested tab is not available."
          />
        )
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen bg-sidebar-bg text-bookmark-text">
        <Layout
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          onAddBookmark={handleAddBookmark}
          onShowFilters={handleShowFilters}
          onShowMenu={handleShowMenu}
          showFilters={showFilters}
        >
          {renderTabContent()}
        </Layout>
      </div>
      
      {/* Development tools */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
        />
      )}
    </QueryClientProvider>
  )
}

export default App