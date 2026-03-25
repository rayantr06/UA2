import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  items: [],
  currentLaboratory: null,
  relatedEquipment: [],
  total: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  relatedEquipmentLoading: false,
  relatedEquipmentError: null,
  submitting: false,
  error: null,
};

const getResponseData = (response) => response.data?.data ?? response.data ?? null;

const getErrorPayload = (error, fallbackMessage) => ({
  message: error.response?.data?.message || error.message || fallbackMessage,
});

export const fetchLaboratories = createAsyncThunk(
  'laboratories/fetchAll',
  async ({ page = 1, size = 10, search = '' } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/laboratories', {
        params: { page, size, search },
      });
      return getResponseData(response) || {};
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to fetch laboratories'));
    }
  }
);

export const fetchLaboratoryById = createAsyncThunk(
  'laboratories/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/laboratories/${id}`);
      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to fetch laboratory details'));
    }
  }
);

export const fetchLaboratoryEquipments = createAsyncThunk(
  'laboratories/fetchEquipment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/laboratories/${id}/equipment`);
      return getResponseData(response) || [];
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to fetch laboratory equipment'));
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
      return {
        message: response.data?.message || 'Laboratory created',
      };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to create laboratory'));
    }
  }
);

export const updateLaboratory = createAsyncThunk(
  'laboratories/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/laboratories/${id}`, data);
      return {
        id,
        data,
        message: response.data?.message || 'Laboratory updated',
      };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to update laboratory'));
    }
  }
);

export const updateLaboratoryImage = createAsyncThunk(
  'laboratories/updateImage',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/laboratories/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return {
        id,
        message: response.data?.message || 'Laboratory image updated',
      };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to update laboratory image'));
    }
  }
);

export const deleteLaboratory = createAsyncThunk(
  'laboratories/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/laboratories/${id}`);
      return {
        id,
        message: response.data?.message || 'Laboratory deleted',
      };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to delete laboratory'));
    }
  }
);

const laboratoriesSlice = createSlice({
  name: 'laboratories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.relatedEquipmentError = null;
    },
    clearCurrentLaboratory: (state) => {
      state.currentLaboratory = null;
      state.relatedEquipment = [];
      state.relatedEquipmentError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaboratories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaboratories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.laboratories || [];
        state.total = Number(action.payload.total) || 0;
        state.currentPage = Number(action.payload.currentPage) || 1;
        state.totalPages = Number(action.payload.totalPages) || 1;
      })
      .addCase(fetchLaboratories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch laboratories';
      })
      .addCase(fetchLaboratoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentLaboratory = null;
      })
      .addCase(fetchLaboratoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLaboratory = action.payload;
      })
      .addCase(fetchLaboratoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch laboratory details';
      })
      .addCase(fetchLaboratoryEquipments.pending, (state) => {
        state.relatedEquipmentLoading = true;
        state.relatedEquipmentError = null;
        state.relatedEquipment = [];
      })
      .addCase(fetchLaboratoryEquipments.fulfilled, (state, action) => {
        state.relatedEquipmentLoading = false;
        state.relatedEquipment = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchLaboratoryEquipments.rejected, (state, action) => {
        state.relatedEquipmentLoading = false;
        state.relatedEquipmentError =
          action.payload?.message || 'Failed to fetch laboratory equipment';
      })
      .addCase(addLaboratory.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(addLaboratory.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(addLaboratory.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || 'Failed to create laboratory';
      })
      .addCase(updateLaboratory.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateLaboratory.fulfilled, (state, action) => {
        state.submitting = false;

        if (state.currentLaboratory?.id === Number(action.payload.id)) {
          state.currentLaboratory = {
            ...state.currentLaboratory,
            ...action.payload.data,
          };
        }
      })
      .addCase(updateLaboratory.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || 'Failed to update laboratory';
      })
      .addCase(updateLaboratoryImage.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateLaboratoryImage.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateLaboratoryImage.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || 'Failed to update laboratory image';
      })
      .addCase(deleteLaboratory.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteLaboratory.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = state.items.filter((item) => item.id !== Number(action.payload.id));
        state.total = Math.max(0, state.total - 1);

        if (state.currentLaboratory?.id === Number(action.payload.id)) {
          state.currentLaboratory = null;
          state.relatedEquipment = [];
        }
      })
      .addCase(deleteLaboratory.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || 'Failed to delete laboratory';
      });
  },
});

export const { clearError, clearCurrentLaboratory } = laboratoriesSlice.actions;
export default laboratoriesSlice.reducer;
