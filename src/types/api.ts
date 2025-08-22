// Generated TypeScript types based on backend DTOs and YAML structure

export interface PackageNode {
  key: string;
  children?: PackageNode[];
}

export interface CategoryNode {
  name: string;
  children?: CategoryNode[];
  count: number;
}

export interface Bookmark {
  name: string;
  url: string;
  domain: string;
  category: string;
  packages?: PackageNode[];
  meta?: Record<string, unknown>;
  sourcePath?: string;
  tags?: string[];
}

// API Response wrapper (from GlobalResponseBodyAdvice)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// API endpoints return types
export type BookmarksResponse = ApiResponse<Bookmark[]>;
export type CategoryTreeResponse = ApiResponse<CategoryNode>;

// UI-specific types
export interface BookmarkWithColor extends Bookmark {
  color?: string;
  pinned?: boolean;
}

export interface SearchFilters {
  query: string;
  tags: string[];
  categories: string[];
  colors: string[];
  pinnedOnly: boolean;
}

export interface ViewState {
  expandedFolders: Set<string>;
  selectedBookmarks: Set<string>;
  viewMode: 'list' | 'grid' | 'tree';
  sortBy: 'name' | 'url' | 'category' | 'dateAdded' | 'dateModified';
  sortOrder: 'asc' | 'desc';
}