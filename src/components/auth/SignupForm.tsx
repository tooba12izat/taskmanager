import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: SignupFormValues) => {
    setLoading(true);
    console.log("signup form submitted", values);
    try {
      const response = await axios.post('https://task-manager.codionslab.com/api/v1/register', values);
      message.success(response.data.message || 'Signup successful! Please login.');
      navigate('/signin'); // Navigate to the login page after successful signup
    } catch (error: any) {
      console.error('Signup failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
        message.error(`Signup failed: ${error.response.data.message}`);
      } else {
        message.error('Signup failed: An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
        <Form
          name="signup-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please input your name!' },
            ]}
          >
            <Input size="large" />
          </Form.Item>

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
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters.' }
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Sign up
            </Button>
          </Form.Item>

          <div className="text-center">
            Already have an account? <Link to="/signin" className="text-blue-500 hover:text-blue-700">Sign in</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;
