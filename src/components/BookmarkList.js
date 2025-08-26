import React from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import FolderItem from './FolderItem';
import BookmarkItem from './BookmarkItem';

const BookmarkList = ({ items, setItems }) => {
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  if (!items) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="bookmarks">
        {(provided) => (
          <ul className="bookmark-list" {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => {
              if (item.type === 'folder') {
                return <FolderItem key={item.id} folder={item} index={index} />;
              }
              if (item.type === 'bookmark') {
                return <BookmarkItem key={item.id} bookmark={item} index={index} />;
              }
              return null;
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default BookmarkList;
