// features/users/usersSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../types';

interface UsersState {
  users: User[];
  allUsers: User[]; // For storing all users without pagination
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const initialState: UsersState = {
  users: [],
  allUsers: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page: number, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`https://task-manager.codionslab.com/api/v1/admin/user?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data; // Access the nested data array
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for fetching all users
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      const initialResponse = await axios.get('https://task-manager.codionslab.com/api/v1/admin/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const totalPages = initialResponse.data.data.last_page;
      const allUsers = initialResponse.data.data.data;

      const requests = [];
      for (let page = 2; page <= totalPages; page++) {
        requests.push(
          axios.get(`https://task-manager.codionslab.com/api/v1/admin/user?page=${page}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        );
      }
     
      const responses = await Promise.all(requests);
      responses.forEach(response => {
        allUsers.push(...response.data.data.data);
      });
     console.log("all users",allUsers)
      return allUsers;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for creating a user
export const createUser = createAsyncThunk<User, { name: string; email: string; password: string; role: string }, { rejectValue: string }>(
  'users/createUser',
  async (newUser, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post('https://task-manager.codionslab.com/api/v1/admin/user', newUser, {
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

// Thunk for updating a user
export const updateUser = createAsyncThunk<User, { id: number; name: string; email: string; role: string, is_active: number }, { rejectValue: string }>(
  'users/updateUser',
  async ({ id, name, email, role, is_active }, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.put(`https://task-manager.codionslab.com/api/v1/admin/user/${id}`, { name, email, role, is_active }, {
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

// Thunk for deleting a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: number, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`https://task-manager.codionslab.com/api/v1/admin/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.data.data;
        state.loading = false;
        state.totalPages = action.payload.data.last_page;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string ?? 'Error deleting user';
      });
  }
});

export const { setPage } = usersSlice.actions;
export default usersSlice.reducer;
