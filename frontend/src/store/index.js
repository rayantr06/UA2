import { configureStore } from '@reduxjs/toolkit';
import laboratoriesReducer from '../features/laboratories/laboratoriesSlice';
import equipmentReducer from '../features/equipment/equipmentSlice';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';
import rolesReducer from '../features/roles/rolesSlice';

export const store = configureStore({
  reducer: {
    laboratories: laboratoriesReducer,
    equipment: equipmentReducer,
    auth: authReducer,
    users: usersReducer,
    roles: rolesReducer,
  },
});
