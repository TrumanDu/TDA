/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import { IconPlusStroked, IconMinusCircle } from '@douyinfe/semi-icons';
import {
  Row,
  Col,
  Button,
  Modal,
  Collapse,
  Form,
  ArrayField,
} from '@douyinfe/semi-ui';
import { useState } from 'react';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [formApi, setFormApi] = useState();

  const color = () => {
    if (column.id === 'done') {
      return '#96f7d2';
    }
    if (column.id === 'inProgress') {
      return '#fff98c';
    }
    return '#f5f5f5';
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleOk = () => {
    formApi
      .validate()
      .then((values) => {
        window.electron.ipcRenderer.send('kanban', 'new', {
          name: values.name,
        });
        setModalVisible(false);
        return '';
      })
      .catch((errors) => {
        console.log(errors);
      });
  };

  return (
    <Container color={color()}>
      <Modal
        title="New Task"
        style={{ width: 600 }}
        visible={modalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        okText="Save"
        cancelText="Cancel"
      >
        <Form
          getFormApi={(api) => {
            setFormApi(api);
          }}
        >
          <Row>
            <Col span={24}>
              <Form.Input
                field="title"
                label="Title"
                trigger="blur"
                placeholder="Enter task title"
                rules={[{ required: true, message: 'Title is required.' }]}
              />
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Select
                field="urgent"
                label="Urgent"
                placeholder="Please select"
                style={{ width: '100%' }}
                rules={[{ required: true, message: 'Urgent is required.' }]}
              >
                <Form.Select.Option value="0">Normal</Form.Select.Option>
                <Form.Select.Option value="1">Important</Form.Select.Option>
              </Form.Select>
            </Col>
            <Col span={11} offset={1}>
              <Form.DatePicker
                field="dueDate"
                label="Due Date"
                motion={false}
                style={{ width: '250px' }}
                initValue={new Date()}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.TextArea
                field="description"
                label="Description"
                trigger="blur"
                placeholder="Enter task description"
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <ArrayField field="effects" initValue={[]}>
                {({ add, arrayFields, addWithInitValue }) => (
                  <>
                    <Button
                      onClick={() => {
                        addWithInitValue({
                          name: 'new subtask',
                        });
                      }}
                      icon={<IconPlusStroked />}
                      theme="light"
                    >
                      Add Subtask
                    </Button>
                    {arrayFields.map(({ field, key, remove }, i) => (
                      <div key={key} style={{ display: 'flex' }}>
                        <Form.Checkbox
                          noLabel
                          onChange={(checked) => console.log(checked)}
                          field={`${field}[status]`}
                        />
                        &nbsp; &nbsp;
                        <Form.Input
                          field={`${field}[name]`}
                          noLabel
                          style={{ width: '400px', backgroundColor: 'white' }}
                        />
                        <Button
                          type="danger"
                          theme="borderless"
                          icon={<IconMinusCircle />}
                          onClick={remove}
                          style={{ margin: 12 }}
                        />
                      </div>
                    ))}
                  </>
                )}
              </ArrayField>
            </Col>
          </Row>
        </Form>
      </Modal>
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
          <Button
            icon={<IconPlusStroked />}
            theme="borderless"
            style={
              column.id === 'todo'
                ? { marginRight: 10 }
                : { marginRight: 10, visibility: 'hidden' }
            }
            onClick={() => setModalVisible(true)}
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
