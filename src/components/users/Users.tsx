import React, { useState, useEffect } from 'react';
import { RootState, AppDispatch } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers,setPage} from '../../features/users/usersSlice';
import UsersTable from './UsersTable';
import CreateUserModal from './CreateUserModal';
import { Button } from 'antd';

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading: usersLoading, error: usersError, currentPage } = useSelector((state: RootState) => state.users);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userCreated, setUserCreated] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers(currentPage));
  }, [dispatch, userCreated, currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUserCreated = () => {
    setUserCreated(prevState => !prevState); // toggle to trigger useEffect
    handleCancel();
  };
  const handleUserEdited = () => {
    setUserCreated(prevState => !prevState); // toggle to trigger useEffect
  };

  if (usersLoading) return <div>Loading...</div>;
  if (usersError) return <div>Error: {usersError}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={showModal}>
          Create User
        </Button>
      </div>
      <UsersTable users={users} onUserEdited={handleUserEdited} onPageChanged={handlePageChange} />
      <CreateUserModal visible={isModalVisible} onCancel={handleCancel} onUserCreated={handleUserCreated} />
    </div>
  );
};

export default Users;
