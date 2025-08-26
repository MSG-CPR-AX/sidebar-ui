import React, { useState, useEffect } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getMockBookmarks } from './data/mockData';
import SidebarLayout from './components/SidebarLayout';
import BookmarkList from './components/BookmarkList';
import './App.css';

const queryClient = new QueryClient();

function Bookmarks() {
  const { data: initialData, isLoading, error } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: getMockBookmarks,
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (initialData) {
      setItems(initialData.data);
    }
  }, [initialData]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <SidebarLayout>
      <BookmarkList items={items} setItems={setItems} />
    </SidebarLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Bookmarks />
    </QueryClientProvider>
  );
}

export default App;
