/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useLayoutEffect, useState } from 'react';
import Graphin, { GraphinContext, Utils } from '@antv/graphin';
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
} from '@douyinfe/semi-ui';
import {
  IconCamera,
  IconDeleteStroked,
  IconFlowChartStroked,
  IconPlusStroked,
  IconRealSizeStroked,
  IconWindowAdaptionStroked,
} from '@douyinfe/semi-icons';
import { ContextMenu, MiniMap } from '@antv/graphin-components';
import { Util } from '@antv/g6-core';

const { Menu } = ContextMenu;

const rawData = {
  label: '我来亲自测试一下文字，看看超出是什么样子的',
  id: '0',
  style: { fill: 'red' },
  size: [
    Util.getTextSize('我来亲自测试一下文字，看看超出是什么样子的', 14)[0] + 24,
    20,
  ],
  children: [
    {
      label: 'Classification',
      id: '0-1',
      color: '#5AD8A6',
      size: [Util.getTextSize('Classification', 14)[0] + 24, 1],
      labelCfg: {
        position: 'top',
      },
      children: [
        {
          label: 'Logistic regression',
          id: '0-1-1',
        },
        {
          label: 'Linear discriminant analysis',
          id: '0-1-2',
        },
        {
          label: 'Rules',
          id: '0-1-3',
        },
        {
          label: 'Decision trees',
          id: '0-1-4',
        },
        {
          label: 'Naive Bayes',
          id: '0-1-5',
        },
        {
          label: 'K nearest neighbor',
          id: '0-1-6',
        },
        {
          label: 'Probabilistic neural network',
          id: '0-1-7',
        },
        {
          label: 'Support vector machine',
          id: '0-1-8',
        },
      ],
    },
    {
      label: 'Consensus',
      id: '0-2',
      color: '#F6BD16',
      children: [
        {
          label: 'Models diversity',
          id: '0-2-1',
          children: [
            {
              label: 'Different initializations',
              id: '0-2-1-1',
            },
            {
              label: 'Different parameter choices',
              id: '0-2-1-2',
            },
            {
              label: 'Different architectures',
              id: '0-2-1-3',
            },
            {
              label: 'Different modeling methods',
              id: '0-2-1-4',
            },
            {
              label: 'Different training sets',
              id: '0-2-1-5',
            },
            {
              label: 'Different feature sets',
              id: '0-2-1-6',
            },
          ],
        },
        {
          label: 'Methods',
          id: '0-2-2',
          children: [
            {
              label: 'Classifier selection',
              id: '0-2-2-1',
            },
            {
              label: 'Classifier fusion',
              id: '0-2-2-2',
            },
          ],
        },
        {
          label: 'Common',
          id: '0-2-3',
          children: [
            {
              label: 'Bagging',
              id: '0-2-3-1',
            },
            {
              label: 'Boosting',
              id: '0-2-3-2',
            },
            {
              label: 'AdaBoost',
              id: '0-2-3-3',
            },
          ],
        },
      ],
    },
    {
      label: 'Regression',
      id: '0-3',
      color: '#269A99',
      children: [
        {
          label: 'Multiple linear regression',
          id: '0-3-1',
        },
        {
          label: 'Partial least squares',
          id: '0-3-2',
        },
        {
          label: 'Multi-layer feedforward neural network',
          id: '0-3-3',
        },
        {
          label: 'General regression neural network',
          id: '0-3-4',
        },
        {
          label: 'Support vector regression',
          id: '0-3-5',
        },
      ],
    },
  ],
};

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
const removeNodeByParentId = (newData: any, parentId: string, id: string) => {
  if (parentId === newData.id) {
    newData.children = newData.children.filter((e: any) => e.id !== id);
    return;
  }
  if (newData.children) {
    newData.children.forEach((element: any) => {
      removeNodeByParentId(element, parentId, id);
    });
  }
};

function MindMap() {
  const graphinRef = React.createRef();

  const [direction, setDirection] = useState<string>('LR');
  const [data, setData] = useState(rawData);

  const reloadGraphin = () => {
    window.location.reload();
  };
  const deleteNode = (id: string) => {
    if (id === '0') {
      Notification.warning({
        title: 'Delete failed',
        position: 'top',
        content: 'The root node cannot be deleted',
        duration: 3,
      });
      return;
    }
    const parentId = id.substring(0, id.lastIndexOf('-'));
    const newData = JSON.parse(JSON.stringify(data));
    removeNodeByParentId(newData, parentId, id);
    setData(newData);
    graphinRef.current.graph.refresh();
  };

  const handleChange = (menuItem: any, menuData: any) => {
    if (menuItem.key === 'delete') {
      deleteNode(menuData.id);
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

  useLayoutEffect(() => {
    // 监听
    window.addEventListener('resize', reloadGraphin);
    // 销毁
    return () => window.removeEventListener('resize', () => {});
  }, []);

  return (
    <>
      <Row>
        <Col>
          <Input
            size="large"
            value="Untitled.mind"
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
            </Space>
          </div>
        </Col>
      </Row>
      <Divider margin="12px" />
      <Graphin
        data={data}
        ref={graphinRef}
        style={{ marginBottom: 20 }}
        fitView
        fitCenter
        fitViewPadding={20}
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
        <MiniMap style={{ bottom: 65 }} visible />
      </Graphin>
    </>
  );
}

export default MindMap;
