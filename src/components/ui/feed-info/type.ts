import { TOrdersData } from '@utils-types';

type FeedTotals = Pick<TOrdersData, 'total' | 'totalToday'>;

export type FeedInfoUIProps = {
  feed: FeedTotals;
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
