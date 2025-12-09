import React, { FC } from 'react';
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
  onProfileClick,
  onConstructorClick,
  onFeedClick,
  pathname = ''
}) => {
  const isConstructorActive =
    pathname === '/' || pathname.startsWith('/ingredients');
  const isFeedActive = pathname === '/feed' || pathname.startsWith('/feed/');
  const isProfileActive = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={clsx(styles.menu, 'p-4')}>
        <div className={styles.menu_part_left}>
          <div
            className={clsx(styles.menu_item, {
              [styles.link_active]: isConstructorActive
            })}
            onClick={onConstructorClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onConstructorClick?.();
              }
            }}
            role='button'
            tabIndex={0}
          >
            <BurgerIcon type='primary' />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </div>
          <div
            className={clsx(styles.menu_item, {
              [styles.link_active]: isFeedActive
            })}
            onClick={onFeedClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onFeedClick?.();
              }
            }}
            role='button'
            tabIndex={0}
          >
            <ListIcon type='primary' />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </div>
        </div>
        <div
          className={styles.logo}
          onClick={onConstructorClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onConstructorClick?.();
            }
          }}
          role='button'
          tabIndex={0}
        >
          <Logo />
        </div>
        <div
          className={clsx(styles.link_position_last, {
            [styles.link_active]: isProfileActive
          })}
          onClick={onProfileClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onProfileClick?.();
            }
          }}
          role='button'
          tabIndex={0}
        >
          <ProfileIcon type='primary' />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </div>
      </nav>
    </header>
  );
};
