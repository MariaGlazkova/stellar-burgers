import React, { FC } from 'react';
import { Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  pathname = '',
  profilePath = '/profile'
}) => {
  const isConstructorActive =
    pathname === '/' || pathname.startsWith('/ingredients');
  const isFeedActive = pathname === '/feed' || pathname.startsWith('/feed/');
  const isProfileActive = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={clsx(styles.menu, 'p-4')}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={({ isActive }) =>
              clsx(styles.menu_item, styles.link, {
                [styles.link_active]: isActive || isConstructorActive
              })
            }
            end
          >
            {({ isActive }) => {
              const active = isActive || isConstructorActive;
              return (
                <>
                  <BurgerIcon type={active ? 'primary' : 'secondary'} />
                  <span className='text text_type_main-default'>
                    Конструктор
                  </span>
                </>
              );
            }}
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) =>
              clsx(styles.menu_item, styles.link, {
                [styles.link_active]: isActive || isFeedActive
              })
            }
          >
            {({ isActive }) => {
              const active = isActive || isFeedActive;
              return (
                <>
                  <ListIcon type={active ? 'primary' : 'secondary'} />
                  <span className='text text_type_main-default'>
                    Лента заказов
                  </span>
                </>
              );
            }}
          </NavLink>
        </div>
        <Link to='/' className={styles.logo} aria-label='На главную'>
          <Logo className='' />
        </Link>
        <NavLink
          to={profilePath}
          className={({ isActive }) =>
            clsx(styles.menu_item, styles.link_position_last, styles.link, {
              [styles.link_active]: isActive || isProfileActive
            })
          }
        >
          {({ isActive }) => {
            const active = isActive || isProfileActive;
            return (
              <>
                <ProfileIcon type={active ? 'primary' : 'secondary'} />
                <span className='text text_type_main-default'>
                  {userName || 'Личный кабинет'}
                </span>
              </>
            );
          }}
        </NavLink>
      </nav>
    </header>
  );
};
