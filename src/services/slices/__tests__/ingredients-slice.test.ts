import ingredientsReducer, {
  fetchIngredients,
  IngredientsState
} from '../ingredients-slice';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

const mockGetIngredientsApi = getIngredientsApi as jest.MockedFunction<
  typeof getIngredientsApi
>;

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

describe('ingredientsSlice', () => {
  const initialState: IngredientsState = {
    items: [],
    isLoading: false,
    error: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('fetchIngredients', () => {
    it('should handle pending state', () => {
      const action = { type: fetchIngredients.pending.type };
      const result = ingredientsReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.items).toEqual([]);
    });

    it('should handle fulfilled state', async () => {
      mockGetIngredientsApi.mockResolvedValue(mockIngredients);
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const result = ingredientsReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.items).toEqual(mockIngredients);
      expect(result.items).toHaveLength(2);
    });

    it('should handle rejected state with error message', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchIngredients.rejected.type,
        payload: errorMessage
      };
      const result = ingredientsReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.items).toEqual([]);
    });

    it('should handle rejected state without error message', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        payload: undefined
      };
      const result = ingredientsReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Ошибка загрузки ингредиентов');
      expect(result.items).toEqual([]);
    });

    it('should clear error on pending', () => {
      const stateWithError: IngredientsState = {
        items: [],
        isLoading: false,
        error: 'Previous error'
      };
      const action = { type: fetchIngredients.pending.type };
      const result = ingredientsReducer(stateWithError, action);
      expect(result.error).toBeNull();
      expect(result.isLoading).toBe(true);
    });
  });
});
