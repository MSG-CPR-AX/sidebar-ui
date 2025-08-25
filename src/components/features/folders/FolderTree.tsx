import { useState, useMemo, useEffect } from 'react'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useBookmarkData } from '../../../lib/hooks/useBookmarkData'
import { Folder } from '../../../lib/types'
import { Icon } from '../../atoms/Icon'

// Make the individual folder node sortable
const SortableFolderNode = ({
  folder,
  allFolders,
  level,
}: {
  folder: Folder
  allFolders: Folder[]
  level: number
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: folder.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [isOpen, setIsOpen] = useState(true)
  const childFolders = allFolders.filter((f) => f.parentId === folder.id)

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className="flex items-center rounded p-1 hover:bg-gray-800"
        style={{ paddingLeft: `${level * 1.5}rem` }}
      >
        <button onClick={() => setIsOpen(!isOpen)} className="p-1">
          <Icon name={isOpen ? 'ChevronDown' : 'ChevronRight'} size={16} />
        </button>
        <Icon
          name={isOpen ? 'FolderOpen' : 'Folder'}
          size={16}
          className="mr-2 text-yellow-500"
        />
        <span className="text-sm">{folder.title}</span>
      </div>
      {isOpen && childFolders.length > 0 && (
        <div>
          {/* Note: Nested sortable contexts would be needed for full re-parenting */}
          {childFolders.map((child) => (
            <SortableFolderNode
              key={child.id}
              folder={child}
              allFolders={allFolders}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const FolderTree = () => {
  const { data, isLoading, isError } = useBookmarkData()
  const [folders, setFolders] = useState<Folder[]>([])

  useEffect(() => {
    if (data?.folders) {
      setFolders(data.folders)
    }
  }, [data?.folders])

  const rootFolders = useMemo(
    () => folders.filter((f) => f.parentId === 'root'),
    [folders]
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setFolders((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        // This is a simplified move, full hierarchical move is more complex
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  if (isLoading) return <div>Loading folders...</div>
  if (isError) return <div>Error loading data.</div>

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={rootFolders.map((f) => f.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1 p-2">
          {rootFolders.map((folder) => (
            <SortableFolderNode
              key={folder.id}
              folder={folder}
              allFolders={folders}
              level={0}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
