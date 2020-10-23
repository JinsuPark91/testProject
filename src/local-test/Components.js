import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

export const Container = ({ children, style, accept, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  let backgroundColor = style.backgroundColor || '#222';
  if (isActive) {
    backgroundColor = 'darkgreen';
  } else if (canDrop) {
    backgroundColor = 'darkkhaki';
  }
  return (
    <div ref={drop} style={{ ...style, backgroundColor }}>
      {children}
    </div>
  );
};

export const Item = ({ children, style, type, hideSourceOnDrag }) => {
  const [{ backgroundColor, isDragging }, drag] = useDrag({
    item: { type, data: { content: '내맘대로 데이터', id: '1234' } },
    collect: monitor => ({
      backgroundColor: monitor.isDragging() ? 'yellow' : 'white',
      isDragging: monitor.isDragging(),
    }),
  });

  console.log(hideSourceOnDrag);
  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }
  return (
    <div ref={drag} style={{ ...style, backgroundColor }}>
      {children}
    </div>
  );
};
