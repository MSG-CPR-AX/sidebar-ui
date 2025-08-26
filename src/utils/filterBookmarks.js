// utils/filterBookmarks.js
// Helper function to filter a list of bookmarks based on selected
// categories and a search query.  Categories are compared by checking
// if the bookmark's category string starts with any of the provided
// category keys.  Search filters match substrings in the bookmark
// name or URL case‑insensitively.

export function filterBookmarks(bookmarks, selectedCategories, searchValue) {
  const search = (searchValue ?? '').trim().toLowerCase();
  return bookmarks.filter((bm) => {
    // Category match: if no categories provided return true by default
    const categoryMatch = !selectedCategories || selectedCategories.length === 0
      ? true
      : selectedCategories.some((cat) => bm.category && bm.category.toLowerCase().startsWith(cat.toLowerCase()));
    // Search match
    const searchMatch = !search
      || (bm.name && bm.name.toLowerCase().includes(search))
      || (bm.url && bm.url.toLowerCase().includes(search));
    return categoryMatch && searchMatch;
  });
}