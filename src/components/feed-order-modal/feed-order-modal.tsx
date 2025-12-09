import { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/order-slice';
import { Modal } from '@components';
import { OrderInfo } from '@components';

export const FeedOrderModal: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { number } = useParams<{ number: string }>();

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  const handleClose = () => {
    navigate('/feed');
  };

  return (
    <Modal title={`#${number}`} onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};
