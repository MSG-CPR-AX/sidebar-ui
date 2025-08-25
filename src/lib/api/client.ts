import { BookmarkData } from '../types'

const API_BASE_URL = '/api'

/**
 * A simple wrapper around fetch for making API calls.
 * @param endpoint The API endpoint to call.
 * @param options The options for the fetch call.
 * @returns The JSON response.
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    // In a real app, we'd have more sophisticated error handling.
    const errorInfo = await response.json()
    throw new Error(
      errorInfo.message || `An error occurred: ${response.statusText}`
    )
  }

  return response.json() as Promise<T>
}

/**
 * Fetches all bookmark data from the backend.
 */
export const getBookmarkData = (): Promise<BookmarkData> => {
  return apiFetch<BookmarkData>('/bookmarks')
}
