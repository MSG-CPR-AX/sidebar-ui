import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { SearchIcon } from './icons/SearchIcon';
import { MenuIcon } from './icons/MenuIcon';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function Header({ searchTerm, onSearchChange }: HeaderProps) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <header className="p-2 bg-gray-800 text-white shadow-md flex-shrink-0">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold ml-2">Sidebeam</h1>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsSearchVisible(prev => !prev)}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <SearchIcon className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-700">
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
