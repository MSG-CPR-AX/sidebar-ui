import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, queryKeys, ApiError } from '@/lib/api-client'
import type { Bookmark, CategoryNode } from '@/types/api'

// Hook for fetching all bookmarks
export function useBookmarks() {
  return useQuery({
    queryKey: queryKeys.bookmarks,
    queryFn: api.getBookmarks,
    select: (data: Bookmark[]) => {
      // Sort bookmarks by name for consistent display
      return data.sort((a, b) => a.name.localeCompare(b.name))
    },
  })
}

// Hook for fetching category tree
export function useCategoryTree() {
  return useQuery({
    queryKey: queryKeys.categoryTree,
    queryFn: api.getCategoryTree,
  })
}

// Hook for health check
export function useHealthCheck() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: api.healthCheck,
    refetchInterval: 30000, // Check every 30 seconds
    retry: false, // Don't retry health checks
  })
}

// Hook for refreshing bookmark data
export function useRefreshBookmarks() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      // Invalidate and refetch bookmark-related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks }),
        queryClient.invalidateQueries({ queryKey: queryKeys.categoryTree }),
      ])
    },
    onSuccess: () => {
      // Optional: show success toast
      console.log('Bookmarks refreshed successfully')
    },
    onError: (error) => {
      console.error('Failed to refresh bookmarks:', error)
    },
  })
}

// Hook for prefetching bookmark data
export function usePrefetchBookmarks() {
  const queryClient = useQueryClient()
  
  const prefetchBookmarks = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.bookmarks,
      queryFn: api.getBookmarks,
      staleTime: 1000 * 60 * 2, // Consider fresh for 2 minutes
    })
  }

  const prefetchCategoryTree = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.categoryTree,
      queryFn: api.getCategoryTree,
      staleTime: 1000 * 60 * 5, // Consider fresh for 5 minutes
    })
  }

  return {
    prefetchBookmarks,
    prefetchCategoryTree,
    prefetchAll: () => {
      prefetchBookmarks()
      prefetchCategoryTree()
    },
  }
}

// Hook for bookmark search with debounced filtering
export function useBookmarkSearch(query: string, bookmarks?: Bookmark[]) {
  const filteredBookmarks = bookmarks?.filter((bookmark) => {
    if (!query.trim()) return true
    
    const searchTerm = query.toLowerCase()
    return (
      bookmark.name.toLowerCase().includes(searchTerm) ||
      bookmark.url.toLowerCase().includes(searchTerm) ||
      bookmark.domain.toLowerCase().includes(searchTerm) ||
      bookmark.category.toLowerCase().includes(searchTerm) ||
      bookmark.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }) || []

  return {
    filteredBookmarks,
    resultCount: filteredBookmarks.length,
    hasResults: filteredBookmarks.length > 0,
  }
}

// Hook for bookmark operations (for future GitLab integration)
export function useBookmarkOperations() {
  const queryClient = useQueryClient()
  
  // Optimistic update helper
  const updateBookmarkCache = (bookmarkId: string, updater: (bookmark: Bookmark) => Bookmark) => {
    queryClient.setQueryData<Bookmark[]>(queryKeys.bookmarks, (old) => {
      if (!old) return old
      return old.map(bookmark => 
        bookmark.sourcePath === bookmarkId ? updater(bookmark) : bookmark
      )
    })
  }

  // Navigate to GitLab for bookmark editing
  const editBookmark = (bookmark: Bookmark) => {
    if (bookmark.sourcePath) {
      // Open GitLab file editor in new tab
      const gitLabUrl = `${import.meta.env.VITE_GITLAB_BASE_URL}${bookmark.sourcePath}/-/edit`
      window.open(gitLabUrl, '_blank')
    }
  }

  // Navigate to GitLab for bookmark creation
  const createBookmark = (category?: string) => {
    // Navigate to appropriate GitLab project for bookmark creation
    const gitLabUrl = `${import.meta.env.VITE_GITLAB_BASE_URL}/new-bookmark${category ? `?category=${encodeURIComponent(category)}` : ''}`
    window.open(gitLabUrl, '_blank')
  }

  return {
    editBookmark,
    createBookmark,
    updateBookmarkCache,
  }
}

// Error boundary hook for API errors
export function useApiErrorHandler() {
  return (error: unknown) => {
    if (error instanceof ApiError) {
      // Handle specific API errors
      switch (error.status) {
        case 401:
          console.error('Unauthorized access')
          break
        case 403:
          console.error('Forbidden access')
          break
        case 404:
          console.error('Resource not found')
          break
        case 429:
          console.error('Rate limit exceeded')
          break
        case 500:
          console.error('Server error')
          break
        default:
          console.error('API error:', error.message)
      }
    } else {
      console.error('Unknown error:', error)
    }
  }
}