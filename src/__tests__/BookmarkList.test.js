// __tests__/BookmarkList.test.js
// Basic unit tests for the BookmarkList component.  These tests
// verify that the component renders the provided bookmarks and
// invokes callback props when buttons are clicked.  More thorough
// integration tests could be written to cover virtualization, but
// here we focus on core behaviours.

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookmarkList from '../components/BookmarkList';

describe('BookmarkList', () => {
  const sampleBookmarks = [
    { name: 'Google', url: 'https://google.com', category: 'Search' },
    { name: 'GitHub', url: 'https://github.com', category: 'Dev' }
  ];

  test('renders bookmark rows', () => {
    render(
      <BookmarkList
        bookmarks={sampleBookmarks}
        onSelect={() => {}}
        onCopy={() => {}}
        onOpen={() => {}}
      />
    );
    // Only the first row may be visible due to virtualization, so
    // check that at least the first bookmark name appears in the DOM.
    expect(screen.getByText('Google')).toBeInTheDocument();
  });

  test('calls onCopy when copy button is clicked', () => {
    const handleCopy = jest.fn();
    render(
      <BookmarkList
        bookmarks={sampleBookmarks}
        onSelect={() => {}}
        onCopy={handleCopy}
        onOpen={() => {}}
      />
    );
    // Find the copy button by its title attribute on the first row.
    const copyButtons = screen.getAllByTitle('로컬에 복사');
    // Trigger click on first copy button
    fireEvent.click(copyButtons[0]);
    expect(handleCopy).toHaveBeenCalledTimes(1);
  });
});