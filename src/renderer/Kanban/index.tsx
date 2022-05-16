/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Row, Col, Input, Divider } from '@douyinfe/semi-ui';
import item from '@douyinfe/semi-ui/lib/es/breadcrumb/item';
import Split from '@uiw/react-split';
import AppList from 'components/AppList';
import { useEffect, useState } from 'react';

function Kanban() {
  const [name, setName] = useState<string>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formApi, setFormApi] = useState();
  const [listData, setListData] = useState<any[]>([]);
  const [kanbanData, setKanbanData] = useState();
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
            setKanbanData(item.data.data);
            setKanbanObj({ ...item });

            setName(item.name.substring(0, item.name.indexOf('.')));
          } catch (error) {
            console.logo(item);
            console.error(error);
          }
        }
      }
    });
  }, []);

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
          getFormApi={(formApi) => {
            setFormApi(formApi);
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
            setKanbanData(item.data.data);
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
        context
      </div>
    </Split>
  );
}

export default Kanban;
