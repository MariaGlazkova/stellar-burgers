import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';

export interface UserState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      if (response.success) {
        localStorage.setItem('refreshToken', response.refreshToken);
        setCookie('accessToken', response.accessToken);
        return response.user;
      }
      return rejectWithValue('Ошибка регистрации');
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message || 'Ошибка регистрации'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      if (response.success) {
        localStorage.setItem('refreshToken', response.refreshToken);
        setCookie('accessToken', response.accessToken);
        return response.user;
      }
      return rejectWithValue('Ошибка входа');
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message || 'Ошибка входа'
      );
    }
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (response.success) {
        return response.user;
      }
      return rejectWithValue('Ошибка загрузки пользователя');
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message ||
          'Ошибка загрузки пользователя'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      if (response.success) {
        return response.user;
      }
      return rejectWithValue('Ошибка обновления пользователя');
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message ||
          'Ошибка обновления пользователя'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    }
    return true;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка входа';
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state) => {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Ошибка обновления пользователя';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        logoutUser.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          state.user = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка выхода';
      });
  }
});

export const { clearError } = userSlice.actions;

export default userSlice.reducer;
