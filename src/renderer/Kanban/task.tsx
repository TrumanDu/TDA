/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import {
  Button,
  Card,
  Col,
  Progress,
  Row,
  Space,
  Tag,
} from '@douyinfe/semi-ui';
import { IconCrossStroked } from '@douyinfe/semi-icons';

import './task.css';
import moment from 'moment';

const Container = styled.div`
  /*  border: 1px solid lightgrey;
  border-radius: 2px; */
  padding: ${(props: { isDragDisabled: any; isDragging: any }) =>
    props.isDragDisabled ? '4px' : props.isDragging ? '4px' : '0px'};
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props: { isDragDisabled: any; isDragging: any }) =>
    props.isDragDisabled
      ? 'rgba(var(--semi-blue-6), 1)'
      : props.isDragging
      ? 'rgba(var(--semi-blue-6), 1)'
      : 'white'};
`;

const Task = (props: { index: number; data: TaskData }) => {
  const { index, data, removeTask, showTask } = props;
  let isNeedProgress = false;
  let completed = 0;
  let total = 0;
  if (data.subTask && data.subTask.length > 0) {
    isNeedProgress = true;
    total = data.subTask.length;
    data.subTask.forEach((sub) => {
      if (sub.status) {
        completed += 1;
      }
    });
  }
  return (
    <Draggable
      draggableId={`${data.id}`}
      index={index}
      // isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <Container
          id="task"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <Card
            onClick={() => {
              showTask(data);
            }}
            shadows="hover"
            style={{
              backgroundColor: props.isDragDisabled
                ? 'lightgrey'
                : props.isDragging
                ? 'lightgreen'
                : 'white',
            }}
          >
            <Row>
              <Col span={23}>
                <h2>{data.title}</h2>
              </Col>
              <Col span={1}>
                <Button
                  style={{ display: 'none' }}
                  theme="borderless"
                  onClick={() => {
                    removeTask(data.id);
                  }}
                  icon={<IconCrossStroked style={{ color: '#474a4d' }} />}
                />
              </Col>
            </Row>
            {isNeedProgress ? (
              <Row>
                <Col span={24}>
                  <Progress
                    percent={(completed / total) * 100}
                    stroke="rgba(var(--semi-blue-4), 1)"
                    showInfo
                    format={() => `${completed}/${total}`}
                  />
                </Col>
              </Row>
            ) : (
              <></>
            )}

            <br />
            <Row>
              <Col span={24}>
                <Space wrap spacing={30}>
                  {data.dueDate ? (
                    <Tag
                      color={
                        moment(data.dueDate).isBefore(moment()) ? 'red' : 'grey'
                      }
                      size="large"
                    >
                      {moment(data.dueDate).format('YYYY-MM-DD')}
                    </Tag>
                  ) : (
                    <></>
                  )}

                  {data.urgent === 1 ? (
                    <Tag color="red" size="large">
                      Important
                    </Tag>
                  ) : (
                    <Tag color="blue" size="large">
                      Normal
                    </Tag>
                  )}
                </Space>
              </Col>
            </Row>
          </Card>
        </Container>
      )}
    </Draggable>
  );
};

export default Task;
