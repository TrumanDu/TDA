import { Button, Col, Row, Tree } from '@douyinfe/semi-ui';
import Split from '@uiw/react-split';
import { useEffect, useState } from 'react';
import {
  IconPlusStroked,
  IconListView,
  IconFile,
  IconFolder,
} from '@douyinfe/semi-icons';

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
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    window.electron.ipcRenderer.loadTreeData();
    window.electron.ipcRenderer.on('list-tree-file', (data) => {
      setTreeData(buildTreeData(data));
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
      <div style={{ flex: 1 }}> </div>
    </Split>
  );
};

export default Home;
