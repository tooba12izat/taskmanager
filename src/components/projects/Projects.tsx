import React, { useState } from 'react';
import ProjectsTable from './ProjectsTable';
import CreateProjectModal from './CreateProjectModal';
import { Button } from 'antd';


const Projects: React.FC = () => {
  const role = localStorage.getItem('userRole');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        {role == 'admin' && (
          <Button type="primary" onClick={showModal}>
            Create Project
          </Button>
        )}
        
      </div>
      <ProjectsTable />
      <CreateProjectModal visible={isModalVisible} onCancel={handleCancel} />
    </div>
  );
};

export default Projects;
