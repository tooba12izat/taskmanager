import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Modal, Button, Form, Input, DatePicker } from 'antd';
import { Task } from '../../../types';

interface TaskProps {
    task: Task;
    onClose: () => void;
    onSubmit: (updatedTask: Task) => void;
  }
const EditTaskModal: React.FC<TaskProps> = ({ task, onClose, onSubmit }) => {
    const [form] = Form.useForm();
  
    useEffect(() => {
      form.setFieldsValue({
        name: task.name,
        description: task.description,
        due_date: moment(task.due_date),
      });
    }, [task, form]);
  
    const handleFinish = (values: any) => {
      onSubmit(values);
    };
  
    return (
      <Modal
        title="Edit Task"
        visible={true}
        onCancel={onClose}
        footer={[
          <Button key="back" onClick={onClose}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>Save</Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description!' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="due_date" label="Due Date" rules={[{ required: true, message: 'Please select the due date!' }]}>
            <DatePicker showTime />
          </Form.Item>
        </Form>
      </Modal>
    );
  };
  
  export default EditTaskModal;