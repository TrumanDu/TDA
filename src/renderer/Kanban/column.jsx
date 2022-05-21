/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import { IconPlusStroked } from '@douyinfe/semi-icons';
import { Row, Col, Button, Modal, Collapse } from '@douyinfe/semi-ui';
import Task from './task';

const Container = styled.div`
  margin: 8px;
  /* border: 1px solid lightgrey; */
  border-radius: 2px;
  width: 33%;
  display: flex;
  background-color: ${(props) => props.color};
  flex-direction: column;
  min-height: 50%;
`;

const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'skyblue' : 'white')}
  flex-grow: 1;
  min-height: 100px;
`;

const Column = (props) => {
  const { column, tasks } = props;

  const color = () => {
    if (column.id === 'done') {
      return '#96f7d2';
    }
    if (column.id === 'inProgress') {
      return '#fff98c';
    }
    return '#f5f5f5';
  };

  const onNew = () => {};

  return (
    <Container color={color()}>
      {column.id === 'done' ? (
        <Collapse>
          <Collapse.Panel header={<Title>{column.title}</Title>} itemKey="1">
            <Droppable droppableId={column.id} type="TASK">
              {(provided, snapshot) => (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {tasks.map((task, index) => (
                    <Task key={task.id} data={task} index={index} />
                  ))}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          </Collapse.Panel>
        </Collapse>
      ) : (
        <>
          <Title>{column.title}</Title>
          {column.id === 'todo' ? (
            <Button
              icon={<IconPlusStroked />}
              theme="borderless"
              style={{ marginRight: 10 }}
              onClick={onNew}
            >
              New Task
            </Button>
          ) : (
            <></>
          )}
          <Droppable droppableId={column.id} type="TASK">
            {(provided, snapshot) => (
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {tasks.map((task, index) => (
                  <Task key={task.id} data={task} index={index} />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </>
      )}
    </Container>
  );
};

export default Column;
