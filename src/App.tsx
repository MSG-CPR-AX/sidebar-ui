import { useState, useEffect, useMemo } from 'react';
import { fetchBookmarks } from './services/api';
import type { Bookmark } from './services/api';
import { Header } from './components/Header';
import { BookmarkList } from './components/BookmarkList';
import { buildBookmarkTree, filterBookmarkTree } from './utils/bookmarkUtils';
import './App.css';

const POLLING_INTERVAL_MS = 30000;
const CACHE_KEY = 'sidebeam_cached_bookmarks';

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Caching and fetching logic
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) setBookmarks(JSON.parse(cachedData));
    } catch (err) {
      console.error("Failed to load or parse cached bookmarks:", err);
    }

    const getBookmarks = async () => {
      if (!bookmarks.length) setLoading(true);
      setError(null);
      try {
        const data = await fetchBookmarks();
        setBookmarks(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch (err) {
        let errorMessage = "An unknown error occurred";
        if (err instanceof Error) errorMessage = err.message;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getBookmarks();
    const intervalId = setInterval(getBookmarks, POLLING_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const bookmarkTree = useMemo(() => buildBookmarkTree(bookmarks), [bookmarks]);

  const filteredTree = useMemo(() => {
    return filterBookmarkTree(bookmarkTree, searchTerm);
  }, [bookmarkTree, searchTerm]);

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="flex-grow p-2 overflow-y-auto">
        {error && <p className="text-yellow-500 bg-yellow-100 p-2 rounded mb-4">Warning: {error}</p>}

        {loading && <p className="p-2">Loading bookmarks...</p>}

        {!loading && filteredTree.length === 0 && !error && (
          <p className="p-2">{searchTerm ? `No results for "${searchTerm}"` : "No bookmarks found."}</p>
        )}

        {!loading && filteredTree.length > 0 && (
          <BookmarkList nodes={filteredTree} />
        )}
      </main>
    </div>
  );
}

export default App;
