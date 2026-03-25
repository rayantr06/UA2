import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchEquipments = createAsyncThunk(
  'equipment/fetchAll',
  async ({ page = 1, size = 10, search = '' } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/equipment?page=${page}&size=${size}&search=${search}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchEquipmentById = createAsyncThunk(
  'equipment/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/equipment/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addEquipment = createAsyncThunk(
  'equipment/add',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/equipment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEquipment = createAsyncThunk(
  'equipment/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/equipment/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEquipmentImage = createAsyncThunk(
  'equipment/updateImage',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/equipment/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEquipment = createAsyncThunk(
  'equipment/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/equipment/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState: {
    items: [],
    currentEquipment: null,
    total: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEquipments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEquipments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.equipments;
        state.total = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchEquipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch equipment';
      })
      .addCase(fetchEquipmentById.fulfilled, (state, action) => {
        state.currentEquipment = action.payload;
      })
      .addCase(deleteEquipment.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      });
  },
});

export const { clearError } = equipmentSlice.actions;
export default equipmentSlice.reducer;
