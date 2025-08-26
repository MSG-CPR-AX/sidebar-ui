// hooks/useLocalBookmarks.js
// Hook to retrieve and observe local Chrome bookmarks.  When the
// provided `enabled` flag is true, the hook subscribes to bookmark
// events and keeps the local bookmark tree in sync.  Outside of a
// Chrome extension environment the hook simply returns an empty list.

import { useState, useEffect } from 'react';

export function useLocalBookmarks(enabled) {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    // If the chrome.bookmarks API is not available, do nothing.
    if (!(window.chrome && window.chrome.bookmarks)) {
      setNodes([]);
      return;
    }
    setLoading(true);
    const reload = () => {
      window.chrome.bookmarks.getTree((items) => {
        setNodes(items[0]?.children ?? []);
        setLoading(false);
      });
    };
    // Initial load
    reload();
    // Subscribe to bookmark events
    window.chrome.bookmarks.onCreated.addListener(reload);
    window.chrome.bookmarks.onRemoved.addListener(reload);
    window.chrome.bookmarks.onChanged.addListener(reload);
    window.chrome.bookmarks.onMoved.addListener(reload);
    return () => {
      // Cleanup listeners
      window.chrome.bookmarks.onCreated.removeListener(reload);
      window.chrome.bookmarks.onRemoved.removeListener(reload);
      window.chrome.bookmarks.onChanged.removeListener(reload);
      window.chrome.bookmarks.onMoved.removeListener(reload);
    };
  }, [enabled]);
  return { nodes, loading };
}