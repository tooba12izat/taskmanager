import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, DatePicker } from 'antd';
import { Task } from '../../../types';


interface TaskProps {
    task: Task;
    onClose: () => void;
    onSubmit: (updatedTask: Task) => void;
  }
  const DeleteTaskModal: React.FC<TaskProps> = ({ task, onClose, onSubmit }) => {
    return (
      <Modal
        title="Delete Task"
        visible={true}
        onCancel={onClose}
        footer={[
          <Button key="back" onClick={onClose}>Cancel</Button>,
          <Button key="submit" type="primary" danger onClick={() => onSubmit(task)}>Delete</Button>,
        ]}
      >
        <p>Are you sure you want to delete the task "{task.name}"?</p>
      </Modal>
    );
  };
  
  
  export default DeleteTaskModal;