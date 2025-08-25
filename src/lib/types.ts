export interface Bookmark {
  id: string
  title: string
  url: string
  description?: string
  tags: string[] // Array of Tag IDs
  folderId?: string // ID of the Folder it belongs to
  color?: string // e.g., 'red', 'blue', etc.
  isPinned: boolean
  createdAt: string // ISO 8601 date string
  updatedAt: string // ISO 8601 date string
}

export interface Folder {
  id: string
  title: string
  // Folders can be nested. `children` will contain Folder IDs.
  // Bookmarks within a folder are identified by their `folderId` property.
  children: string[]
  parentId?: string
  isOpen?: boolean // For UI state
}

export interface Tag {
  id: string
  name: string
  color: string
}

// The entire dataset structure from the backend
export interface BookmarkData {
  bookmarks: Bookmark[]
  folders: Folder[]
  tags: Tag[]
}
