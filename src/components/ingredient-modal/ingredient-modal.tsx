import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from '@components';
import { IngredientDetails } from '@components';

export const IngredientModal: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    if (location.state?.background) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <Modal title='Детали ингредиента' onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};
