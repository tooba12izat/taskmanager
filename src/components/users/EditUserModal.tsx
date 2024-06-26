import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../features/users/usersSlice';
import { AppDispatch } from '../../store';
import { User } from '../../types';

const { Option } = Select;

interface EditUserModalProps {
    visible: boolean;
    onCancel: () => void;
    onUserEdited: () => void;
    user: User | null; // User data to edit
}

const EditUserModal: React.FC<EditUserModalProps> = ({ visible, onCancel, user, onUserEdited }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [form] = Form.useForm();

    // Set initialValues when user prop changes
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                role: user.role,
                is_active: user.is_active.toString(),
            });
        }
    }, [user, form]);

    console.log("user", user)

    const onFinish = async (values: Partial<User>) => {
        if (user) {
            const updatedUser: Partial<User> = {
                id: user.id,
                ...values,
            };

            await dispatch(updateUser(updatedUser as { id: number; name: string; email: string; role: string; is_active: number }));
            onCancel();
            onUserEdited();
            form.resetFields();
        }
    };

    return (
        <Modal title="Edit User" visible={visible} onCancel={onCancel} footer={null} destroyOnClose>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input the email!' }]}>
                    <Input type="email" />
                </Form.Item>
                <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select a role!' }]}>
                    <Select>
                        <Option value="user">User</Option>
                        <Option value="admin">Admin</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Status" name="is_active" rules={[{ required: true, message: 'Please select a status!' }]}>
                    <Select>
                        <Option value="1">Active</Option>
                        <Option value="0">Inactive</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditUserModal;
