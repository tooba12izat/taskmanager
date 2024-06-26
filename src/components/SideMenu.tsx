import React from 'react';
import { Layout, Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  UserOutlined,
  SettingOutlined,
  ProjectOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const SideMenu: React.FC = () => {
  const { profile, loading } = useSelector((state: RootState) => state.profile);
  return (
    <Sider className="min-h-screen" width={200} style={{ background: '#fff' }}>
      <div className="logo p-4 text-center">
        <h2 className="text-xl font-bold">Task Manager</h2>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['section1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="projects" icon={<ProjectOutlined />}>
          <Link to="/dashboard/projects">Projects</Link>
        </Menu.Item>
        {profile?.role == 'admin' &&
          <Menu.Item key="users" icon={<UserOutlined />}>
            <Link to="/dashboard/users">users</Link>
          </Menu.Item>}
        <Menu.Item key="settings" icon={<SettingOutlined />}>
          <Link to="/dashboard/settings">Settings</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SideMenu;
