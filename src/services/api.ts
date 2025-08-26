// Define the structure for a Package, which can be nested
export interface Package {
  key:string;
  children?: Package[];
}

// Define the structure for the Meta information
interface Meta {
  priority: number;
  owner: string;
}

// Define the main Bookmark structure
export interface Bookmark {
  name: string;
  url: string;
  domain: string;
  category: string;
  packages: Package[];
  meta: Meta;
}

// The API is expected to return an array of Bookmarks
export type BookmarkResponse = Bookmark[];

// Read the base URL from Vite's environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined. Please check your .env file.");
}

/**
 * Fetches the list of bookmarks from the backend.
 * @returns {Promise<BookmarkResponse>} A promise that resolves to the list of bookmarks.
 */
export async function fetchBookmarks(): Promise<BookmarkResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks`);

    if (!response.ok) {
      // Throw an error with the status text to give more context
      throw new Error(`Failed to fetch bookmarks: ${response.status} ${response.statusText}`);
    }

    const data: BookmarkResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchBookmarks:", error);
    // Re-throw the error so it can be caught by the caller (e.g., a React component)
    throw error;
  }
}
