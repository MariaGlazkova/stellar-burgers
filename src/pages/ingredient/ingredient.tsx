import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectIngredients, selectIngredientsLoading } from '@selectors';
import { IngredientDetails } from '@components';
import { Preloader } from '@ui';

export const IngredientPage: FC = () => {
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIngredientsLoading);

  if (isLoading && !ingredients.length) {
    return <Preloader />;
  }

  return (
    <section className='pt-10'>
      <h2 className='text text_type_main-large mb-8'>Детали ингредиента</h2>
      <IngredientDetails />
    </section>
  );
};
