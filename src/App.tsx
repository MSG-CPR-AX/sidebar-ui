import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TopBar } from './components/layout/TopBar'
import { LeftNav, NavItem } from './components/layout/LeftNav'
import { ContentView } from './components/layout/ContentView'
import { BookmarkList } from './components/features/bookmarks/BookmarkList'
import { FolderTree } from './components/features/folders/FolderTree'
import { EditBookmarkModal } from './components/features/bookmarks/EditBookmarkModal'
import { Bookmark } from './lib/types'
import { LocalBookmarkTree } from './components/features/local-bookmarks/LocalBookmarkTree'

const queryClient = new QueryClient()

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeView, setActiveView] = useState<NavItem>('Bookmarks')
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
  }

  const handleCloseModal = () => {
    setEditingBookmark(null)
  }

  const renderContent = () => {
    switch (activeView) {
      case 'Bookmarks':
        return <BookmarkList searchTerm={searchTerm} onEditBookmark={handleEditBookmark} />
      case 'Folders':
        return <FolderTree />
      case 'Local':
        return <LocalBookmarkTree />
      default:
        return <div className="p-4">View not implemented.</div>
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen flex-col bg-background text-primary">
        <TopBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex flex-grow overflow-hidden">
          <LeftNav activeItem={activeView} setActiveItem={setActiveView} />
          <ContentView>{renderContent()}</ContentView>
        </div>
      </div>
      <EditBookmarkModal
        isOpen={!!editingBookmark}
        onClose={handleCloseModal}
        bookmark={editingBookmark}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
