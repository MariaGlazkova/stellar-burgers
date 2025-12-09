import React, { FC } from 'react';
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
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <div
            className={`${styles.menu_item} ${
              isConstructorActive ? styles.link_active : ''
            }`}
            onClick={onConstructorClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onConstructorClick?.();
              }
            }}
            role='button'
            tabIndex={0}
          >
            <BurgerIcon type={'primary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </div>
          <div
            className={`${styles.menu_item} ${
              isFeedActive ? styles.link_active : ''
            }`}
            onClick={onFeedClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onFeedClick?.();
              }
            }}
            role='button'
            tabIndex={0}
          >
            <ListIcon type={'primary'} />
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
          <Logo className='' />
        </div>
        <div
          className={`${styles.link_position_last} ${
            isProfileActive ? styles.link_active : ''
          }`}
          onClick={onProfileClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onProfileClick?.();
            }
          }}
          role='button'
          tabIndex={0}
        >
          <ProfileIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </div>
      </nav>
    </header>
  );
};
