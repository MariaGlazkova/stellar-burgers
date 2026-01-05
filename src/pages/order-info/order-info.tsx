import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsLoading,
  selectOrderData,
  selectOrderLoading
} from '@selectors';
import {
  clearOrder,
  fetchOrderByNumber
} from '../../services/slices/order-slice';
import { OrderInfo } from '@components';
import { Preloader } from '@ui';
import styles from './order-info.module.css';

export const OrderInfoPage: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const orderData = useSelector(selectOrderData);
  const isOrderLoading = useSelector(selectOrderLoading);
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    if (number) {
      dispatch(clearOrder());
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  if (
    isOrderLoading ||
    !orderData ||
    (isIngredientsLoading && !ingredients.length)
  ) {
    return <Preloader />;
  }

  return (
    <section className={`pt-10 ${styles.container}`}>
      <h2 className='text text_type_main-large mb-8'>Детали заказа</h2>
      <OrderInfo />
    </section>
  );
};
