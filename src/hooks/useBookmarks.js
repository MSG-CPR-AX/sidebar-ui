// hooks/useBookmarks.js
// Provides React Query hooks for fetching remote bookmark data from the
// backend API.  The API is expected to expose two endpoints:
//   GET /bookmarks           -> returns an array of BookmarkDto
//   GET /bookmarks/categories -> returns a CategoryNodeDto tree
//
// Responses should wrap results in a `data` field in order to comply
// with Spring Boot's ApiResponse wrapper.  When the wrapper is
// missing, the hooks fall back to returning the raw payload.

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Fetch all bookmarks from the backend.  Cached for a short period to
 * avoid unnecessary network traffic.  If the API returns an object
 * containing a `data` property, that property is returned; otherwise
 * the raw response data is returned.
 */
export function useBookmarks() {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const response = await axios.get('/bookmarks');
      // Many Spring Boot controllers wrap responses like { data: ... }
      return response.data?.data ?? response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    retry: 1
  });
}

/**
 * Fetch the bookmark category tree from the backend.  Not used in
 * the current implementation but provided for future expansion.
 */
export function useCategoryTree() {
  return useQuery({
    queryKey: ['categoryTree'],
    queryFn: async () => {
      const response = await axios.get('/bookmarks/categories');
      return response.data?.data ?? response.data;
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    retry: 1
  });
}