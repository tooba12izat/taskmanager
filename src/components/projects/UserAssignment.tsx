import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { CloseOutlined } from '@ant-design/icons';
import { fetchUsers, fetchAllUsers } from '../../features/users/usersSlice';
import { updateProjectUsers } from '../../features/projects/projectsSlice';
import { Button, Checkbox, List, Modal, Input } from 'antd';
import { ProjectUser } from '../../types';

interface UserAssignmentProps {
  projectId: number;
  visible: boolean;
  onCancel: () => void;
}

const UserAssignment: React.FC<UserAssignmentProps> = ({ projectId, visible, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { allUsers, loading, error } = useSelector((state: RootState) => state.users);
  const project = useSelector((state: RootState) => state.projects.projects.find(proj => proj.id === projectId));
  const assignedUsers = project ? project.users : [];
  const [selectedUsers, setSelectedUsers] = useState<ProjectUser[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<ProjectUser[]>([]);

  useEffect(() => {
    if (!allUsers.length && !loading) {
        dispatch(fetchAllUsers());
      }
  }, [allUsers,loading]);

  useEffect(() => {
    setSelectedUsers(assignedUsers);
  }, [assignedUsers]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, allUsers]);

  const handleOk = () => {
    const selectedUserIds = selectedUsers.map(user => user.id);
    dispatch(updateProjectUsers({ projectId, users: selectedUserIds }));
    onCancel();
  };

  const handleToggleUser = (user: ProjectUser) => {
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <div>
      <Modal
        title="Manage User Assignment"
        visible={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText="Update"
        cancelText="Cancel"
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="update" type="primary" onClick={handleOk}>
            Update
          </Button>,
        ]}
      >
        <div className="mb-4 max-h-[250px] overflow-y-auto">
          <h3 className="text-sm font-medium py-3">Assigned Users</h3>
          <List
            dataSource={selectedUsers}
            renderItem={user => (
              <List.Item actions={[<div onClick={() => handleToggleUser(user)}><CloseOutlined /></div>]}>
                {user.name} - {user.email}
              </List.Item>
            )}
          />
        </div>
        <div>
          <h3 className="text-sm font-medium py-3">All Users</h3>
          <Input.Search
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="max-h-[250px] overflow-y-auto">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <List
                dataSource={filteredUsers}
                renderItem={user => (
                  <List.Item
                    actions={[
                      <Checkbox
                        checked={selectedUsers.some(u => u.id === user.id)}
                        onChange={() => handleToggleUser(user)}
                      />
                    ]}
                  >
                    {user.name} - {user.email}
                  </List.Item>
                )}
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserAssignment;
