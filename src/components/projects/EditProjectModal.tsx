import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select ,Switch} from 'antd';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateProject } from '../../features/projects/projectsSlice';
import { Project } from '../../types';

const { Option } = Select;

interface EditProjectModalProps {
  visible: boolean;
  onCancel: () => void;
  project: Project | null;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ visible, onCancel, project }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
        is_active: project.is_active== 1 ? true:false,
      });
    }
  }, [project, form]);

  const onFinish = (values: { name: string; description: string; is_active: string }) => {
    if (project) {
      const updatedProject = {
        ...project,
        name: values.name,
        description: values.description,
        is_active: values.is_active ? 1 : 0,
      };
      dispatch(updateProject(updatedProject))
        onCancel();
        form.resetFields();
      
    }
  };

  return (
    <Modal
      title="Edit Project"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the project name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the description!' }]}>
        <Input.TextArea />
        </Form.Item>
        {/* <Form.Item label="Status" name="is_active" rules={[{ required: true, message: 'Please select a status!' }]}>
          <Select>
            <Option value="1">Active</Option>
            <Option value="0">Inactive</Option>
          </Select>
        </Form.Item> */}
        <Form.Item label="Active" name="is_active" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProjectModal;
