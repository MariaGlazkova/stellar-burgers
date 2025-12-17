import React, { FC, memo } from 'react';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import styles from './order-card.module.css';

import { OrderCardUIProps } from './type';
import { OrderStatus } from '@components';

const INGREDIENT_OFFSET_STEP = 20;
const LAST_INGREDIENT_OPACITY = 0.5;
const DEFAULT_OPACITY = 1;
const MIN_ORDER_NUMBER_LENGTH = 6;

export const OrderCardUI: FC<OrderCardUIProps> = memo(
  ({ orderInfo, maxIngredients, locationState }) => {
    const location = useLocation();
    return (
      <Link
        to={orderInfo.number.toString()}
        relative='path'
        state={locationState}
        className={clsx('p-6 mb-4 mr-2', styles.order)}
      >
        <div className={styles.order_info}>
          <span
            className={clsx('text text_type_digits-default', styles.number)}
          >
            #{String(orderInfo.number).padStart(MIN_ORDER_NUMBER_LENGTH, '0')}
          </span>
          <span className='text text_type_main-default text_color_inactive'>
            <FormattedDate date={orderInfo.date} />
          </span>
        </div>
        <h4
          className={clsx('pt-6 text text_type_main-medium', styles.order_name)}
        >
          {orderInfo.name}
        </h4>
        {location.pathname === '/profile/orders' && (
          <OrderStatus status={orderInfo.status} />
        )}
        <div className={clsx('pt-6', styles.order_content)}>
          <ul className={styles.ingredients}>
            {orderInfo.ingredientsToShow.map((ingredient, index) => {
              const zIndex = maxIngredients - index;
              const offsetRight = INGREDIENT_OFFSET_STEP * index;
              const isLastVisible = maxIngredients === index + 1;
              const shouldDimImage = orderInfo.remains && isLastVisible;
              const imageOpacity = shouldDimImage
                ? LAST_INGREDIENT_OPACITY
                : DEFAULT_OPACITY;
              return (
                <li
                  className={styles.img_wrap}
                  style={{ zIndex, right: offsetRight }}
                  key={index}
                >
                  <img
                    style={{
                      opacity: imageOpacity
                    }}
                    className={styles.img}
                    src={ingredient.image_mobile}
                    alt={ingredient.name}
                  />
                  {isLastVisible ? (
                    <span
                      className={clsx(
                        'text text_type_digits-default',
                        styles.remains
                      )}
                    >
                      {orderInfo.remains > 0 ? `+${orderInfo.remains}` : null}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <div>
            <span
              className={clsx(
                'text text_type_digits-default pr-1',
                styles.order_total
              )}
            >
              {orderInfo.total}
            </span>
            <CurrencyIcon type='primary' />
          </div>
        </div>
      </Link>
    );
  }
);
