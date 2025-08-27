import { mockBookmarks } from '../mock-data';
import type { Bookmark, Package } from './api';

// Re-exporting types for other modules to use
export type { Bookmark, Package };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches the list of bookmarks.
 * In development mode, it returns mock data after a short delay.
 * In production, it fetches from the live API endpoint.
 * @returns {Promise<Bookmark[]>} A promise that resolves to the list of bookmarks.
 */
export async function fetchBookmarks(): Promise<Bookmark[]> {
  // Use mock data in development mode
  if (import.meta.env.DEV) {
    console.log("DEV mode: Returning mock bookmarks.");
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockBookmarks);
      }, 500); // Simulate network delay
    });
  }

  // Production mode: fetch from the real API
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not defined for production. Please check your environment variables.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks`);

    if (!response.ok) {
      throw new Error(`Failed to fetch bookmarks: ${response.status} ${response.statusText}`);
    }

    const data: Bookmark[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchBookmarks:", error);
    throw error;
  }
}
