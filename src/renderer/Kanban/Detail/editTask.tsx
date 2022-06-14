/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/destructuring-assignment */
import { ArrayField, Button, Col, Form, Modal, Row } from '@douyinfe/semi-ui';
import { IconPlusStroked, IconMinusCircle } from '@douyinfe/semi-icons';
import { forwardRef, Ref, useImperativeHandle, useState } from 'react';

const EditTask = forwardRef((props: any, ref: Ref<unknown> | undefined) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [taskData, setTaskData] = useState<TaskData>();
  const [formApi, setFormApi] = useState();

  const handleCancel = () => {
    setModalVisible(false);
  };

  useImperativeHandle(ref, () => {
    return {
      editModalShow(taskData: TaskData) {
        setTaskData(taskData);
        setModalVisible(true);
      },
    };
  });

  const handleOk = () => {
    formApi
      .validate()
      .then(
        (values: {
          title: any;
          description: any;
          urgent: any;
          dueDate: any;
          effects: any;
        }) => {
          const newTaskData = {
            id: taskData.id,
            title: values.title,
            description: values.description,
            urgent: values.urgent,
            dueDate: values.dueDate,
            subTask: [...values.effects],
          };
          props.editTask(newTaskData);
          setModalVisible(false);
          return '';
        }
      )
      .catch((errors: any) => {
        console.log(errors);
      });
  };
  return (
    <Modal
      title="Edit Task"
      style={{ width: 600 }}
      visible={modalVisible}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Save"
      cancelText="Cancel"
    >
      {taskData ? (
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
                initValue={taskData?.title}
                placeholder="Enter task title"
                rules={[{ required: true, message: 'Title is required.' }]}
              />
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Select
                initValue={taskData?.urgent}
                field="urgent"
                label="Urgent"
                placeholder="Please select"
                style={{ width: '100%' }}
                rules={[{ required: true, message: 'Urgent is required.' }]}
              >
                <Form.Select.Option value={0}>Normal</Form.Select.Option>
                <Form.Select.Option value={1}>Important</Form.Select.Option>
              </Form.Select>
            </Col>
            <Col span={11} offset={1}>
              <Form.DatePicker
                field="dueDate"
                label="Due Date"
                motion={false}
                initValue={taskData?.dueDate}
                style={{ width: '250px' }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.TextArea
                field="description"
                label="Description"
                trigger="blur"
                initValue={taskData?.description}
                placeholder="Enter task description"
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <ArrayField field="effects" initValue={taskData?.subTask}>
                {({ add, arrayFields, addWithInitValue }) => (
                  <>
                    <Button
                      onClick={() => {
                        addWithInitValue({
                          content: 'new subtask',
                          status: false,
                        });
                      }}
                      icon={<IconPlusStroked />}
                      theme="light"
                    >
                      Add Subtask
                    </Button>
                    {arrayFields.map(({ field, key, remove }, i) => (
                      <div key={key} style={{ display: 'flex' }}>
                        <Form.Checkbox noLabel field={`${field}[status]`} />
                        &nbsp; &nbsp;
                        <Form.Input
                          field={`${field}[content]`}
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
      ) : (
        <></>
      )}
    </Modal>
  );
});

export default EditTask;
