/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Row, Col, Input, Divider } from '@douyinfe/semi-ui';
import item from '@douyinfe/semi-ui/lib/es/breadcrumb/item';
import Split from '@uiw/react-split';
import AppList from 'components/AppList';
import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './column';

import initialData from './initialData';

function Kanban() {
  const [name, setName] = useState<string>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formApi, setFormApi] = useState();
  const [listData, setListData] = useState<any[]>([]);
  const [kanbanData, setKanbanData] = useState(initialData);
  const [kanbanObj, setKanbanObj] = useState();

  const handleCancel = () => {
    setModalVisible(false);
  };
  const handleOk = () => {
    formApi
      .validate()
      .then((values: any) => {
        window.electron.ipcRenderer.send('kanban', 'new', {
          name: values.name,
        });
        setModalVisible(false);
      })
      .catch((errors: any) => {
        console.log(errors);
      });
  };

  useEffect(() => {
    window.electron.ipcRenderer.send('kanban', 'list');
    window.electron.ipcRenderer.on('list-kanban', (data) => {
      if (data) {
        setListData(data);
        if (data.length > 0) {
          try {
            const item = data[0];
            // setKanbanData(item.data.data);
            setKanbanObj({ ...item });

            setName(item.name.substring(0, item.name.indexOf('.')));
          } catch (error) {
            console.log(item);
            console.error(error);
          }
        }
      }
    });
  }, []);

  const onDragEnd = (result: {
    destination: any;
    source: any;
    draggableId: any;
  }) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = kanbanData.columns[source.droppableId];
    const finish = kanbanData.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...kanbanData,
        columns: {
          ...kanbanData.columns,
          [newColumn.id]: newColumn,
        },
      };

      setKanbanData(newState);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...kanbanData,
      columns: {
        ...kanbanData.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setKanbanData(newState);
  };

  return (
    <Split
      lineBar
      style={{
        height: '97vh',
        border: '1px solid #d5d5d5',
        borderRadius: 3,
      }}
    >
      <Modal
        title="New Kanban"
        visible={modalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        okText="Save"
        cancelText="Cancel"
      >
        <Form
          layout="horizontal"
          getFormApi={(api) => {
            setFormApi(api);
          }}
        >
          <Row>
            <Col span={2} />
            <Col span={20}>
              <Form.Input
                style={{ width: '300px' }}
                field="name"
                noLabel
                trigger="blur"
                addonAfter=".kanban"
                size="large"
                placeholder="Enter kanban name"
                rules={[{ required: true, message: 'Name is required.' }]}
              />
            </Col>
            <Col span={2} />
          </Row>
        </Form>
      </Modal>
      <div style={{ minWidth: '15%', maxWidth: '40%', width: '350px' }}>
        <AppList
          dataSource={listData}
          onNew={() => {
            setModalVisible(true);
          }}
          onSelect={(item: any) => {
            // setKanbanData(item.data.data);
            setKanbanObj({ ...item });
            setName(item.name.substring(0, item.name.indexOf('.')));
          }}
          channel="kanban"
        />
      </div>
      <div style={{ flex: 1 }}>
        <Row>
          <Col>
            <Input
              size="large"
              onChange={(value) => {
                setName(value);
              }}
              onBlur={(e) => {
                window.electron.ipcRenderer.send('kanban', 'rename', {
                  name: e.target.value,
                  oldname: kanbanObj?.name.substring(
                    0,
                    kanbanObj?.name.indexOf('.')
                  ),
                });
              }}
              value={name}
              style={{ backgroundColor: 'white' }}
            />
          </Col>
        </Row>
        <Divider />

        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'flex', minHeight: '96%' }}>
            {kanbanData.columnOrder.map((id) => {
              const column = kanbanData.columns[id];
              const tasks = column.taskIds.map(
                (taskId: string | number) => kanbanData.tasks[taskId]
              );

              return <Column key={column.id} column={column} tasks={tasks} />;
            })}
          </div>
        </DragDropContext>
      </div>
    </Split>
  );
}

export default Kanban;
