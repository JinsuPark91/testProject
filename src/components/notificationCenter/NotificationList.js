/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { throttle } from 'lodash';
import NotificationItem from './NotificationItem';
import { remToPixel } from '../../utils/GeneralUtil';

const NotificationList = ({ items, hasMore, isLoading, loadMore }) => {
  console.log('******* items : ', items);
  const outerRef = useRef(null);
  const { t } = useTranslation();
  const { notificationStore } = useCoreStores();
  const itemCount = hasMore ? items.length + 1 : items.length;
  const isItemLoaded = index => !hasMore || index < items.length;

  const handleScroll = throttle(() => {
    if (!outerRef?.current) return;
    const { scrollTop, clientHeight, scrollHeight } = outerRef.current;

    if (scrollTop + clientHeight === scrollHeight) {
      if (hasMore && !isLoading) {
        loadMore();
      }
    }
  }, 200);

  const handleReadAll = () => {
    notificationStore.readAll(items);
  };

  const handleDeleteReadAll = () => {
    notificationStore.deleteReadAll(items);
  };

  const Item = ({ style, index }) =>
    isItemLoaded(index) ? (
      <NotificationItem
        key={items[index].id}
        style={style}
        item={items[index]}
      />
    ) : (
      <Loader style={style}>
        <img src={`${process.env.PUBLIC_URL}/loading.png`} alt="loading" />
      </Loader>
    );

  return (
    <>
      <Buttons>
        <Button onClick={handleReadAll}>{t('CM_READ_ALL')}</Button>
        <Middot />
        <Button onClick={handleDeleteReadAll}>{t('CM_DEL_READ_NOTI')}</Button>
      </Buttons>

      <List
        height={remToPixel(20)}
        itemCount={itemCount}
        itemSize={remToPixel(4)}
        outerRef={outerRef}
        onScroll={handleScroll}
      >
        {Item}
      </List>
    </>
  );
};

export default NotificationList;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem 0.813rem;
`;

const Button = styled.button`
  background-color: #fff;
  border: 0;
  font-size: 0.75rem;
  color: #666666;
  margin: 0 0.125rem;
  padding: 0 0.5rem;
  border-radius: 0.25rem;

  &:hover {
    background-color: #faf8f7;
  }

  &:active {
    background-color: #f2efec;
  }
`;

const Middot = styled.div`
  &:after {
    font-size: 1rem;
    font-weight: bold;
    content: '\\00b7';
  }
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & > img {
    animation: rotate_image 2s linear infinite;
    transform-origin: 50% 50%;
  }

  @keyframes rotate_image {
    100% {
      transform: rotate(360deg);
    }
  }
`;
