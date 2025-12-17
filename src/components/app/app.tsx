import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Location
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  IngredientPage,
  OrderInfoPage,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  ProtectedRoute,
  UnprotectedRoute,
  FeedOrderModal,
  IngredientModal,
  ProfileOrderModal
} from '@components';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const state = location.state as { background?: Location } | null;
  const background = state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfoPage />} />
        <Route path='/ingredients/:id' element={<IngredientPage />} />
        <Route
          path='/login'
          element={
            <UnprotectedRoute>
              <Login />
            </UnprotectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <UnprotectedRoute>
              <Register />
            </UnprotectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <UnprotectedRoute>
              <ForgotPassword />
            </UnprotectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <UnprotectedRoute>
              <ResetPassword />
            </UnprotectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfoPage />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route path='/feed/:number' element={<FeedOrderModal />} />
          <Route path='/ingredients/:id' element={<IngredientModal />} />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <ProfileOrderModal />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
