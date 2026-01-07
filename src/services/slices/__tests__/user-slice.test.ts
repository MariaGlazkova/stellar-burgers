import userReducer, {
  registerUser,
  loginUser,
  fetchUser,
  updateUser,
  logoutUser,
  clearError,
  UserState
} from '../user-slice';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { setCookie, deleteCookie } from '../../../utils/cookie';

jest.mock('@api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

const mockRegisterUserApi = registerUserApi as jest.MockedFunction<
  typeof registerUserApi
>;
const mockLoginUserApi = loginUserApi as jest.MockedFunction<
  typeof loginUserApi
>;
const mockGetUserApi = getUserApi as jest.MockedFunction<typeof getUserApi>;
const mockUpdateUserApi = updateUserApi as jest.MockedFunction<
  typeof updateUserApi
>;
const mockLogoutApi = logoutApi as jest.MockedFunction<typeof logoutApi>;
const mockSetCookie = setCookie as jest.MockedFunction<typeof setCookie>;
const mockDeleteCookie = deleteCookie as jest.MockedFunction<
  typeof deleteCookie
>;

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
  writable: true
});

describe('userSlice', () => {
  const initialState: UserState = {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.getItem.mockReturnValue(null);
  });

  it('should return initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('clearError', () => {
    it('should clear error', () => {
      const state: UserState = {
        ...initialState,
        error: 'Some error'
      };
      const action = clearError();
      const result = userReducer(state, action);
      expect(result.error).toBeNull();
    });
  });

  describe('registerUser', () => {
    it('should handle pending state', () => {
      const action = { type: registerUser.pending.type };
      const result = userReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle fulfilled state and save tokens', () => {
      const response = {
        success: true,
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      };
      mockRegisterUserApi.mockResolvedValue(response as any);
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const result = userReducer(initialState, action);
      expect(result.user).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Registration failed';
      const action = {
        type: registerUser.rejected.type,
        payload: errorMessage
      };
      const result = userReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.isAuthenticated).toBe(false);
    });

    it('should handle rejected state without error message', () => {
      const action = {
        type: registerUser.rejected.type,
        payload: undefined
      };
      const result = userReducer(initialState, action);
      expect(result.error).toBe('Ошибка регистрации');
    });
  });

  describe('loginUser', () => {
    it('should handle pending state', () => {
      const action = { type: loginUser.pending.type };
      const result = userReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle fulfilled state and save tokens', () => {
      const response = {
        success: true,
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      };
      mockLoginUserApi.mockResolvedValue(response as any);
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const result = userReducer(initialState, action);
      expect(result.user).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Login failed';
      const action = {
        type: loginUser.rejected.type,
        payload: errorMessage
      };
      const result = userReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.isAuthenticated).toBe(false);
    });

    it('should handle rejected state without error message', () => {
      const action = {
        type: loginUser.rejected.type,
        payload: undefined
      };
      const result = userReducer(initialState, action);
      expect(result.error).toBe('Ошибка входа');
    });
  });

  describe('fetchUser', () => {
    it('should handle pending state', () => {
      const action = { type: fetchUser.pending.type };
      const result = userReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const response = {
        success: true,
        user: mockUser
      };
      mockGetUserApi.mockResolvedValue(response as any);
      const action = {
        type: fetchUser.fulfilled.type,
        payload: mockUser
      };
      const result = userReducer(initialState, action);
      expect(result.user).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle rejected state and clear tokens', () => {
      const action = {
        type: fetchUser.rejected.type
      };
      const result = userReducer(initialState, action);
      expect(mockStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(mockDeleteCookie).toHaveBeenCalledWith('accessToken');
      expect(result.isLoading).toBe(false);
      expect(result.isAuthenticated).toBe(false);
      expect(result.user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should handle pending state', () => {
      const action = { type: updateUser.pending.type };
      const result = userReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const updatedUser: TUser = {
        email: 'updated@example.com',
        name: 'Updated User'
      };
      const response = {
        success: true,
        user: updatedUser
      };
      mockUpdateUserApi.mockResolvedValue(response as any);
      const state: UserState = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const result = userReducer(state, action);
      expect(result.user).toEqual(updatedUser);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Update failed';
      const action = {
        type: updateUser.rejected.type,
        payload: errorMessage
      };
      const result = userReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorMessage);
    });

    it('should handle rejected state without error message', () => {
      const action = {
        type: updateUser.rejected.type,
        payload: undefined
      };
      const result = userReducer(initialState, action);
      expect(result.error).toBe('Ошибка обновления пользователя');
    });
  });

  describe('logoutUser', () => {
    it('should handle pending state', () => {
      const action = { type: logoutUser.pending.type };
      const result = userReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      mockLogoutApi.mockResolvedValue({ success: true } as any);
      const state: UserState = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };
      const action = {
        type: logoutUser.fulfilled.type,
        payload: true
      };
      const result = userReducer(state, action);
      expect(result.user).toBeNull();
      expect(result.isAuthenticated).toBe(false);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Logout failed';
      const action = {
        type: logoutUser.rejected.type,
        payload: errorMessage
      };
      const result = userReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorMessage);
    });

    it('should handle rejected state without error message', () => {
      const action = {
        type: logoutUser.rejected.type,
        payload: undefined
      };
      const result = userReducer(initialState, action);
      expect(result.error).toBe('Ошибка выхода');
    });
  });
});
