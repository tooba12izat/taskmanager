import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { Modal, Form, Input, Button, List, message } from 'antd';
import { fetchComments, deleteComment, updateComment, addComment } from '../../../features/comments/commentsSlice';

interface CommentsProps {
  task: number;
}

const Comments: React.FC<CommentsProps> = ({ task }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { projectId } = useParams<{ projectId: string }>();
  const comments = useSelector((state: RootState) => state.comments.comments);
  const loading = useSelector((state: RootState) => state.comments.loading);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');

  useEffect(() => {
    dispatch(fetchComments({ project: projectId, task }));
  }, [dispatch, task, projectId]);

  const handleAddComment = (values: { parent_id: number; content: string }) => {
    dispatch(addComment({ project: projectId, task, parentId: values.parent_id, content: values.content }))
      .then(() => {
        message.success('Comment added successfully');
        // Additional logic after adding comment
      })
      .catch(err => {
        message.error(`Failed to add comment: ${err}`);
      });
  };

  const handleUpdateComment = (commentId: number) => {
    dispatch(updateComment({ project: projectId, task, commentId, content: editingContent }))
      .then(() => {
        message.success('Comment updated successfully');
        setEditingCommentId(null); // Exit edit mode
        setEditingContent('');
        // Additional logic after updating comment
      })
      .catch(err => {
        message.error(`Failed to update comment: ${err}`);
      });
  };

  const handleDeleteComment = (commentId: number) => {
    dispatch(deleteComment({ project: projectId, task, commentId }))
      .then(() => {
        message.success('Comment deleted successfully');
        // Additional logic after deleting comment
      })
      .catch(err => {
        message.error(`Failed to delete comment: ${err}`);
      });
  };

  const handleEditClick = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  return (
    <div>
      {/* Add comment form */}
      <Form onFinish={handleAddComment} layout="vertical">
        <Form.Item name="parent_id" initialValue={0} hidden>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="content" label="Comment" rules={[{ required: true, message: 'Please enter a comment' }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Comment
          </Button>
        </Form.Item>
      </Form>

      {/* List of comments */}
      <List
        itemLayout="vertical"
        dataSource={comments}
        renderItem={comment => (
          <List.Item
            key={comment.id}
            actions={
              editingCommentId === comment.id
                ? [
                    <Button key={`save-${comment.id}`} onClick={() => handleUpdateComment(comment.id)} type="primary">
                      Save
                    </Button>,
                    <Button key={`cancel-${comment.id}`} onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  ]
                : [
                    <Button key={`edit-${comment.id}`} onClick={() => handleEditClick(comment.id, comment.content)}>
                      Edit
                    </Button>,
                    <Button key={`delete-${comment.id}`} onClick={() => handleDeleteComment(comment.id)} danger>
                      Delete
                    </Button>
                  ]
            }
          >
            {editingCommentId === comment.id ? (
              <Input.TextArea
                value={editingContent}
                onChange={e => setEditingContent(e.target.value)}
                rows={2}
              />
            ) : (
              <List.Item.Meta title={`User ${comment.id}`} description={comment.content} />
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default Comments;
