import { configureStore, combineReducers,ThunkAction,Action } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import profileReducer from './features/userProfile/userProfileSlice';
import usersReducer from './features/users/usersSlice'
import projectReducer from './features/projects/projectsSlice'
import tasksReducer from './features/tasks/tasksSlice'
import commentsReducer from './features/comments/commentsSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  projects: projectReducer,
  users:usersReducer,
  tasks:tasksReducer,
  comments:commentsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;