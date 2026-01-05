import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorItems,
  ConstructorState
} from '../constructor-slice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const mockBun: TIngredient = {
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
};

const mockIngredient: TIngredient = {
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
};

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 14,
  carbohydrates: 22,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

describe('constructorSlice', () => {
  const initialState: ConstructorState = {
    bun: null,
    ingredients: []
  };

  it('should return initial state', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('addBun', () => {
    it('should add bun to state', () => {
      const action = addBun(mockBun);
      const result = constructorReducer(initialState, action);
      expect(result.bun).toEqual(mockBun);
      expect(result.ingredients).toEqual([]);
    });

    it('should replace existing bun', () => {
      const stateWithBun = { ...initialState, bun: mockBun };
      const newBun: TIngredient = {
        ...mockBun,
        _id: 'new-bun-id',
        name: 'Новая булка'
      };
      const action = addBun(newBun);
      const result = constructorReducer(stateWithBun, action);
      expect(result.bun).toEqual(newBun);
      expect(result.bun?._id).toBe('new-bun-id');
    });
  });

  describe('addIngredient', () => {
    it('should add ingredient with generated id', () => {
      const action = addIngredient(mockIngredient);
      const result = constructorReducer(initialState, action);
      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]._id).toBe(mockIngredient._id);
      expect(result.ingredients[0].name).toBe(mockIngredient.name);
      expect(result.ingredients[0].id).toBeDefined();
      expect(typeof result.ingredients[0].id).toBe('string');
    });

    it('should add multiple ingredients', () => {
      let state = initialState;
      const action1 = addIngredient(mockIngredient);
      state = constructorReducer(state, action1);
      const action2 = addIngredient(mockSauce);
      state = constructorReducer(state, action2);
      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]._id).toBe(mockIngredient._id);
      expect(state.ingredients[1]._id).toBe(mockSauce._id);
      expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient by id', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-1'
      };
      const ingredient2: TConstructorIngredient = {
        ...mockSauce,
        id: 'id-2'
      };
      const state = {
        ...initialState,
        ingredients: [ingredient1, ingredient2]
      };
      const action = removeIngredient('id-1');
      const result = constructorReducer(state, action);
      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0].id).toBe('id-2');
    });

    it('should not remove ingredient if id does not exist', () => {
      const ingredient: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-1'
      };
      const state = {
        ...initialState,
        ingredients: [ingredient]
      };
      const action = removeIngredient('non-existent-id');
      const result = constructorReducer(state, action);
      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0].id).toBe('id-1');
    });
  });

  describe('moveIngredient', () => {
    it('should move ingredient from one position to another', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-1'
      };
      const ingredient2: TConstructorIngredient = {
        ...mockSauce,
        id: 'id-2'
      };
      const ingredient3: TConstructorIngredient = {
        ...mockIngredient,
        _id: 'third-id',
        id: 'id-3'
      };
      const state = {
        ...initialState,
        ingredients: [ingredient1, ingredient2, ingredient3]
      };
      const action = moveIngredient({ dragIndex: 0, hoverIndex: 2 });
      const result = constructorReducer(state, action);
      expect(result.ingredients).toHaveLength(3);
      expect(result.ingredients[0].id).toBe('id-2');
      expect(result.ingredients[1].id).toBe('id-3');
      expect(result.ingredients[2].id).toBe('id-1');
    });

    it('should move ingredient backwards', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-1'
      };
      const ingredient2: TConstructorIngredient = {
        ...mockSauce,
        id: 'id-2'
      };
      const state = {
        ...initialState,
        ingredients: [ingredient1, ingredient2]
      };
      const action = moveIngredient({ dragIndex: 1, hoverIndex: 0 });
      const result = constructorReducer(state, action);
      expect(result.ingredients[0].id).toBe('id-2');
      expect(result.ingredients[1].id).toBe('id-1');
    });

    it('should not move ingredient if dragIndex is invalid', () => {
      const ingredient: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-1'
      };
      const state = {
        ...initialState,
        ingredients: [ingredient]
      };
      const action = moveIngredient({ dragIndex: -1, hoverIndex: 0 });
      const result = constructorReducer(state, action);
      expect(result.ingredients).toEqual(state.ingredients);
    });

    it('should not move ingredient if hoverIndex is invalid', () => {
      const ingredient: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-1'
      };
      const state = {
        ...initialState,
        ingredients: [ingredient]
      };
      const action = moveIngredient({ dragIndex: 0, hoverIndex: 5 });
      const result = constructorReducer(state, action);
      expect(result.ingredients).toEqual(state.ingredients);
    });

    it('should not move ingredient if dragIndex equals hoverIndex', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-1'
      };
      const ingredient2: TConstructorIngredient = {
        ...mockSauce,
        id: 'id-2'
      };
      const state = {
        ...initialState,
        ingredients: [ingredient1, ingredient2]
      };
      const action = moveIngredient({ dragIndex: 0, hoverIndex: 0 });
      const result = constructorReducer(state, action);
      expect(result.ingredients).toEqual(state.ingredients);
    });
  });

  describe('clearConstructor', () => {
    it('should clear bun and ingredients', () => {
      const state = {
        bun: mockBun,
        ingredients: [
          { ...mockIngredient, id: 'id-1' },
          { ...mockSauce, id: 'id-2' }
        ]
      };
      const action = clearConstructor();
      const result = constructorReducer(state, action);
      expect(result.bun).toBeNull();
      expect(result.ingredients).toEqual([]);
    });
  });

  describe('selectors', () => {
    it('selectConstructorBun should return bun', () => {
      const state = {
        burgerConstructor: {
          bun: mockBun,
          ingredients: []
        }
      };
      expect(selectConstructorBun(state as any)).toEqual(mockBun);
    });

    it('selectConstructorIngredients should return ingredients', () => {
      const ingredients: TConstructorIngredient[] = [
        { ...mockIngredient, id: 'id-1' }
      ];
      const state = {
        burgerConstructor: {
          bun: null,
          ingredients
        }
      };
      expect(selectConstructorIngredients(state as any)).toEqual(ingredients);
    });

    it('selectConstructorItems should return bun and ingredients', () => {
      const ingredients: TConstructorIngredient[] = [
        { ...mockIngredient, id: 'id-1' }
      ];
      const state = {
        burgerConstructor: {
          bun: mockBun,
          ingredients
        }
      };
      const result = selectConstructorItems(state as any);
      expect(result.bun).toEqual(mockBun);
      expect(result.ingredients).toEqual(ingredients);
    });
  });
});
