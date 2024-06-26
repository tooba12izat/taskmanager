import React from 'react';
import LogoutButton from './LogoutButton';
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';
import ProfileSettings from './ProfileSettings';

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        const token = localStorage.getItem('authToken');
        console.log("token", token)

        if (!token) {
            // Handle case where token is missing (possibly already logged out)
            console.log('No authToken found in localStorage');
            return;
        }
        try {
            // Send a POST request to the logout endpoint with the token
            const response = await axios.post(
                'https://task-manager.codionslab.com/api/v1/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("response", response)
            localStorage.removeItem('authToken');
            navigate('/signin');
            console.log('Logged out successfully');
        } catch (error) {
            // Handle errors from the API or network issues
            console.error('Error logging out:', error);
        }
    };
    return (
        <div>
            <ProfileSettings/>
            <LogoutButton onLogout={handleLogout} />
        </div>
    );
};

export default Settings;
