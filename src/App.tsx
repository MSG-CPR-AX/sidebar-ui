import { useState, useEffect, useMemo } from 'react';
import { fetchBookmarks } from './services/api';
import type { Bookmark } from './services/api';
import { Header } from './components/Header';
import { BookmarkList } from './components/BookmarkList';
import { Modal } from './components/Modal';
import { BookmarkDetail } from './components/BookmarkDetail';
import { buildBookmarkTree, filterBookmarkTree } from './utils/bookmarkUtils';
import './App.css';

// --- Constants ---
// This is the interval for how often the app will automatically refetch bookmarks in production.
const POLLING_INTERVAL_MS = 30000; // 30 seconds
// This is the key used to save and load the bookmarks from the browser's local storage.
const CACHE_KEY = 'sidebeam_cached_bookmarks';

/**
 * A helper function to get the initial state from localStorage.
 * This makes the app feel faster by loading cached data instantly on startup.
 * It's wrapped in a try-catch block to prevent crashes if localStorage is unavailable or data is corrupted.
 */
const getInitialState = (): Bookmark[] => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : [];
  } catch (err) {
    console.error("Failed to load or parse cached bookmarks on init:", err);
    return [];
  }
};

/**
 * This is the main component of the application. It's responsible for:
 * - Managing the application's state (bookmarks, loading status, errors, etc.).
 * - Fetching data from the API or mock service.
 * - Processing and filtering the data.
 * - Rendering all other components.
 */
function App() {
  // --- State Management ---
  // `useState` is a React Hook that lets you add a state variable to your component.
  // It returns a pair: the current state value and a function that lets you update it.

  // `bookmarks` holds the master list of all bookmarks.
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(getInitialState);
  // `loading` tracks whether the app is currently fetching data.
  const [loading, setLoading] = useState<boolean>(true);
  // `error` holds any error message if a data fetch fails.
  const [error, setError] = useState<string | null>(null);
  // `searchTerm` stores the current text in the search bar.
  const [searchTerm, setSearchTerm] = useState('');
  // `selectedTag` stores the currently active tag filter.
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  // `notification` stores a short-lived message for user feedback (e.g., "Copied!").
  const [notification, setNotification] = useState<string | null>(null);
  // `detailBookmark` stores the bookmark object for the modal view. If null, the modal is hidden.
  const [detailBookmark, setDetailBookmark] = useState<Bookmark | null>(null);

  // --- Data Fetching and Effects ---
  // `useEffect` is a React Hook that lets you perform side effects in your components.
  // Data fetching, setting up a subscription, and manually changing the DOM are all examples of side effects.
  // The empty array `[]` at the end means this effect will only run once, when the component first mounts.
  useEffect(() => {
    const getBookmarks = async () => {
      setLoading(true);
      setError(null);
      try {
        // This function fetches real data in production and mock data in development.
        const data = await fetchBookmarks();
        setBookmarks(data);
        // We only cache data in production mode to avoid overwriting the cache with mock data.
        if (!import.meta.env.DEV) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        }
      } catch (err) {
        let e = "Failed to fetch bookmarks. Showing cached or initial data.";
        if (err instanceof Error) e = err.message;
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    getBookmarks();

    // In production, we set up an interval to automatically refetch data.
    if (!import.meta.env.DEV) {
      const intervalId = setInterval(getBookmarks, POLLING_INTERVAL_MS);
      // The return function is a "cleanup" function that runs when the component is unmounted.
      // This is important to prevent memory leaks.
      return () => clearInterval(intervalId);
    }
  }, []);

  // --- Event Handlers ---
  // These functions are passed down as props to child components to handle user interactions.
  const handleTagClick = (tag: string) => setSelectedTag(p => (p === tag ? null : tag));
  const handleShowDetails = (bookmark: Bookmark) => setDetailBookmark(bookmark);
  const handleCloseDetails = () => setDetailBookmark(null);

  const handleCopyToLocal = (bookmark: Bookmark) => {
    // `window.chrome` is only available when running as a Chrome extension.
    if (window.chrome && window.chrome.bookmarks) {
      chrome.bookmarks.create({ title: bookmark.name, url: bookmark.url }, (newBm) => {
        setNotification(`Copied "${newBm.title}" to local bookmarks.`);
        setTimeout(() => setNotification(null), 3000);
      });
    } else {
      const msg = "Chrome Bookmarks API is not available.";
      setNotification(msg);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // --- Data Processing ---
  // `useMemo` is a React Hook that memoizes (caches) the result of a calculation.
  // This ensures that complex calculations are only re-run when their dependencies change.

  // This builds the hierarchical tree from the flat list of bookmarks.
  // It only re-runs if the `bookmarks` state changes.
  const bookmarkTree = useMemo(() => buildBookmarkTree(bookmarks), [bookmarks]);

  // This filters the tree based on the search term and selected tag.
  // It only re-runs if the tree, search term, or selected tag change.
  const filteredTree = useMemo(() => filterBookmarkTree(bookmarkTree, searchTerm, selectedTag), [bookmarkTree, searchTerm, selectedTag]);

  // --- Rendering Logic ---
  // This function determines what to show in the main content area.
  const renderContent = () => {
    if (loading) {
      return <p className="p-4 text-gray-500">Loading bookmarks...</p>;
    }
    if (filteredTree.length > 0) {
      return (
        <BookmarkList
          nodes={filteredTree}
          selectedTag={selectedTag}
          onTagClick={handleTagClick}
          onCopyToLocal={handleCopyToLocal}
          onShowDetails={handleShowDetails}
        />
      );
    }
    // This now handles both "no results from filter" and "no initial data".
    return <p className="p-4 text-gray-500">{searchTerm || selectedTag ? `No results found` : "No bookmarks available."}</p>;
  };

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {notification && <div className="p-2 bg-green-500 text-white text-center text-sm">{notification}</div>}

      {error && <p className="p-2 bg-yellow-100 text-yellow-700 text-center text-sm">Warning: {error}</p>}

      <main className="flex-grow overflow-y-auto">
        {renderContent()}
      </main>

      {detailBookmark && (
        <Modal isOpen={!!detailBookmark} onClose={handleCloseDetails} title={detailBookmark.name}>
          <BookmarkDetail bookmark={detailBookmark} />
        </Modal>
      )}
    </div>
  );
}

export default App;
