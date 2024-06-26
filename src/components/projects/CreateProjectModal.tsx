import React from 'react';
import { Modal, Form, Input, Switch, Button } from 'antd';
import { useDispatch ,useSelector} from 'react-redux';
import { AppDispatch ,RootState} from '../../store';
import { createProject ,fetchProjects} from '../../features/projects/projectsSlice';

interface CreateProjectModalProps {
  visible: boolean;
  onCancel: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ visible, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, currentPage } = useSelector((state: RootState) => state.projects);
  const [form] = Form.useForm();

  const handleFinish = async(values: any) => {
   await dispatch(createProject({
      name: values.name,
      description: values.description,
      is_active: values.is_active ? 1 : 0
    })).then(() => {
      form.resetFields();
      onCancel();
    });
    await dispatch(fetchProjects(currentPage));
  };

  return (
    <Modal
      title="Create Project"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Create
        </Button>
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className='mt-6'>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the project name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the project description!' }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Active" name="is_active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;
