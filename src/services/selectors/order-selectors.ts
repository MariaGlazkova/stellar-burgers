import { RootState } from '../store';

export const selectOrderData = (state: RootState) => state.order.orderData;
export const selectUserOrders = (state: RootState) => state.order.userOrders;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;
export const selectOrderError = (state: RootState) => state.order.error;
export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
