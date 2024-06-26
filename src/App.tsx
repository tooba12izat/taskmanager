import React from 'react';
import { Provider } from 'react-redux';
import {store} from './store';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import Dashboard from './components/dashboard/Dashboard';
import ProjectNav from './components/projects/ProjectNav';
import Settings from './components/settings/Settings';
import Users from './components/users/Users';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => (
  <Router>
    <Provider store={store}>
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="projects/*" element={<ProjectNav />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users" element={<PrivateRoute roles={['admin']} element={<Users />} />} />
      </Route>
    </Routes>
    </Provider>
  </Router>
);

export default App;
