import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchLaboratories = createAsyncThunk(
  'laboratories/fetchAll',
  async ({ page = 1, size = 10, search = '' } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/laboratories?page=${page}&size=${size}&search=${search}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchLaboratoryById = createAsyncThunk(
  'laboratories/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/laboratories/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addLaboratory = createAsyncThunk(
  'laboratories/add',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/laboratories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateLaboratory = createAsyncThunk(
  'laboratories/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/laboratories/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateLaboratoryImage = createAsyncThunk(
  'laboratories/updateImage',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/laboratories/image/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteLaboratory = createAsyncThunk(
  'laboratories/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/laboratories/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const laboratoriesSlice = createSlice({
  name: 'laboratories',
  initialState: {
    items: [],
    currentLaboratory: null,
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
      // Fetch All
      .addCase(fetchLaboratories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLaboratories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.laboratories;
        state.total = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchLaboratories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch laboratories';
      })
      // Fetch By ID
      .addCase(fetchLaboratoryById.fulfilled, (state, action) => {
        state.currentLaboratory = action.payload;
      })
      // Delete
      .addCase(deleteLaboratory.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      });
  },
});

export const { clearError } = laboratoriesSlice.actions;
export default laboratoriesSlice.reducer;
