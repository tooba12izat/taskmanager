import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, DatePicker } from 'antd';
import { Task } from '../../../types';
import moment from 'moment';
import Comments from './Comments';
import { RootState, AppDispatch } from '../../../store';
import { fetchTaskDetails } from '../../../features/tasks/tasksSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
interface TaskProps {
  task: Task;
  onClose: () => void;
}
const DetailsTaskModal: React.FC<TaskProps> = ({ task, onClose }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const taskfromState = useSelector((state: RootState) => state.tasks.task);
  useEffect(() => {
    dispatch(fetchTaskDetails({ projectId, taskId: task.id }));
  }, [dispatch, projectId]);

  return (
    <Modal
      title={task.name}
      width={800}
      visible={true}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>Cancel</Button>,
      ]}
    >
      <h4 className='font-semibold mt-2'>Description</h4>
      <p className='mt-2'>{taskfromState.description}</p>
      <p className='font-semibold mt-2'>Due date: {moment(task.due_date).format('M/D/YYYY, h:mm A')}</p>
      <p className='font-semibold mt-2 mb-3'>Created date: {moment(task.created_at).format('M/D/YYYY, h:mm A')}</p>
      <Comments task={task.id}/>
    </Modal>
  );
};


export default DetailsTaskModal;