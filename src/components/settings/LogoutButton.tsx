import React from 'react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

interface LogoutButtonProps {
  onLogout: () => void; // Callback function to handle logout logic
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const handleLogout = () => {
    // Call the onLogout function passed as props
    onLogout();
  };
  
  return (
    <Button
      type="primary"
      danger
      icon={<LogoutOutlined />}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
