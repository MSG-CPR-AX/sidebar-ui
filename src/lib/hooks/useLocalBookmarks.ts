import { useState, useEffect, useCallback } from 'react'
import { debounce } from '../utils/debounce'

export const useLocalBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<chrome.bookmarks.BookmarkTreeNode[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchBookmarks = useCallback(async () => {
    // Guard against running in non-extension environments (like unit tests)
    if (!chrome?.bookmarks) {
      console.warn('Chrome Bookmarks API is not available.')
      setLoading(false)
      return
    }
    try {
      const tree = await chrome.bookmarks.getTree()
      setBookmarks(tree[0]?.children || [])
    } catch (e) {
      console.error('Failed to fetch bookmarks:', e)
      setError('Failed to load local bookmarks.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial fetch
    fetchBookmarks()

    const debouncedFetch = debounce(fetchBookmarks, 300)

    // Define typed handlers
    const onCreatedHandler = () => debouncedFetch()
    const onRemovedHandler = () => debouncedFetch()
    const onChangedHandler = () => debouncedFetch()
    const onMovedHandler = () => debouncedFetch()

    // Add listeners
    chrome.bookmarks?.onCreated.addListener(onCreatedHandler)
    chrome.bookmarks?.onRemoved.addListener(onRemovedHandler)
    chrome.bookmarks?.onChanged.addListener(onChangedHandler)
    chrome.bookmarks?.onMoved.addListener(onMovedHandler)

    // Cleanup function
    return () => {
      chrome.bookmarks?.onCreated.removeListener(onCreatedHandler)
      chrome.bookmarks?.onRemoved.removeListener(onRemovedHandler)
      chrome.bookmarks?.onChanged.removeListener(onChangedHandler)
      chrome.bookmarks?.onMoved.removeListener(onMovedHandler)
    }
  }, [fetchBookmarks]) // Dependency array includes the stable fetchBookmarks function

  return { bookmarks, loading, error }
}
