import { rootReducer } from '../root-reducer';
import { initialState as ingredientsInitialState } from '../slices/ingredients-slice';
import { initialState as constructorInitialState } from '../slices/constructor-slice';
import { initialState as orderInitialState } from '../slices/order-slice';
import { initialState as userInitialState } from '../slices/user-slice';
import { initialState as feedInitialState } from '../slices/feed-slice';

describe('rootReducer', () => {
  it('should return correct initial state when called with undefined state and unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, action);

    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      order: orderInitialState,
      user: userInitialState,
      feed: feedInitialState
    });
  });

  it('should handle unknown action without changing state', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    const action = { type: 'ANOTHER_UNKNOWN_ACTION' };
    const newState = rootReducer(initialState, action);

    expect(newState).toEqual(initialState);
  });
});
