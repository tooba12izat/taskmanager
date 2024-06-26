import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import { UserProfile } from '../../types';


interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// Thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk('profile/fetchUserProfile', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.get('https://task-manager.codionslab.com/api/v1/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Thunk for updating user profile
export const updateUserProfile = createAsyncThunk('profile/updateUserProfile', async (profile: Partial<UserProfile>, { rejectWithValue }) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.post('https://task-manager.codionslab.com/api/v1/profile', profile, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
