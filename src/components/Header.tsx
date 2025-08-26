import React from 'react';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function Header({ searchTerm, onSearchChange }: HeaderProps) {
  return (
    <header className="p-4 bg-gray-800 text-white shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Sidebeam</h1>
        {/* Action icons will go here */}
      </div>
      <SearchBar value={searchTerm} onChange={onSearchChange} placeholder="Search bookmarks..." />
    </header>
  );
}
