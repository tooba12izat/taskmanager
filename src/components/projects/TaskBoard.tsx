import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import EditTaskModal from './taskComponents/EditTaskModal';
import DeleteTaskModal from './taskComponents/DeleteTaskModal';
import CreateTaskModal from './taskComponents/CreateTaskModal';
import DetailsTaskModal from './taskComponents/DetailsTaskModal';
import AssignUserModal from './taskComponents/AssignUserModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RootState, AppDispatch } from '../../store';
import { fetchTasks, updateTaskStatus, deleteTask, createTask, AssignUser } from '../../features/tasks/tasksSlice';
import { TaskStatus } from '../../enum';
import { Button } from 'antd';
import { Task } from '../../types';

const KanbanBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const tasksFromState = useSelector((state: RootState) => state.tasks.tasks);
  const [tasks, setTasks] = useState(tasksFromState);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const role = localStorage.getItem('userRole');

  useEffect(() => {
    dispatch(fetchTasks(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    setTasks(tasksFromState);
  }, [tasksFromState]);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId == source.droppableId && destination.index == source.index) return;

    const task = tasks.find(task => task.id == draggableId);
    if (task) {
      const updatedTask = { ...task, status: destination.droppableId as TaskStatus };
      const updatedTasks = tasks.map(t => t.id == draggableId ? updatedTask : t);
      setTasks(updatedTasks);
      dispatch(updateTaskStatus({ projectId, updatedTask }));
    }
  };
  
  const handleEditTask = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };
  
  const handleDetailsTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteTask = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };
  
  const handleAssignTask = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsAssignModalOpen(true);
  };

  const handleEditSubmit = async (values: any) => {
    const updatedTask = { ...selectedTask, ...values, due_date: values.due_date.toISOString() };
    await dispatch(updateTaskStatus({ projectId, updatedTask }));
    setIsEditModalOpen(false);
    await dispatch(fetchTasks(projectId))
  };
  
  const handleCreateSubmit = async (values: any) => {
    const newTask = { ...values, projectId, due_date: values.due_date.toISOString() };
    await dispatch(createTask({ projectId, newTask }));
    setIsCreateModalOpen(false);
    await dispatch(fetchTasks(projectId));
  };
  
  const handleAssignSubmit = async (values: any) => {
    if (selectedTask?.id) {
      await dispatch(AssignUser({ projectId, taskId: selectedTask?.id, assignee_id: values.assignedUserId }));
    }
    setIsAssignModalOpen(false);
    await dispatch(fetchTasks(projectId));
  };

  const handleDeleteSubmit = () => {
    if (selectedTask?.id) {
      dispatch(deleteTask({ projectId, taskId: selectedTask?.id }));
    }
    setIsDeleteModalOpen(false);
  };

  const columns = Object.values(TaskStatus).map(status => ({
    id: status,
    title: status.replace("-", " ").toUpperCase(),
    tasks: tasks.filter(task => task.status == status),
  }));

  return (
    <div>
      {role == 'admin' && (
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          className="fixed bottom-10 right-10 z-50"
          size="large"
          onClick={() => { setIsCreateModalOpen(true) }}
        />)}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap justify-center">
          {columns.map(column => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div className="w-full md:w-1/5 p-2" {...provided.droppableProps} ref={provided.innerRef}>
                  <div className="bg-gray-200 p-4 rounded-md shadow-md">
                    <h2 className="text-xl font-bold">{column.title}</h2>
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            className="bg-white p-2 mt-2 rounded-md shadow-sm"
                            onClick={() => { handleDetailsTask(task) }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {role == 'admin' && (
                              <Button 
                                className='bg-green-100 float-right' 
                                onClick={(e) => handleAssignTask(task, e)} 
                              >
                                Assign
                              </Button>)}
                            <h4 className="font-semibold">{task.name}</h4>
                            <p>{task.description}</p>
                            <p className="text-sm text-blue-800">Due date: {moment(task.due_date).format('M/D/YYYY, h:mm A')}</p>
                            {role == 'admin' && (
                              <div className='my-3 gap-2 flex'>
                                <Button 
                                  type="primary" 
                                  onClick={(e) => handleEditTask(task, e)}
                                >
                                  <EditOutlined />
                                </Button>
                                <Button 
                                  type="primary" 
                                  onClick={(e) => handleDeleteTask(task, e)} 
                                  className='bg-red-500'
                                >
                                  <DeleteOutlined className='text-white' />
                                </Button>
                              </div>)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      {isEditModalOpen && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
        />
      )}
      {isDeleteModalOpen && selectedTask && (
        <DeleteTaskModal
          task={selectedTask}
          onClose={() => setIsDeleteModalOpen(false)}
          onSubmit={handleDeleteSubmit}
        />
      )}
      {isCreateModalOpen && (
        <CreateTaskModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSubmit}
        />
      )}
      {isDetailsModalOpen && selectedTask && (
        <DetailsTaskModal
          task={selectedTask}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
      {isAssignModalOpen && selectedTask && (
        <AssignUserModal
          task={selectedTask}
          onClose={() => setIsAssignModalOpen(false)}
          onSubmit={handleAssignSubmit}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
