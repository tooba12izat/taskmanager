import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Projects from './Projects';
import TaskBoard from './TaskBoard';
const ProjectNav: React.FC = () => {


    return (

        <Routes>
            <Route path="/" element={<Projects />} />
            <Route path=":projectId" element={<TaskBoard />} />
        </Routes>

    );
};

export default ProjectNav;
