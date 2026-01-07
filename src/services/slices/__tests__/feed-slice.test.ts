import feedReducer, { fetchFeeds, FeedState } from '../feed-slice';
import { TOrder, TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

const mockGetFeedsApi = getFeedsApi as jest.MockedFunction<typeof getFeedsApi>;

const mockOrder1: TOrder = {
  _id: 'order-id-1',
  status: 'done',
  name: 'Space бургер',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['ingredient-id-1', 'ingredient-id-2']
};

const mockOrder2: TOrder = {
  _id: 'order-id-2',
  status: 'pending',
  name: 'Another бургер',
  createdAt: '2024-01-02T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z',
  number: 12346,
  ingredients: ['ingredient-id-3']
};

const mockFeedsData: TOrdersData = {
  orders: [mockOrder1, mockOrder2],
  total: 100,
  totalToday: 10
};

describe('feedSlice', () => {
  const initialState: FeedState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchFeeds', () => {
    it('should handle pending state', () => {
      const action = { type: fetchFeeds.pending.type };
      const result = feedReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.orders).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalToday).toBe(0);
    });

    it('should handle fulfilled state', () => {
      const response = { success: true, ...mockFeedsData };
      mockGetFeedsApi.mockResolvedValue(response as any);
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeedsData
      };
      const result = feedReducer(initialState, action);
      expect(result.orders).toEqual(mockFeedsData.orders);
      expect(result.orders).toHaveLength(2);
      expect(result.total).toBe(100);
      expect(result.totalToday).toBe(10);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should replace existing orders on fulfilled', () => {
      const state: FeedState = {
        orders: [mockOrder1],
        total: 50,
        totalToday: 5,
        isLoading: false,
        error: null
      };
      const newFeedsData: TOrdersData = {
        orders: [mockOrder2],
        total: 200,
        totalToday: 20
      };
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: newFeedsData
      };
      const result = feedReducer(state, action);
      expect(result.orders).toEqual(newFeedsData.orders);
      expect(result.orders).toHaveLength(1);
      expect(result.total).toBe(200);
      expect(result.totalToday).toBe(20);
    });

    it('should handle rejected state with error message', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchFeeds.rejected.type,
        payload: errorMessage
      };
      const result = feedReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.orders).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalToday).toBe(0);
    });

    it('should handle rejected state without error message', () => {
      const action = {
        type: fetchFeeds.rejected.type,
        payload: undefined
      };
      const result = feedReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Ошибка загрузки ленты заказов');
    });

    it('should clear error on pending', () => {
      const stateWithError: FeedState = {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: 'Previous error'
      };
      const action = { type: fetchFeeds.pending.type };
      const result = feedReducer(stateWithError, action);
      expect(result.error).toBeNull();
      expect(result.isLoading).toBe(true);
    });
  });
});
