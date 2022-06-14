/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import { IconPlusStroked } from '@douyinfe/semi-icons';
import { Button, Collapse } from '@douyinfe/semi-ui';
import React, { useRef } from 'react';
import Task from './task';
import NewTask from './Detail/newTask';
import EditTask from './Detail/editTask';

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
  const newTaskRef = useRef();
  const editTaskRef = useRef();

  const color = () => {
    if (column.id === 'done') {
      return '#96f7d2';
    }
    if (column.id === 'inProgress') {
      return '#fff98c';
    }
    return '#f5f5f5';
  };

  const addTask = (task) => {
    props.newTask(task);
  };
  const editTask = (task) => {
    props.editTask(task, `${task.id}`);
  };

  const removeTask = (taskId) => {
    props.removeTask(`${taskId}`);
  };

  const showTask = (taskData) => {
    editTaskRef.current.editModalShow(taskData);
  };

  return (
    <Container color={color()}>
      <NewTask addTask={addTask} ref={newTaskRef} />
      <EditTask editTask={editTask} ref={editTaskRef} />

      {column.id === 'done' ? (
        <Collapse style={{ height: '98%' }} defaultActiveKey="1">
          <Collapse.Panel
            header={<Title>{column.title}</Title>}
            itemKey="1"
            style={{ height: '98%' }}
          >
            <Droppable droppableId={column.id} type="TASK">
              {(provided, snapshot) => (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {tasks.map((task, index) => (
                    <Task
                      key={task.id}
                      data={task}
                      index={index}
                      removeTask={removeTask}
                    />
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
          <Button
            icon={<IconPlusStroked />}
            theme="borderless"
            style={
              column.id === 'todo'
                ? { marginRight: 10 }
                : { marginRight: 10, visibility: 'hidden' }
            }
            onClick={() => {
              newTaskRef.current.addModalShow();
            }}
          >
            New Task
          </Button>
          <Droppable droppableId={column.id} type="TASK">
            {(provided, snapshot) => (
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {tasks.map((task, index) => (
                  <Task
                    key={task.id}
                    data={task}
                    index={index}
                    showTask={showTask}
                    removeTask={removeTask}
                  />
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
