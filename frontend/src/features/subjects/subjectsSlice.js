import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchSubjects = createAsyncThunk(
  'subjects/fetchAll',
  async ({ page = 1, size = 10, search = '' } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subjects?page=${page}&size=${size}&search=${search}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchSubjectById = createAsyncThunk(
  'subjects/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subjects/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const addSubject = createAsyncThunk(
  'subjects/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/subjects', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateSubject = createAsyncThunk(
  'subjects/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/subjects/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteSubject = createAsyncThunk(
  'subjects/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/subjects/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState: {
    items: [],
    currentSubject: null,
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
    clearCurrentSubject: (state) => {
      state.currentSubject = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.subjects;
        state.total = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch subjects';
      })
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.currentSubject = action.payload;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      });
  },
});

export const { clearError, clearCurrentSubject } = subjectsSlice.actions;
export default subjectsSlice.reducer;
