import { QueryClient } from '@tanstack/react-query'

// Configure QueryClient with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Keep unused data for 10 minutes
      gcTime: 1000 * 60 * 10,
      // Retry failed requests with exponential backoff
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        // @ts-ignore
        if (error.status && error.status >= 400 && error.status < 500) {
          return false
        }
        // Retry up to 3 times for network/server errors
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,
      // Don't refetch on reconnecting by default (manual refresh preferred)
      refetchOnReconnect: false,
      // Network mode for offline handling
      networkMode: 'offlineFirst',
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      // Network mode for offline handling
      networkMode: 'offlineFirst',
    },
  },
})

// Global error handler for queries
queryClient.setQueryDefaults(['bookmarks'], {
  staleTime: 1000 * 60 * 2, // Bookmarks are more dynamic, shorter cache time
})

// Set up global error handling
queryClient.setMutationDefaults([], {
  onError: (error) => {
    console.error('Mutation error:', error)
    // Here you could integrate with an error reporting service like Sentry
    // if (import.meta.env.VITE_SENTRY_DSN) {
    //   Sentry.captureException(error)
    // }
  },
})