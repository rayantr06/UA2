import { configureStore } from '@reduxjs/toolkit';
import laboratoriesReducer from '../features/laboratories/laboratoriesSlice';
import equipmentReducer from '../features/equipment/equipmentSlice';

export const store = configureStore({
  reducer: {
    laboratories: laboratoriesReducer,
    equipment: equipmentReducer,
  },
});
