import { useState } from 'react'
import { Icon } from '../../atoms/Icon'

interface LocalBookmarkNodeProps {
  node: chrome.bookmarks.BookmarkTreeNode
  level: number
}

export const LocalBookmarkNode = ({ node, level }: LocalBookmarkNodeProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const isFolder = !node.url
  const domain = node.url ? new URL(node.url).hostname : ''

  const handleToggle = () => {
    if (isFolder) {
      setIsOpen(!isOpen)
    } else {
      // Open the bookmark in a new tab
      chrome.tabs.create({ url: node.url })
    }
  }

  return (
    <div>
      <div
        className="flex cursor-pointer items-center rounded p-1 hover:bg-gray-800"
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={handleToggle}
        onKeyPress={(e) =>
          (e.key === 'Enter' || e.key === ' ') && handleToggle()
        }
        role="button"
        tabIndex={0}
      >
        {isFolder ? (
          <>
            <Icon
              name={isOpen ? 'ChevronDown' : 'ChevronRight'}
              size={16}
              className="mr-1"
            />
            <Icon
              name={isOpen ? 'FolderOpen' : 'Folder'}
              size={16}
              className="mr-2 text-yellow-500"
            />
          </>
        ) : (
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
            alt="favicon"
            className="mr-2 h-4 w-4"
          />
        )}
        <span className="truncate text-sm">{node.title}</span>
      </div>
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <LocalBookmarkNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
