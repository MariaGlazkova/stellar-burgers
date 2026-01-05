import { FC, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import {
  clearOrder,
  fetchOrderByNumber
} from '../../services/slices/order-slice';
import { Modal } from '@components';
import { OrderInfo } from '@components';

export const FeedOrderModal: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { number } = useParams<{ number: string }>();

  useEffect(() => {
    if (number) {
      dispatch(clearOrder());
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  const handleClose = () => {
    if (location.state?.background) {
      navigate(-1);
    } else {
      navigate('/feed');
    }
  };

  return (
    <Modal title={`#${number}`} onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};
