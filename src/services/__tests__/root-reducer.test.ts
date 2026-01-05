import { rootReducer } from '../root-reducer';

describe('rootReducer', () => {
  it('should return correct initial state when called with undefined state and unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, action);

    expect(state).toEqual({
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderData: null,
        userOrders: [],
        isLoading: false,
        error: null,
        orderRequest: false
      },
      user: {
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      }
    });
  });

  it('should handle unknown action without changing state', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    const action = { type: 'ANOTHER_UNKNOWN_ACTION' };
    const newState = rootReducer(initialState, action);

    expect(newState).toEqual(initialState);
  });
});
