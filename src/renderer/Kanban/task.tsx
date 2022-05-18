/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props: { isDragDisabled: any; isDragging: any }) =>
    props.isDragDisabled
      ? 'lightgrey'
      : props.isDragging
      ? 'lightgreen'
      : 'white'};
`;

const Task = (props: { index: number; data: TaskData }) => {
  const { index, data } = props;
  return (
    <Draggable
      draggableId={data.id}
      index={index}
      // isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {data.content}
        </Container>
      )}
    </Draggable>
  );
};

export default Task;
