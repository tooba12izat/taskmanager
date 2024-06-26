import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    console.log("login form submitted", values);
    try {
      const response = await axios.post('https://task-manager.codionslab.com/api/v1/login', values);
      const { token, user } = response.data.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id);
      dispatch(login(user));
      message.success(response.data.message || 'Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
        message.error(`Login failed: ${error.response.data.message}`);
      } else {
        message.error('Login failed: An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Sign in
            </Button>
          </Form.Item>

          <div className="text-center">
            <span className="mr-2">Don't have an account?</span>
            <Link to="/signup" className="text-blue-500 hover:text-blue-700">
              Sign up
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
