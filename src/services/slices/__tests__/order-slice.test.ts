import orderReducer, {
  createOrder,
  fetchOrderByNumber,
  fetchUserOrders,
  clearOrder,
  OrderState
} from '../order-slice';
import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrderByNumberApi, getOrdersApi } from '@api';

jest.mock('@api', () => ({
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
  getOrdersApi: jest.fn()
}));

const mockOrderBurgerApi = orderBurgerApi as jest.MockedFunction<
  typeof orderBurgerApi
>;
const mockGetOrderByNumberApi = getOrderByNumberApi as jest.MockedFunction<
  typeof getOrderByNumberApi
>;
const mockGetOrdersApi = getOrdersApi as jest.MockedFunction<
  typeof getOrdersApi
>;

const mockOrder: TOrder = {
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

describe('orderSlice', () => {
  const initialState: OrderState = {
    orderData: null,
    userOrders: [],
    isLoading: false,
    error: null,
    orderRequest: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('clearOrder', () => {
    it('should clear orderData and error', () => {
      const state: OrderState = {
        orderData: mockOrder,
        userOrders: [],
        isLoading: false,
        error: 'Some error',
        orderRequest: false
      };
      const action = clearOrder();
      const result = orderReducer(state, action);
      expect(result.orderData).toBeNull();
      expect(result.error).toBeNull();
      expect(result.userOrders).toEqual([]);
    });
  });

  describe('createOrder', () => {
    it('should handle pending state', () => {
      const action = { type: createOrder.pending.type };
      const result = orderReducer(initialState, action);
      expect(result.orderRequest).toBe(true);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const result = orderReducer(initialState, action);
      expect(result.orderData).toEqual(mockOrder);
      expect(result.userOrders).toHaveLength(1);
      expect(result.userOrders[0]).toEqual(mockOrder);
      expect(result.orderRequest).toBe(false);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should add new order to beginning of userOrders array', () => {
      const state: OrderState = {
        ...initialState,
        userOrders: [mockOrder2]
      };
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const result = orderReducer(state, action);
      expect(result.userOrders).toHaveLength(2);
      expect(result.userOrders[0]).toEqual(mockOrder);
      expect(result.userOrders[1]).toEqual(mockOrder2);
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Failed to create order';
      const action = {
        type: createOrder.rejected.type,
        payload: errorMessage
      };
      const result = orderReducer(initialState, action);
      expect(result.orderRequest).toBe(false);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorMessage);
    });

    it('should handle rejected state without error message', () => {
      const action = {
        type: createOrder.rejected.type,
        payload: undefined
      };
      const result = orderReducer(initialState, action);
      expect(result.error).toBe('Ошибка создания заказа');
    });
  });

  describe('fetchOrderByNumber', () => {
    it('should handle pending state', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const result = orderReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const result = orderReducer(initialState, action);
      expect(result.orderData).toEqual(mockOrder);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Order not found';
      const action = {
        type: fetchOrderByNumber.rejected.type,
        payload: errorMessage
      };
      const result = orderReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorMessage);
    });

    it('should handle rejected state without error message', () => {
      const action = {
        type: fetchOrderByNumber.rejected.type,
        payload: undefined
      };
      const result = orderReducer(initialState, action);
      expect(result.error).toBe('Ошибка загрузки заказа');
    });
  });

  describe('fetchUserOrders', () => {
    it('should handle pending state', () => {
      const action = { type: fetchUserOrders.pending.type };
      const result = orderReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const orders = [mockOrder, mockOrder2];
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: orders
      };
      const result = orderReducer(initialState, action);
      expect(result.userOrders).toEqual(orders);
      expect(result.userOrders).toHaveLength(2);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should replace existing userOrders', () => {
      const state: OrderState = {
        ...initialState,
        userOrders: [mockOrder]
      };
      const newOrders = [mockOrder2];
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: newOrders
      };
      const result = orderReducer(state, action);
      expect(result.userOrders).toEqual(newOrders);
      expect(result.userOrders).toHaveLength(1);
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Failed to fetch orders';
      const action = {
        type: fetchUserOrders.rejected.type,
        payload: errorMessage
      };
      const result = orderReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorMessage);
    });

    it('should handle rejected state without error message', () => {
      const action = {
        type: fetchUserOrders.rejected.type,
        payload: undefined
      };
      const result = orderReducer(initialState, action);
      expect(result.error).toBe('Ошибка загрузки заказов');
    });
  });
});
