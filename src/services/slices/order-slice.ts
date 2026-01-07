import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrderByNumberApi, getOrdersApi } from '@api';

export interface OrderState {
  orderData: TOrder | null;
  userOrders: TOrder[];
  isLoading: boolean;
  error: string | null;
  orderRequest: boolean;
}

export const initialState: OrderState = {
  orderData: null,
  userOrders: [],
  isLoading: false,
  error: null,
  orderRequest: false
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredients);
      return data.order;
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message || 'Ошибка создания заказа'
      );
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      if (response.success && response.orders && response.orders.length > 0) {
        return response.orders[0];
      }
      return rejectWithValue('Заказ не найден');
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message || 'Ошибка загрузки заказа'
      );
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue(
        (error as { message?: string }).message || 'Ошибка загрузки заказов'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderData = action.payload;
          state.userOrders = [action.payload, ...state.userOrders];
          state.orderRequest = false;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка создания заказа';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderData = action.payload;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки заказа';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.userOrders = action.payload;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка загрузки заказов';
      });
  }
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
