/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Layout, Nav, Tooltip } from '@douyinfe/semi-ui';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import './App.css';
import {
  IconHome,
  IconFlowChartStroked,
  IconSetting,
  IconKanban,
} from '@douyinfe/semi-icons';
import { useState } from 'react';
import MindMap from './MindMap';
import Kanban from './Kanban';
import Home from './Home';

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

const AppLayout = () => {
  const location = useLocation();
  const { Sider } = Layout;

  const [selectKey, setSelectKey] = useState([location.pathname]);

  const navigate = useNavigate();
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
          defaultSelectedKeys={selectKey}
          mode="vertical"
          isCollapsed
          style={{ maxWidth: 220, height: '100%' }}
          items={[
            {
              itemKey: '/',
              text: '首页',
              icon: <IconHome size="large" />,
              onClick: () => {
                navigate('/');
                setSelectKey(['/']);
              },
            },
            {
              itemKey: '/mindMap',
              text: 'MindMap',
              icon: <IconFlowChartStroked size="large" />,
              onClick: () => {
                navigate('/mindMap');
                setSelectKey(['/mindMap']);
              },
            },
            {
              itemKey: '/kanban',
              text: 'Kanban',
              icon: <IconKanban size="large" />,
              onClick: () => {
                navigate('/kanban');
                setSelectKey(['/kanban']);
              },
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
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="mindMap" element={<MindMap />} />
          <Route path="kanban" element={<Kanban />} />
        </Route>
      </Routes>
    </Router>
  );
}
