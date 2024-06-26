import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { createUser } from '../../features/users/usersSlice';
import { AppDispatch } from '../../store';

const { Option } = Select;

interface CreateUserModalProps {
  visible: boolean;
  onCancel: () => void;
  onUserCreated: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ visible, onCancel, onUserCreated }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const onFinish = async (values: { name: string; email: string; password: string; role: string }) => {
    await dispatch(createUser(values));
    onUserCreated();
    form.resetFields();
  };

  return (
    <Modal title="Create User" visible={visible} onCancel={onCancel} footer={null}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input the email!' }]}>
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input the password!' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select a role!' }]}>
          <Select>
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
