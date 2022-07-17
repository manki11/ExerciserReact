import React, { useRef } from "react";
import { useDrop, useDrag } from "react-dnd";
import Exercise from "./Exercise";

export const ExerciseListItem = ({
  exerciseData,
  props,
  moveListItem,
  index,
}) => {
  // useDrag - the list item is draggable
  const [{ isDragging }, dragRef] = useDrag({
    type: "exercise",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  // useDrop - the list item is also a drop area
  const [spec, dropRef] = useDrop({
    accept: "exercise",
    hover: (item, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverActualY = monitor.getClientOffset().y - hoverBoundingRect.top;

      // if dragging down, continue only when hover is smaller than middle Y
      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return;
      // if dragging up, continue only when hover is bigger than middle Y
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return;

      moveListItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const ref = useRef(null);
  const dragDropref = dragRef(dropRef(ref));

  const opacity = isDragging ? 0 : 1;

  return (
    <div
      className="col-md-6 exercise-div"
      ref={dragDropref}
      style={{ opacity }}
    >
      <Exercise
        onDelete={props.onDelete}
        onPlay={props.onPlay}
        onEdit={props.onEdit}
        isHost={props.isHost}
        isShared={props.isShared}
        onShare={props.onShare}
        presenceResult={props.presenceResult}
        inEditMode={props.inEditMode}
        {...exerciseData}
      />
    </div>
  );
};
