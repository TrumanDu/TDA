/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Layout,
  Nav,
  Tree,
  Tooltip,
  Row,
  Col,
} from '@douyinfe/semi-ui';
import Split from '@uiw/react-split';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import {
  IconHome,
  IconFlowChartStroked,
  IconLive,
  IconSetting,
  IconPlusStroked,
  IconListView,
  IconFile,
  IconFolder,
} from '@douyinfe/semi-icons';
import TreeNode from '@douyinfe/semi-ui/lib/es/tree/treeNode';
import { useEffect, useState } from 'react';
import MindMap from './MindMap';

const setting = (
  <Tooltip content="系统设置" position="right" key="setting">
    <Button
      icon={<IconSetting />}
      theme="borderless"
      type="tertiary"
      size="large"
    />
  </Tooltip>
);

const showContextmenu = (event: any, node: TreeNode) => {
  event.preventDefault();
  if (node) {
    console.log(node);
  } else {
    window.electron.ipcRenderer.showContextMenu('empty');
  }
};

const buildTreeData = (oldData: any[]): any[] => {
  const treeData: any[] = [];
  if (oldData.length === 0) {
    return treeData;
  }
  oldData.forEach((item) => {
    if (item.isDir) {
      treeData.push({
        icon: <IconFolder style={{ color: 'var(--semi-color-text-2)' }} />,
        children: buildTreeData(item.children),
        key: item.key,
        label: item.label,
        value: item.value,
      });
    } else {
      treeData.push({
        icon: <IconFile style={{ color: 'var(--semi-color-text-2)' }} />,
        key: item.key,
        label: item.label,
        value: item.value,
      });
    }
  });

  return treeData;
};

const Home = () => {
  const { Sider } = Layout;
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    window.electron.ipcRenderer.loadTreeData();
    window.electron.ipcRenderer.on('list-tree-file', (data) => {
      setTreeData(buildTreeData(data));
    });
  }, []);
  return (
    <Layout
      style={{
        /*  border: '1px solid var(--semi-color-border)', */
        marginLeft: '-8px',
        marginBottom: '10px',
        /* background:
          'linear-gradient(200.96deg, #fedc2a -29.09%,#dd5789 51.77%,#7a2c9e 129.35%)', */
      }}
    >
      <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
        <Nav
          defaultSelectedKeys={['Home']}
          mode="vertical"
          isCollapsed
          style={{ maxWidth: 220, height: '100%' }}
          items={[
            { itemKey: 'Home', text: '首页', icon: <IconHome size="large" /> },
            {
              itemKey: 'Histogram',
              text: 'MindMap',
              icon: <IconFlowChartStroked size="large" />,
            },
            {
              itemKey: 'Live',
              text: '测试功能',
              icon: <IconLive size="large" />,
            },
          ]}
          header={{
            logo: (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img src="//lf1-cdn-tos.bytescm.com/obj/ttfe/ies/semi/webcast_logo.svg" />
            ),
            text: 'TrumanDu Assistant',
          }}
          footer={{
            children: [setting],
            collapseButton: false,
          }}
        />
      </Sider>
      <Layout style={{ height: '100vh', overflowY: 'hidden' }}>
        <div>
          <Split
            lineBar
            style={{
              height: '97vh',
              border: '1px solid #d5d5d5',
              borderRadius: 3,
            }}
          >
            <div id="fileTree" style={{ minWidth: '10%', maxWidth: '40%' }}>
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
              <Tree
                onContextMenu={showContextmenu}
                treeData={treeData}
                filterTreeNode
                showFilteredOnly
              />
              <div
                onContextMenu={showContextmenu}
                style={{ height: '100%', width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <MindMap />
            </div>
          </Split>
        </div>
      </Layout>
    </Layout>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
