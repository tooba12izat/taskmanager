import React, { useState, useEffect } from 'react';
import { Table, Space, Tag, Button, Skeleton, Avatar, Modal, Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { RootState, AppDispatch } from '../../store';
import { fetchProjects, deleteProject, setPage } from '../../features/projects/projectsSlice';
import { Project, ProjectUser } from '../../types';
import EditProjectModal from './EditProjectModal';
import person from '../../assets/images/person.svg';
import UserAssignment from './UserAssignment';
import { Link } from 'react-router-dom';

const { Column } = Table;
const { confirm } = Modal;

const ProjectsTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const role = localStorage.getItem('userRole');
  const { projects, loading, error, currentPage, totalPages,assignedUsers } = useSelector((state: RootState) => state.projects);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProjectIdForUserAssignment, setSelectedProjectIdForUserAssignment] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProjectIdForUserAssignment(null);
  };

  useEffect(() => {
    dispatch(fetchProjects(currentPage));
  }, [dispatch, currentPage,assignedUsers]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setEditModalVisible(true);
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setSelectedProject(null);
  };

  const handleDelete = (projectId: number) => {
    confirm({
      title: 'Are you sure delete this Project?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone',
      onOk() {
        dispatch(deleteProject(projectId));
      },
    });
  };

  const renderUsers = (users: ProjectUser[]) => {
    const maxDisplay = 2;
    const extraCount = users?.length - maxDisplay;

    return (
      <Avatar.Group>
        {users?.slice(0, maxDisplay).map(user => (
          <Avatar key={user?.id} src={person} />
        ))}
        {extraCount > 0 && (
          <Avatar className='bg-gray-500'>
            +{extraCount}
          </Avatar>
        )}
      </Avatar.Group>
    );
  };

  const handleUserAssignment = (projectId: number) => {
    setSelectedProjectIdForUserAssignment(projectId);
    showModal();
  };


  if (loading) return <Skeleton active />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Table dataSource={projects} pagination={false} rowKey="id">
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column
          title="Users"
          dataIndex="users"
          key="users"
          render={(users: ProjectUser[]) => renderUsers(users)}
        />
        <Column
          title="Status"
          dataIndex="is_active"
          key="status"
          render={(status: string) => (
            <Tag color={status == '1' ? 'green' : 'red'}>{status == '1' ? 'Active' : 'Inactive'}</Tag>
          )}
        />
        <Column
          title="Created At"
          dataIndex="created_at"
          key="created_at"
          render={(created_at: string) => moment(created_at).format('M/D/YYYY, h:mm A')}
        />
        <Column
          title="Actions"
          key="actions"
          render={(text, record: Project) => (
            <Space size="middle">
              <Link to={`/dashboard/projects/${record.id}`}> <Button type="primary" className='bg-yellow-300'><UnorderedListOutlined /></Button></Link>
              {role == 'admin' && (
                <>
              <Button type="primary" onClick={() => handleEdit(record)}><EditOutlined /></Button>
              <Button type="primary" className='bg-gray-500' onClick={() => handleUserAssignment(record.id)}><UserOutlined /></Button>
              <Button type="primary" className='bg-red-500' onClick={() => handleDelete(record.id)}><DeleteOutlined className='text-white' /></Button>
              </>
              )}
            </Space>
          )}
        />
      </Table>
      <Pagination
        current={currentPage}
        total={totalPages * 10}
        pageSize={10}
        onChange={handlePageChange}
        showSizeChanger={false}
        className='mt-4'
      />
      <EditProjectModal visible={editModalVisible} onCancel={handleCancelEdit} project={selectedProject} />
      {selectedProjectIdForUserAssignment && (
        <UserAssignment projectId={selectedProjectIdForUserAssignment} visible={isModalVisible} onCancel={handleCancel} />
      )}
    </>
  );
};

export default ProjectsTable;
