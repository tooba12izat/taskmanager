import React, { useState } from 'react';
import { Table, Space, Tag, Button, Modal, Pagination } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteUser } from '../../features/users/usersSlice';
import { AppDispatch, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../../types';
import EditUserModal from './EditUserModal';


const { Column } = Table;
const { confirm } = Modal;

interface UsersTableProps {
  users: User[];
  onUserEdited: () => void;
  onPageChanged: (page: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onUserEdited, onPageChanged }) => {
  const { totalPages, currentPage } = useSelector((state: RootState) => state.users);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const handleCancel = () => {
    setEditModalVisible(false);
    setSelectedUser(null);
  };

  const handleDelete = (userId: number) => {
    confirm({
      title: 'Are you sure delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone',
      onOk() {
        dispatch(deleteUser(userId))
      },
    });
  };

  return (
    <>
      <Table dataSource={users} pagination={false} >
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Role" dataIndex="role" key="role" />
        <Column
          title="Status"
          dataIndex="is_active"
          key="status"
          render={(status: string) => (
            <Tag color={status == '1' ? 'green' : 'red'}>{status == '1' ? 'Active' : 'Inactive'}</Tag>
          )}
        />
        <Column title="Created At" dataIndex="created_at" key="createdAt" />
        <Column
          title="Actions"
          key="actions"
          render={(text, record: User) => (
            <Space size="middle">
              <Button type="primary" onClick={() => handleEdit(record)}><EditOutlined /></Button>
              <Button type="default" className='bg-red-500' onClick={() => handleDelete(record.id)}><DeleteOutlined className='text-white' /></Button>
            </Space>
          )}
        />
      </Table>
      <Pagination
        current={currentPage}
        total={totalPages * 10}
        pageSize={10}
        onChange={onPageChanged}
        showSizeChanger={false}
        className='mt-4'
      />
      <EditUserModal visible={editModalVisible} onCancel={handleCancel} user={selectedUser} onUserEdited={onUserEdited} />
    </>
  );
};

export default UsersTable;


