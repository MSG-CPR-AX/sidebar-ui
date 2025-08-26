import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const BookmarkItem = ({ bookmark, index }) => {
  return (
    <Draggable draggableId={bookmark.id} index={index}>
      {(provided) => (
        <li
          className="bookmark-item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
            {bookmark.name}
          </a>
        </li>
      )}
    </Draggable>
  );
};

export default BookmarkItem;
