import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

const STORAGE_KEY = 'edumanager_auth';

const getSavedAuth = () => {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }

  const savedAuth = localStorage.getItem(STORAGE_KEY);

  if (!savedAuth) {
    return { user: null, token: null };
  }

  try {
    return JSON.parse(savedAuth);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return { user: null, token: null };
  }
};

const cleanUser = (user) => {
  if (!user) {
    return null;
  }

  const { mot_de_passe, ...safeUser } = user;
  return safeUser;
};

const saveAuth = (data) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!data?.token) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('token');
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  localStorage.setItem('token', data.token);
};

const storedAuth = getSavedAuth();

const getErrorMessage = (error) => {
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors[0].msg;
  }

  return error.response?.data?.message || 'Impossible de se connecter';
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', credentials);
      const authData = {
        user: cleanUser(response.data.data),
        token: response.data.token,
      };

      saveAuth(authData);
      return authData;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: cleanUser(storedAuth.user),
    token: storedAuth.token,
    isAuthenticated: Boolean(storedAuth.token),
    isLoading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      saveAuth(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Impossible de se connecter';
      });
  },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
