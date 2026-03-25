import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  items: [],
  currentEquipment: null,
  total: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  submitting: false,
  error: null,
};

const getResponseData = (response) => response.data?.data ?? response.data ?? null;

const getErrorPayload = (error, fallbackMessage) => ({
  message: error.response?.data?.message || error.message || fallbackMessage,
});

export const fetchEquipments = createAsyncThunk(
  'equipment/fetchAll',
  async ({ page = 1, size = 10, search = '' } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/equipment', {
        params: { page, size, search },
      });
      return getResponseData(response) || {};
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to fetch equipment'));
    }
  }
);

export const fetchEquipmentById = createAsyncThunk(
  'equipment/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/equipment/${id}`);
      return getResponseData(response);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to fetch equipment details'));
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
      return {
        message: response.data?.message || 'Equipment created',
      };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to create equipment'));
    }
  }
);

export const updateEquipment = createAsyncThunk(
  'equipment/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/equipment/${id}`, data);
      return {
        id,
        data,
        message: response.data?.message || 'Equipment updated',
      };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to update equipment'));
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
      return {
        id,
        message: response.data?.message || 'Equipment image updated',
      };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to update equipment image'));
    }
  }
);

export const deleteEquipment = createAsyncThunk(
  'equipment/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/equipment/${id}`);
      return {
        id,
        message: response.data?.message || 'Equipment deleted',
      };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to delete equipment'));
    }
  }
);

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEquipment: (state) => {
      state.currentEquipment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEquipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEquipments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.equipments || [];
        state.total = Number(action.payload.total) || 0;
        state.currentPage = Number(action.payload.currentPage) || 1;
        state.totalPages = Number(action.payload.totalPages) || 1;
      })
      .addCase(fetchEquipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch equipment';
      })
      .addCase(fetchEquipmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentEquipment = null;
      })
      .addCase(fetchEquipmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEquipment = action.payload;
      })
      .addCase(fetchEquipmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch equipment details';
      })
      .addCase(addEquipment.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(addEquipment.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(addEquipment.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || 'Failed to create equipment';
      })
      .addCase(updateEquipment.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateEquipment.fulfilled, (state, action) => {
        state.submitting = false;

        if (state.currentEquipment?.id === Number(action.payload.id)) {
          state.currentEquipment = {
            ...state.currentEquipment,
            ...action.payload.data,
          };
        }
      })
      .addCase(updateEquipment.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || 'Failed to update equipment';
      })
      .addCase(updateEquipmentImage.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateEquipmentImage.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateEquipmentImage.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || 'Failed to update equipment image';
      })
      .addCase(deleteEquipment.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteEquipment.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = state.items.filter((item) => item.id !== Number(action.payload.id));
        state.total = Math.max(0, state.total - 1);

        if (state.currentEquipment?.id === Number(action.payload.id)) {
          state.currentEquipment = null;
        }
      })
      .addCase(deleteEquipment.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || 'Failed to delete equipment';
      });
  },
});

export const { clearError, clearCurrentEquipment } = equipmentSlice.actions;
export default equipmentSlice.reducer;
