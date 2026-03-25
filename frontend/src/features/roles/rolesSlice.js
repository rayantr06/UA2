import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

const getErrorMessage = (error) => {
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors[0].msg;
  }

  return error.response?.data?.message || 'Une erreur est survenue';
};

export const fetchRoles = createAsyncThunk(
  'roles/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/roles');
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchRoleById = createAsyncThunk(
  'roles/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/roles/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchRoleUsers = createAsyncThunk(
  'roles/fetchUsers',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/roles/${id}/users`);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const addRole = createAsyncThunk(
  'roles/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/roles', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteRole = createAsyncThunk(
  'roles/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/roles/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    items: [],
    currentRole: null,
    currentUsers: [],
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearRolesError: (state) => {
      state.error = null;
    },
    clearCurrentRole: (state) => {
      state.currentRole = null;
      state.currentUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRoleUsers.fulfilled, (state, action) => {
        state.currentUsers = action.payload;
      })
      .addCase(fetchRoleUsers.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addRole.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.submitting = false;
        if (action.payload?.data) {
          state.items.unshift(action.payload.data);
        }
      })
      .addCase(addRole.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      });
  },
});

export const { clearRolesError, clearCurrentRole } = rolesSlice.actions;
export default rolesSlice.reducer;
