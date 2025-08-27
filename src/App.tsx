import { useState, useEffect, useMemo } from 'react';
import { fetchBookmarks } from './services/api';
import type { Bookmark } from './services/api';
import { Header } from './components/Header';
import { BookmarkList } from './components/BookmarkList';
import { Modal } from './components/Modal';
import { BookmarkDetail } from './components/BookmarkDetail';
import { buildBookmarkTree, filterBookmarkTree } from './utils/bookmarkUtils';
import './App.css';

const POLLING_INTERVAL_MS = 30000;
const CACHE_KEY = 'sidebeam_cached_bookmarks';

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [detailBookmark, setDetailBookmark] = useState<Bookmark | null>(null);

  useEffect(() => {
    // Caching and fetching logic remains the same
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) setBookmarks(JSON.parse(cachedData));
    } catch (err) { console.error(err); }

    const getBookmarks = async () => {
      if (!bookmarks.length) setLoading(true);
      setError(null);
      try {
        const data = await fetchBookmarks();
        setBookmarks(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch (err) {
        let e = "An unknown error occurred";
        if (err instanceof Error) e = err.message;
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    getBookmarks();
    const intervalId = setInterval(getBookmarks, POLLING_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const handleTagClick = (tag: string) => setSelectedTag(p => (p === tag ? null : tag));
  const handleShowDetails = (bookmark: Bookmark) => setDetailBookmark(bookmark);
  const handleCloseDetails = () => setDetailBookmark(null);

  const handleCopyToLocal = (bookmark: Bookmark) => {
    if (window.chrome && window.chrome.bookmarks) {
      chrome.bookmarks.create({ title: bookmark.name, url: bookmark.url }, (newBm: chrome.bookmarks.BookmarkTreeNode) => {
        setNotification(`Copied "${newBm.title}" to local bookmarks.`);
        setTimeout(() => setNotification(null), 3000);
      });
    } else {
      const msg = "Chrome Bookmarks API is not available.";
      setNotification(msg);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const bookmarkTree = useMemo(() => buildBookmarkTree(bookmarks), [bookmarks]);
  const filteredTree = useMemo(() => filterBookmarkTree(bookmarkTree, searchTerm, selectedTag), [bookmarkTree, searchTerm, selectedTag]);

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {notification && <div className="p-2 bg-green-500 text-white text-center text-sm">{notification}</div>}

      <main className="flex-grow p-2 overflow-y-auto">
        {error && <p className="text-yellow-500 bg-yellow-100 p-2 rounded mb-4">Warning: {error}</p>}
        {loading && <p className="p-2">Loading bookmarks...</p>}
        {!loading && filteredTree.length === 0 && !error && <p className="p-2">{searchTerm || selectedTag ? `No results found` : "No bookmarks found."}</p>}
        {!loading && filteredTree.length > 0 && (
          <BookmarkList
            nodes={filteredTree}
            selectedTag={selectedTag}
            onTagClick={handleTagClick}
            onCopyToLocal={handleCopyToLocal}
            onShowDetails={handleShowDetails}
          />
        )}
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
