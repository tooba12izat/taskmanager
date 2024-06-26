import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Skeleton } from 'antd';
import { RootState, AppDispatch } from '../../store';
import { fetchUserProfile, updateUserProfile } from '../../features/userProfile/userProfileSlice';

const ProfileSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector((state: RootState) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue(profile);
    }
  }, [profile, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.setFieldsValue(profile); // Reset form to original profile data
  };

  const handleSave = (values: any) => {
    dispatch(updateUserProfile(values)).then(() => {
      setIsEditing(false);
    });
  };

  if (loading) return <Skeleton active />;

  return (
    <div className='mb-7'>
      <h1 className="text-xl font-bold mb-4">Profile Settings</h1>
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
          <Input disabled={!isEditing} className='w-72' />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input type="email" disabled={!isEditing} className='w-72' />
        </Form.Item>
        <Form.Item label="Role" name="role">
          <Input disabled className='w-72' />
        </Form.Item>
        <Form.Item label="Status" name="is_active">
          <Input disabled className='w-72'/>
        </Form.Item>
        {isEditing ? (
          <div className="flex space-x-2">
            <Button type="primary" htmlType="submit" className='px-9'>
              Save
            </Button>
            <Button onClick={handleCancel} className='px-9'>Cancel</Button>
          </div>
        ) : (
          <Button type="primary" onClick={handleEdit} className='px-9'>
            Edit
          </Button>
        )}
      </Form>
    </div>
  );
};

export default ProfileSettings;
