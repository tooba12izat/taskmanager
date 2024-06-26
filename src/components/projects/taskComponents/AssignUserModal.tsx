import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { fetchAllUsers } from '../../../features/users/usersSlice';
import { Button, Form, Modal, Select } from 'antd';
import { Task } from '../../../types';
import { CloseOutlined } from '@ant-design/icons';

interface UserAssignmentProps {
    task: Task;
    onClose: () => void;
    onSubmit: (task: Task) => void;
}

const AssignUserModal: React.FC<UserAssignmentProps> = ({ task, onClose, onSubmit }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { allUsers, loading, error } = useSelector((state: RootState) => state.users);

    const [form] = Form.useForm();

    useEffect(() => {
        if (!allUsers.length && !loading) {
            dispatch(fetchAllUsers());
        }
    }, [allUsers, loading, dispatch]);

    // Set initial value when task.assignee_id is not null
    useEffect(() => {
        if (task.assignee_id !== null) {
            form.setFieldsValue({
                assignedUserId: task.assignee_id
            });
        }
    }, [task.assignee_id, form]);

    const handleFinish = (values: any) => {
        onSubmit(values);
    };

    return (
        <div>
            <Modal
                title="Manage User Assignment"
                visible={true}
                onCancel={onClose}
                okText="Update"
                cancelText="Cancel"
                footer={[
                    <Button key="cancel" onClick={onClose}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>Save</Button>,
                ]}
            >
                <Form form={form} onFinish={handleFinish} layout="vertical">
                    <Form.Item name="assignedUserId" label="Assign User" rules={[{ required: true, message: 'Please select a user' }]}>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <Select placeholder="Select a user">
                                {allUsers.map(user => (
                                    <Select.Option key={user.id} value={user.id}>
                                        {user.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AssignUserModal;
