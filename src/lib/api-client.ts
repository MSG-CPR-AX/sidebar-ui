import type { ApiResponse, Bookmark, CategoryNode } from '@/types/api'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const REQUEST_TIMEOUT = 10000

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Enhanced fetch wrapper with retry logic and error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 3
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  const url = `${API_BASE_URL}${endpoint}`
  const requestOptions: RequestInit = {
    ...options,
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, requestOptions)
    clearTimeout(timeoutId)

    if (!response.ok) {
      // Handle different HTTP error statuses
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      try {
        const errorBody = await response.json()
        if (errorBody.message) {
          errorMessage = errorBody.message
        }
      } catch {
        // Ignore JSON parse errors for error responses
      }

      // Retry on 5xx errors or 429 (rate limit)
      if (retries > 0 && (response.status >= 500 || response.status === 429)) {
        const delay = Math.pow(2, 3 - retries) * 1000 // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay))
        return apiRequest<T>(endpoint, options, retries - 1)
      }

      throw new ApiError(errorMessage, response.status)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408)
      }
      throw new ApiError(`Network error: ${error.message}`)
    }

    throw new ApiError('Unknown error occurred')
  }
}

// API endpoint functions
export const api = {
  // Get all bookmarks
  async getBookmarks(): Promise<Bookmark[]> {
    const response = await apiRequest<ApiResponse<Bookmark[]>>('/bookmarks')
    if (!response.success) {
      throw new ApiError(response.message || 'Failed to fetch bookmarks')
    }
    return response.data
  },

  // Get category tree
  async getCategoryTree(): Promise<CategoryNode> {
    const response = await apiRequest<ApiResponse<CategoryNode>>('/bookmarks/categories')
    if (!response.success) {
      throw new ApiError(response.message || 'Failed to fetch category tree')
    }
    return response.data
  },

  // Health check endpoint
  async healthCheck(): Promise<boolean> {
    try {
      await apiRequest('/health', { method: 'GET' })
      return true
    } catch {
      return false
    }
  },
}

// Query keys for TanStack Query
export const queryKeys = {
  bookmarks: ['bookmarks'] as const,
  categoryTree: ['bookmarks', 'categories'] as const,
  health: ['health'] as const,
} as const