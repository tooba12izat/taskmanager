import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Project, ProjectUser } from '../../types';


interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  assignedUsers: boolean;
}

const initialState: ProjectsState = {
  projects: [],
  assignedUsers: true,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

//get all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (page: number, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    try {
      if (role == 'admin') {
        const response = await axios.get(`https://task-manager.codionslab.com/api/v1/admin/project?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      }
      else {
        const response = await axios.get(`https://task-manager.codionslab.com/api/v1/project?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      }

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // If the error is an Axios error and has a response, we can extract the message
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

//create a new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (project: { name: string; description: string; is_active: number }, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post('https://task-manager.codionslab.com/api/v1/admin/project', project, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data; // Adjust according to actual API response structure
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);
//updating the project
export const updateProject = createAsyncThunk<Project, { id: number, name: string; description: string; is_active: number }>(
  'projects/updateProject',
  async ({ name, description, is_active, id }, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.put(`https://task-manager.codionslab.com/api/v1/admin/project/${id}`, { name, description, is_active }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
//deleting a project
export const deleteProject = createAsyncThunk('projects/deleteProject', async (userId: number, { rejectWithValue }) => {
  const token = localStorage.getItem('authToken');
  try {
    await axios.delete(`https://task-manager.codionslab.com/api/v1/admin/project/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return userId;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});
//update user assignment
export const updateProjectUsers = createAsyncThunk(
  'projects/updateProjectUsers',
  async ({ projectId, users }: { projectId: number; users: number[] }) => {
    const token = localStorage.getItem('authToken');
    console.log("info", projectId, users)
    const response = await axios.post(`https://task-manager.codionslab.com/api
/v1/admin/project/${projectId}/assign`, { user_ids: users }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    setAssignedUsers(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.data.data;
        state.totalPages = action.payload.data.last_page;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<number>) => {
        state.projects = state.projects.filter(project => project.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.payload as string ?? 'Error deleting Project';
      })
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        // Update the specific project in the state
        const updatedProject = action.payload;
        state.projects = state.projects.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        );
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'Error updating project';
      })
      .addCase(updateProjectUsers.fulfilled, (state, action: PayloadAction<Project>) => {
        state.assignedUsers = !state.assignedUsers;
      });
  },
});

export const { setPage } = projectsSlice.actions;
export default projectsSlice.reducer;
