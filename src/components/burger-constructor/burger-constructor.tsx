import { FC, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  selectOrderRequest,
  selectOrderData,
  selectIsAuthenticated
} from '@selectors';
import {
  createOrder,
  clearOrder,
  fetchUserOrders
} from '../../services/slices/order-slice';
import { clearConstructor } from '../../services/slices/constructor-slice';
import { getCookie } from '../../utils/cookie';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state) => state.burgerConstructor.ingredients
  );
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderData);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const constructorItems = useMemo(
    () => ({
      bun,
      ingredients: ingredients || []
    }),
    [bun, ingredients]
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    const accessToken = getCookie('accessToken');
    if (!accessToken || !isAuthenticated) {
      navigate('/login');
      return;
    }

    const ingredientsList = [
      constructorItems.bun._id,
      ...(constructorItems.ingredients || []).map((ing) => ing._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredientsList));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  useEffect(() => {
    if (orderModalData && isAuthenticated) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, orderModalData, isAuthenticated]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients || []).reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
