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

const NotificationList = ({ items, hasMore, isLoading, loadMore, type }) => {
  const height = 20;
  const outerRef = useRef(null);
  const { t } = useTranslation();
  const { notificationStore } = useCoreStores();
  const itemCount = hasMore ? items.length + 1 : items.length;
  const isItemLoaded = index => !hasMore || index < items.length;
  const isEmpty = !items.length;

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
    notificationStore.readNotificationList({ type });
  };

  const handleDeleteReadAll = () => {
    notificationStore.deleteNotificationList({ type, isOnlyForRead: true });
  };

  const Item = ({ style, index }) =>
    isItemLoaded(index) ? (
      <NotificationItem
        key={items[index].notificationId}
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
        <Button onClick={handleReadAll} disabled={isEmpty}>
          {t('CM_READ_ALL')}
        </Button>
        <Middot />
        <Button onClick={handleDeleteReadAll} disabled={isEmpty}>
          {t('CM_DEL_READ_NOTI')}
        </Button>
      </Buttons>

      {isEmpty ? (
        <EmptyMessage height={height}>
          <BoldText>{t('CM_NO_NOTI')}</BoldText>
          <Text>{t('CM_NOTI_STORE')}</Text>
        </EmptyMessage>
      ) : (
        <List
          height={remToPixel(height)}
          itemCount={itemCount}
          itemSize={remToPixel(4)}
          outerRef={outerRef}
          onScroll={handleScroll}
        >
          {Item}
        </List>
      )}
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
  margin: 0 0.125rem;
  padding: 0 0.5rem;
  font-size: 0.75rem;
  color: ${props => props.theme.TextSub};
  border: 0;
  border-radius: 0.25rem;
  background-color: transparent;

  &:not(:disabled):hover {
    background-color: ${props => props.theme.StateBright};
  }

  &:not(:disabled):active {
    background-color: ${props => props.theme.StateDark};
  }

  &:disabled {
    color: ${props => props.theme.DisabledText2};
    cursor: not-allowed;
  }
`;

const Middot = styled.div`
  color: ${props => props.theme.TextSub2};
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

const EmptyMessage = styled.div`
  display: flex;
  height: ${({ height = 0 }) => height}rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 3rem;
`;

const BoldText = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.TextMain};
  font-weight: bold;
`;

const Text = styled.span`
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: ${props => props.theme.TextSub};
`;
