import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LocalBookmarkTree } from './LocalBookmarkTree'
import { useLocalBookmarks } from '../../../lib/hooks/useLocalBookmarks'

// Mock the hook at the top level
vi.mock('../../../lib/hooks/useLocalBookmarks')

const mockedUseLocalBookmarks = vi.mocked(useLocalBookmarks)

describe('LocalBookmarkTree', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
  })

  it('renders the root folders and bookmarks from mock data', () => {
    mockedUseLocalBookmarks.mockReturnValue({
      bookmarks: [
        { id: '1', title: 'Root Folder', children: [{ id: '2', title: 'Test Bookmark', url: 'https://example.com' }] },
        { id: '3', title: 'Empty Folder', children: [] },
      ],
      loading: false,
      error: null,
    })

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
