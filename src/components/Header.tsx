import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { SearchIcon } from './icons/SearchIcon';
import { MenuIcon } from './icons/MenuIcon';

/**
 * Props for the Header component.
 */
interface HeaderProps {
  searchTerm: string; // The current search term.
  onSearchChange: (term: string) => void; // Callback to update the search term.
}

/**
 * The main header for the application.
 * It displays the title, action icons, and a toggleable search bar.
 */
export function Header({ searchTerm, onSearchChange }: HeaderProps) {
  // This state is local to the Header and only controls the visibility of the search input.
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <header className="p-2 bg-gray-800 text-white shadow-md flex-shrink-0">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold ml-2">Sidebeam</h1>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsSearchVisible(prev => !prev)}
            className="p-2 rounded-full hover:bg-gray-700"
            aria-label="Toggle search"
          >
            <SearchIcon className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-700" aria-label="Menu">
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      {isSearchVisible && (
        <div className="mt-2">
          <SearchBar value={searchTerm} onChange={onSearchChange} placeholder="Search bookmarks..." />
        </div>
      )}
    </header>
  );
}
