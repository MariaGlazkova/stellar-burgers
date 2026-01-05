import { FC } from 'react';
import { useSelector } from '../../services/store';
import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday
} from '@selectors';

import { FeedInfoUI } from '../ui/feed-info';

const ORDER_STATUS = {
  done: 'done',
  pending: 'pending'
} as const;

type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

type Order = {
  status: string;
  number: number;
};

const MAX_ORDERS_TO_SHOW = 20;

const getOrders = (orders: Order[], status: OrderStatus): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, MAX_ORDERS_TO_SHOW);

export const FeedInfo: FC = () => {
  const orders = useSelector(selectFeedOrders);
  const total = useSelector(selectFeedTotal);
  const totalToday = useSelector(selectFeedTotalToday);

  const feed = { total, totalToday };

  const readyOrders = getOrders(orders, ORDER_STATUS.done);

  const pendingOrders = getOrders(orders, ORDER_STATUS.pending);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
