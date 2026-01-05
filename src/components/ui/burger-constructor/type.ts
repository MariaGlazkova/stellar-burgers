import { TOrder, TIngredient, TConstructorIngredient } from '@utils-types';

export type ConstructorItems = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export type BurgerConstructorUIProps = {
  constructorItems: ConstructorItems;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
