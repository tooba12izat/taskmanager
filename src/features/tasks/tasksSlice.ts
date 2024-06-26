import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Task, UpdateTaskPayload } from '../../types';
import { TaskStatus } from '../../enum';


interface TasksState {
  tasks: Task[];
  task: Task;
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  task: {
    id: 0,
    parent_id: 0,
    project_id: 0,
    assignee_id: 0,
    name: '',
    description: '',
    due_date: '',
    status: TaskStatus.TODO,
    created_at: '',
    updated_at: ''
  },
  loading: false,
  error: null,
};

//get all tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (projectId: string | undefined, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`https://task-manager.codionslab.com/api/v1/project/${projectId}/task`, {
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

//update task status
export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ projectId, updatedTask }: { projectId: string | undefined; updatedTask: Task }, { rejectWithValue }) => {
    const { id, name, description, due_date, status } = updatedTask
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`https://task-manager.codionslab.com/api/v1/project/${projectId}/task/${id}`, {
        status, name, description, due_date
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

//create task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async ({ projectId, newTask }: { projectId: string | undefined; newTask: Task }, { rejectWithValue }) => {
    const { name, description, due_date, status } = newTask;
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`https://task-manager.codionslab.com/api/v1/project/${projectId}/task`, {
        status, name, description, due_date
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

//delete a task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async ({ taskId, projectId }: { taskId: number, projectId: string | undefined }, { rejectWithValue }) => {
  const token = localStorage.getItem('authToken');
  try {
    await axios.delete(`https://task-manager.codionslab.com/api
/v1/project/${projectId}/task/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return taskId;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

//get task details
export const fetchTaskDetails = createAsyncThunk(
  'tasks/fetchTaskDetails',
  async ({ projectId, taskId }: { projectId: string | undefined, taskId: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`https://task-manager.codionslab.com/api/v1/project/${projectId}/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("details",response.data.data)
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

//Assign a user
export const AssignUser = createAsyncThunk('tasks/assignUser', async ({ taskId, projectId, assignee_id }: { taskId: number, projectId: string | undefined, assignee_id: number }, { rejectWithValue }) => {
  const token = localStorage.getItem('authToken');
  try {
   const response= await axios.post(`https://task-manager.codionslab.com/api
/v1/project/${projectId}/task/${taskId}/assign`,{assignee_id} ,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return taskId;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTaskDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.task = action.payload;
      })
      .addCase(fetchTaskDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        const existingTaskIndex = state.tasks.findIndex(task => task.id === updatedTask.id);
        if (existingTaskIndex !== -1) {
          state.tasks[existingTaskIndex] = updatedTask;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload as string ?? 'Error deleting Task';
      });
  },

});


export default tasksSlice.reducer;
