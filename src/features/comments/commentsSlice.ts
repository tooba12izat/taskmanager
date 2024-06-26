import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Comment } from '../../types';

interface CommentsState {
    comments: Comment[];
    loading: boolean;
    error: string | null;
}

const initialState: CommentsState = {
    comments: [],
    loading: false,
    error: null,
};

// Fetch comments thunk
export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async ({ project, task }: { project: string | undefined; task: number }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`https://task-manager.codionslab.com/api/v1/project/${project}/task/${task}/comment`,{
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
            return response.data.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

// Add comment thunk
export const addComment = createAsyncThunk(
    'comments/addComment',
    async ({ project, task, parentId, content }: { project: string | undefined; task: number; parentId: number; content: string }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`https://task-manager.codionslab.com/api/v1/project/${project}/task/${task}/comment`, {  content },{
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              console.log("comment",response.data.data)
            return response.data.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

// Update comment thunk
export const updateComment = createAsyncThunk(
    'comments/updateComment',
    async ({ project, task, commentId, content }: { project: string | undefined; task: number; commentId: number; content: string }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(`https://task-manager.codionslab.com/api/v1/project/${project}/task/${task}/comment/${commentId}`, { content },{
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
            return response.data.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

// Delete comment thunk
export const deleteComment = createAsyncThunk(
    'comments/deleteComment',
    async ({ project, task, commentId }: { project: string | undefined; task: number; commentId: number }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`https://task-manager.codionslab.com/api/v1/project/${project}/task/${task}/comment/${commentId}`,{
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
            return commentId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchComments.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
                state.loading = false;
                state.comments = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addComment.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addComment.fulfilled, (state, action: PayloadAction<Comment>) => {
                state.loading = false;
                state.comments.push(action.payload);
            })
            .addCase(addComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateComment.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateComment.fulfilled, (state, action: PayloadAction<Comment>) => {
                state.loading = false;
                const updatedIndex = state.comments.findIndex(comment => comment.id === action.payload.id);
                if (updatedIndex !== -1) {
                    state.comments[updatedIndex] = action.payload;
                }
            })
            .addCase(updateComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteComment.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteComment.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.comments = state.comments.filter(comment => comment.id !== action.payload);
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default commentsSlice.reducer;
