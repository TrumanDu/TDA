/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Input,
  Row,
  Select,
  Space,
  Tooltip,
  Notification,
  List,
  Modal,
  Form,
} from '@douyinfe/semi-ui';
import {
  IconCamera,
  IconDeleteStroked,
  IconFlowChartStroked,
  IconPlusStroked,
  IconRealSizeStroked,
  IconWindowAdaptionStroked,
  IconListView,
  IconSearch,
  IconSave,
} from '@douyinfe/semi-icons';
import { ContextMenu, MiniMap } from '@antv/graphin-components';
import { Util } from '@antv/g6-core';
import Graphin from '@antv/graphin';
import Split from '@uiw/react-split';

import './index.css';

const { Menu } = ContextMenu;

let colorFlag = 0;

const colorArr = [
  '#4d94ff',
  '#ff9000',
  '#1f8d37',
  '#1dda70',
  '#00212b',
  '#fe695d',
  '#9b83f8',
  '#50c4ed',
  '#c82586',
  '#f96d15',
  '#155263',
  '#52d681',
];

const options = [
  {
    key: 'add',
    icon: <IconPlusStroked />,
    name: 'Sub Topic',
  },
  {
    key: 'delete',
    icon: <IconDeleteStroked />,
    name: 'Delete',
  },
];

const newMindObj = {
  name: 'New.mindmap',
  changeMs: new Date().getTime(),
  data: JSON.stringify({
    label: 'Topic',
    id: '0',
    style: { fill: 'blue' },
    size: [100, 40],
    children: [],
  }),
};

function MindMap() {
  const graphinRef = React.createRef();

  const [direction, setDirection] = useState<string>('LR');
  const [focusIndex, setFocusIndex] = useState<number>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formApi, setFormApi] = useState();
  const [originMindList, setOriginMindList] = useState<[]>([]);
  const [mindList, setMindList] = useState<[]>([]);

  const [mindMapObj, setMindMapObj] = useState<MindMapItem>(newMindObj);
  const [mindMapName, setMindMapName] = useState<string>('New');

  const reloadGraphin = () => {
    window.location.reload();
  };

  const handleChange = (menuItem: any, menuData: any) => {
    const { graph } = graphinRef.current;
    const item = graph.findById(menuData.id);
    if (menuItem.key === 'delete') {
      if (menuData.id === '0') {
        Notification.warning({
          title: 'Delete failed',
          position: 'top',
          content: 'The root node cannot be deleted',
          duration: 3,
        });
        return;
      }

      graph.removeChild(menuData.id);
      graph.get('canvas').set('localRefresh', false);
    }
    if (menuItem.key === 'add') {
      const model = item.get('model');
      const newId = `${model.id}-${
        ((model.children || []).reduce((a: number, b: { id: string }) => {
          const num = Number(b.id.split('-').pop());
          return a < num ? num : a;
        }, 0) || 0) + 1
      }`;

      const color = model.color || colorArr[colorFlag++ % colorArr.length];
      const children = (model.children || []).concat([
        {
          id: newId,
          label: 'New',
          color,
        },
      ]);

      model.children = children;
      graph.set('defaultEdge', {
        type: 'cubic-horizontal',
        style: {
          stroke: color,
          cursor: 'default',
          lineWidth: 1.5,
        },
      });
      graph.updateChild(model, menuData.id);
      graph.get('canvas').set('localRefresh', false);
    }
  };

  const exportImage = () => {
    graphinRef.current.graph.downloadFullImage();
  };

  const actualSize = () => {
    graphinRef.current.apis.handleRealZoom();
  };
  const fitMap = () => {
    graphinRef.current.apis.handleAutoZoom();
  };

  const fitView = () => {
    graphinRef.current.graph.fitView(20);
  };

  const addDblclickNodeListener = (graphinRef) => {
    graphinRef.current.graph.on(
      'node:dblclick',
      (evt: { currentTarget?: any; item?: any }) => {
        const { item } = evt;
        const model = item.get('model');
        const { x, y } = item.calculateBBox();
        const graph = evt.currentTarget;
        const realPosition = evt.currentTarget.getClientByPoint(x, y);
        const el = document.createElement('div');
        el.style.fontSize = '20px';
        el.style.position = 'fixed';
        el.style.top = `${realPosition.y}px`;
        el.style.left = `${realPosition.x}px`;
        el.style.paddingLeft = '2px';
        el.style.transformOrigin = 'top left';
        el.style.transform = `scale(${evt.currentTarget.getZoom()})`;
        const input = document.createElement('input');
        input.style.border = 'none';
        input.value = model.label;
        input.style.width = `${Util.getTextSize(model.label, 14)[0] + 20}px`;
        input.style.height = `25px`;
        input.className = 'dice-input';
        el.className = 'dice-input';
        el.appendChild(input);
        document.body.appendChild(el);
        input.focus();
        const destroyEl = () => {
          document.body.removeChild(el);
        };
        const clickEvt = (event: { target: any }) => {
          if (
            !(
              event.target &&
              event.target.className &&
              event.target.className.includes('dice-input')
            )
          ) {
            window.removeEventListener('mousedown', clickEvt);
            window.removeEventListener('scroll', clickEvt);
            graph.updateItem(item, {
              label: input.value,
              size: [Util.getTextSize(input.value, 14)[0] + 24, 28],
            });
            graph.layout(false);
            graph.off('wheelZoom', clickEvt);
            destroyEl();
          }
        };
        graph.on('wheelZoom', clickEvt);
        window.addEventListener('mousedown', clickEvt);
        window.addEventListener('scroll', clickEvt);
        input.addEventListener('keyup', (event) => {
          if (event.key === 'Enter') {
            clickEvt({
              target: {},
            });
          }
        });
      }
    );
  };

  useEffect(() => {
    // 监听
    window.addEventListener('resize', reloadGraphin);
    fitView();

    addDblclickNodeListener(graphinRef);
    window.electron.ipcRenderer.send('mind-map', 'list');
    window.electron.ipcRenderer.on('list-mind-map-file', (data) => {
      setOriginMindList(data);
      setMindList(data);
      setFocusIndex(0);
      if (data.length > 0) {
        try {
          const item = data[0];
          const { graph } = graphinRef.current;
          graph.changeData(JSON.parse(item.data));
          setMindMapObj({ ...item });
          setMindMapName(item.name.substring(0, item.name.indexOf('.')));
        } catch (error) {
          console.error(error, item);
        }
      }
    });

    // 销毁
    return () => window.removeEventListener('resize', () => {});
  }, []);

  useEffect(() => {
    fitView();
  }, [mindMapObj, focusIndex]);

  const onSearch = (
    search: string | React.CompositionEvent<HTMLInputElement> | null
  ) => {
    let newList;
    if (search) {
      newList = originMindList.filter((item) => item.name.includes(search));
    } else {
      newList = originMindList;
    }
    setMindList(newList);
  };
  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleOk = () => {
    formApi
      .validate()
      .then((values: any) => {
        window.electron.ipcRenderer.send('mind-map', 'new', {
          name: values.name,
        });
        setModalVisible(false);
      })
      .catch((errors: any) => {
        console.log(errors);
      });
  };

  const handleDelete = (name: string) => {
    Modal.warning({
      title: 'Are you sure delete?',
      onOk: () => {
        window.electron.ipcRenderer.send('mind-map', 'delete', { name });
      },
    });
  };

  const saveData = () => {
    const { graph } = graphinRef.current;
    window.electron.ipcRenderer.send('mind-map', 'edit', {
      name: mindMapName,
      data: graph.save(),
    });
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
        title="New Mind Map"
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
                addonAfter=".mindmap"
                size="large"
                placeholder="Enter mind map name"
                rules={[{ required: true, message: 'Name is required.' }]}
              />
            </Col>
            <Col span={2} />
          </Row>
        </Form>
      </Modal>
      <div
        id="fileTree"
        style={{ minWidth: '15%', maxWidth: '40%', width: '350px' }}
      >
        <Row
          style={{
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          <Col span={6} offset={6}>
            <Button
              icon={<IconPlusStroked />}
              theme="solid"
              style={{ marginRight: 10 }}
              onClick={() => {
                setModalVisible(true);
              }}
            >
              New
            </Button>
          </Col>
          <Col span={6} offset={6} style={{ textAlign: 'right' }}>
            <Button
              icon={<IconListView />}
              theme="borderless"
              type="tertiary"
            />
          </Col>
        </Row>
        <div
          style={{
            width: '100%',
            height: '1px',
            borderTop: '1px solid #d5d5d5',
          }}
        />
        <List
          className="mind-map-list"
          header={
            <Input
              onCompositionEnd={(v) => onSearch(v)}
              onChange={(v) => (!v ? onSearch(null) : onSearch(v))}
              placeholder="Search"
              prefix={<IconSearch />}
            />
          }
          dataSource={mindList}
          renderItem={(item: MindMapItem, index) => (
            <List.Item
              className={index === focusIndex ? 'mind-map-list-focus-item' : ''}
              onClick={() => {
                setFocusIndex(index);
                try {
                  const { graph } = graphinRef.current;
                  graph.changeData(JSON.parse(item.data));
                  setMindMapObj({ ...item });
                  setMindMapName(
                    item.name.substring(0, item.name.indexOf('.'))
                  );
                } catch (error) {
                  console.error(error, item);
                }
              }}
              header={
                <IconFlowChartStroked
                  style={{ color: '#9C27B0' }}
                  size="large"
                />
              }
              main={
                <div>
                  <span
                    style={{
                      color: 'var(--semi-color-text-0)',
                      fontWeight: 500,
                    }}
                  >
                    {item.name.substring(0, item.name.indexOf('.'))}
                  </span>
                </div>
              }
              extra={
                <Button
                  style={{ display: 'none' }}
                  theme="borderless"
                  type="danger"
                  onClick={() => handleDelete(item.name)}
                  icon={<IconDeleteStroked />}
                />
              }
            />
          )}
        />
      </div>
      <div style={{ flex: 1 }}>
        <Row>
          <Col>
            <Input
              size="large"
              onChange={(value) => {
                setMindMapName(value);
              }}
              onBlur={(e) => {
                window.electron.ipcRenderer.send('mind-map', 'rename', {
                  name: e.target.value,
                  oldname: mindMapObj.name.substring(
                    0,
                    mindMapObj.name.indexOf('.')
                  ),
                });
              }}
              value={mindMapName}
              style={{ backgroundColor: 'white' }}
            />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <div style={{ marginLeft: 10 }}>
              <Space spacing="medium">
                <Tooltip
                  content="Fit Map"
                  clickToHide
                  motion={false}
                  position="bottom"
                >
                  <Button
                    onClick={fitMap}
                    size="large"
                    theme="borderless"
                    type="tertiary"
                    icon={<IconWindowAdaptionStroked />}
                  />
                </Tooltip>
                <Tooltip
                  content="Actual Size"
                  clickToHide
                  motion={false}
                  position="bottom"
                >
                  <Button
                    onClick={actualSize}
                    size="large"
                    theme="borderless"
                    type="tertiary"
                    icon={<IconRealSizeStroked />}
                  />
                </Tooltip>
                <Tooltip
                  content="Export image"
                  clickToHide
                  motion={false}
                  position="bottom"
                >
                  <Button
                    onClick={exportImage}
                    size="large"
                    theme="borderless"
                    type="tertiary"
                    icon={<IconCamera />}
                  />
                </Tooltip>

                <Tooltip
                  content="Theme"
                  clickToHide
                  motion={false}
                  position="bottom"
                >
                  <Dropdown
                    trigger="click"
                    position="bottom"
                    render={
                      <div id="themeCard">
                        <Card style={{ height: 100 }}>
                          <span
                            style={{
                              color: 'black',
                              marginLeft: 5,
                              marginRight: 5,
                            }}
                          >
                            Direction:&nbsp;
                          </span>
                          <Select
                            defaultValue="LR"
                            value={direction}
                            onSelect={(v) => setDirection(v as string)}
                            getPopupContainer={() => {
                              return document.getElementById('themeCard');
                            }}
                          >
                            <Select.Option value="H">H</Select.Option>
                            <Select.Option value="V">V</Select.Option>
                            <Select.Option value="TB">TB</Select.Option>
                            <Select.Option value="LR">LR</Select.Option>
                            <Select.Option value="RL">RL</Select.Option>
                          </Select>
                        </Card>
                      </div>
                    }
                  >
                    <Button
                      size="large"
                      theme="borderless"
                      type="tertiary"
                      icon={<IconFlowChartStroked />}
                    />
                  </Dropdown>
                </Tooltip>

                <Tooltip
                  content="Save"
                  clickToHide
                  motion={false}
                  position="bottom"
                >
                  <Button
                    onClick={saveData}
                    size="large"
                    theme="borderless"
                    type="tertiary"
                    icon={<IconSave />}
                  />
                </Tooltip>
              </Space>
            </div>
          </Col>
        </Row>
        <Divider margin="12px" />
        <Graphin
          data={JSON.parse(mindMapObj.data)}
          ref={graphinRef}
          style={{ marginBottom: 20 }}
          /*   fitView
          fitViewPadding={20} */
          layout={{
            type: 'compactBox',
            direction,
            getVGap: () => {
              return 14;
            },
            getHGap: () => {
              return 50;
            },
            getHeight: () => {
              return 20;
            },
            getWidth: () => {
              return 200;
            },
          }}
          defaultNode={{
            type: 'rect',
            size: 20,
            style: {
              fill: '#fff',
              lineWidth: 2.5,
            },
            labelCfg: {
              position: 'center',
              style: {
                textAlign: 'center',
                fontStyle: 'normal',
              },
            },
          }}
          defaultEdge={{
            type: 'cubic-horizontal',
            style: {
              stroke: 'rgb(79, 79, 79)',
              cursor: 'default',
              lineWidth: 1.5,
            },
            labelCfg: {
              position: 'middle',
              style: {
                textAlign: 'center',
                textBaseline: 'middle',
                fontStyle: 'normal',
              },
            },
          }}
        >
          <ContextMenu style={{ width: '120px', color: 'black' }}>
            <Menu options={options} onChange={handleChange} bindType="node" />
          </ContextMenu>
          <MiniMap style={{ bottom: 90 }} visible />
        </Graphin>
      </div>
    </Split>
  );
}

export default MindMap;
