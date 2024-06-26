import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Modal, Button, Form, Input, DatePicker ,Select} from 'antd';
import { Task } from '../../../types';
import { TaskStatus } from '../../../enum';

interface TaskProps {

    onClose: () => void;
    onSubmit: (task: Task) => void;
}
const { Option } = Select; 
const CreateTaskModal: React.FC<TaskProps> = ({  onClose, onSubmit }) => {
    const [form] = Form.useForm();

    const handleFinish = (values: any) => {
        onSubmit(values);
    };

    return (
        <Modal
            title="Create Task"
            visible={true}
            onCancel={onClose}
            footer={null}
        >
            <Form onFinish={handleFinish} layout="vertical">
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the task name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter the task description' }]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="due_date" label="Due Date" rules={[{ required: true, message: 'Please select the due date' }]}>
                    <DatePicker showTime />
                </Form.Item>
                <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select the task status' }]}>
                    <Select>
                        {Object.values(TaskStatus).map(status => (
                            <Option key={status} value={status}>{status.replace("-", " ").toUpperCase()}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Create</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateTaskModal;