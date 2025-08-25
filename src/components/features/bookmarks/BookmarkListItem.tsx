import { Bookmark, Tag } from '../../../lib/types'
import { Icon } from '../../atoms/Icon'
import {
  useContextMenu,
  ContextMenuWrapper,
  ContextMenuItem,
} from '../../overlays/ContextMenu'

interface BookmarkListItemProps {
  bookmark: Bookmark
  allTags: Tag[]
  onEdit: (bookmark: Bookmark) => void
}

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

export const BookmarkListItem = ({
  bookmark,
  allTags,
  onEdit,
}: BookmarkListItemProps) => {
  const { position, handleContextMenu, closeMenu } = useContextMenu()
  const bookmarkTags = allTags.filter((tag) => bookmark.tags.includes(tag.id))
  const domain = getDomain(bookmark.url)

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(bookmark.url)
    closeMenu()
  }

  const menuItems = (
    <>
      <ContextMenuItem
        onClick={() => {
          onEdit(bookmark)
          closeMenu()
        }}
      >
        <Icon name="FilePenLine" size={14} className="mr-2" /> Edit
      </ContextMenuItem>
      <ContextMenuItem onClick={handleCopyUrl}>
        <Icon name="Copy" size={14} className="mr-2" /> Copy URL
      </ContextMenuItem>
      <ContextMenuItem onClick={closeMenu}>
        <Icon name="Trash2" size={14} className="mr-2" /> Delete
      </ContextMenuItem>
    </>
  )

  return (
    <ContextMenuWrapper position={position} menuItems={menuItems}>
      <div
        onContextMenu={handleContextMenu}
        className="group hover:bg-surface flex items-start rounded-lg p-2.5"
      >
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
          alt="favicon"
          className="mt-1 mr-3 h-4 w-4"
        />
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="text-primary text-sm font-medium">
              {bookmark.title}
            </span>
            {bookmark.isPinned && (
              <Icon name="Pin" size={14} className="text-secondary ml-2" />
            )}
          </div>
          <p className="text-secondary text-xs">{domain}</p>
          {bookmarkTags.length > 0 && (
            <div className="mt-1 flex items-center gap-1.5">
              {bookmarkTags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-accent-blue/10 text-accent-blue rounded-full px-2 py-0.5 text-xs"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(bookmark)}
            className="text-secondary hover:text-primary p-1"
          >
            <Icon name="FilePenLine" size={16} />
          </button>
          <button className="text-secondary hover:text-primary p-1">
            <Icon name="MoveHorizontal" size={16} />
          </button>
        </div>
      </div>
    </ContextMenuWrapper>
  )
}
