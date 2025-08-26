import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import BookmarkList from './BookmarkList';

const FolderItem = ({ folder, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasChildren = folder.children && folder.children.length > 0;

  const handleToggle = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  // Note: A full implementation would require passing 'setItems' down
  // to handle nested drag-and-drop, but for this step, we focus on top-level.
  const childList = hasChildren ? <BookmarkList items={folder.children} /> : null;

  return (
    <Draggable draggableId={folder.id} index={index}>
      {(provided) => (
        <li
          className="folder-item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="folder-item-header" onClick={handleToggle}>
            <span className="folder-toggle-icon">
              {hasChildren ? (isOpen ? '▾' : '▸') : ' '}
            </span>
            <span className="folder-name">{folder.name}</span>
          </div>
          {isOpen && (
            <div className="folder-content">
              {childList}
            </div>
          )}
        </li>
      )}
    </Draggable>
  );
};

export default FolderItem;
