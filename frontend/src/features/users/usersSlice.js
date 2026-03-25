import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

const getErrorMessage = (error, fallback) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.errors?.[0]?.msg ||
    fallback
  );
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 1, size = 10, search = '' } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users?page=${page}&size=${size}&search=${search}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Impossible de charger les utilisateurs'));
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Impossible de charger l'utilisateur"));
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Impossible de creer l'utilisateur"));
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Impossible de mettre a jour l'utilisateur"));
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Impossible de supprimer l'utilisateur"));
    }
  }
);

export const assignUserRoles = createAsyncThunk(
  'users/assignUserRoles',
  async ({ id, ids }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/${id}/roles`, { ids });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Impossible d'assigner les roles"));
    }
  }
);

export const assignUserSubjects = createAsyncThunk(
  'users/assignUserSubjects',
  async ({ id, ids }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/${id}/subjects`, { ids });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Impossible d'assigner les matieres"));
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    currentUser: null,
    total: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.users || [];
        state.total = action.payload.total || 0;
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignUserRoles.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(assignUserSubjects.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((user) => user.id !== action.payload.id);
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = null;
        }
      });
  },
});

export const { clearUsersError, clearCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;
