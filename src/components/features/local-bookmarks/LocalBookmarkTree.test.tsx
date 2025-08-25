import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LocalBookmarkTree } from './LocalBookmarkTree'
import { useLocalBookmarks } from '../../../lib/hooks/useLocalBookmarks'

vi.mock('../../../lib/hooks/useLocalBookmarks')

const mockedUseLocalBookmarks = vi.mocked(useLocalBookmarks)

const mockBookmarkTree: chrome.bookmarks.BookmarkTreeNode[] = [
  {
    id: '1',
    title: 'Root Folder',
    parentId: '0',
    index: 0,
    dateGroupModified: Date.now(),
    unmodifiable: 'managed',
    syncing: false,
    children: [
      {
        id: '2',
        title: 'Test Bookmark',
        url: 'https://example.com',
        parentId: '1',
        index: 0,
        dateAdded: Date.now(),
        unmodifiable: 'managed',
        syncing: false,
      },
    ],
  },
  {
    id: '3',
    title: 'Empty Folder',
    parentId: '0',
    index: 1,
    dateGroupModified: Date.now(),
    unmodifiable: 'managed',
    children: [],
    syncing: false,
  },
]

describe('LocalBookmarkTree', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedUseLocalBookmarks.mockReturnValue({
      bookmarks: mockBookmarkTree,
      loading: false,
      error: null,
    })
  })

  it('renders the root folders and bookmarks from mock data', () => {
    render(<LocalBookmarkTree />)
    expect(screen.getByText('Root Folder')).toBeInTheDocument()
    expect(screen.getByText('Empty Folder')).toBeInTheDocument()
  })

  it('shows a loading state', () => {
    mockedUseLocalBookmarks.mockReturnValue({
      bookmarks: [],
      loading: true,
      error: null,
    })
    render(<LocalBookmarkTree />)
    expect(screen.getByText('Loading local bookmarks...')).toBeInTheDocument()
  })

  it('shows an error state', () => {
    mockedUseLocalBookmarks.mockReturnValue({
      bookmarks: [],
      loading: false,
      error: 'Failed to load',
    })
    render(<LocalBookmarkTree />)
    expect(screen.getByText('Failed to load')).toBeInTheDocument()
  })
})
