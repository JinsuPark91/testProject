import React from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import NotificationItem from './NotificationItem';
import { remToPixel } from '../../utils/GeneralUtil';

const NotificationList = ({ items, hasMore, isLoading, loadMore }) => {
  const { t } = useTranslation();
  const { notificationStore } = useCoreStores();

  const itemCount = hasMore ? items.length + 1 : items.length;
  const isItemLoaded = index => !hasMore || index < items.length;
  const loadMoreItems = isLoading ? () => {} : loadMore;

  const handleReadAll = () => {
    notificationStore.readAll(items);
  };

  const handleDeleteReadAll = () => {
    notificationStore.deleteReadAll(items);
  };

  const Item = ({ index, style }) =>
    isItemLoaded(index) ? (
      <NotificationItem
        key={items[index].id}
        style={style}
        item={items[index]}
      />
    ) : (
      <div style={style}>Loading...</div>
    );

  return (
    <>
      <Buttons>
        <Button onClick={handleReadAll}>{t('CM_READ_ALL')}</Button>
        <Middot />
        <Button onClick={handleDeleteReadAll}>{t('CM_DEL_READ_NOTI')}</Button>
      </Buttons>

      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <List
            height={remToPixel(20)}
            itemCount={itemCount}
            itemSize={remToPixel(4)}
            onItemsRendered={onItemsRendered}
            ref={ref}
          >
            {Item}
          </List>
        )}
      </InfiniteLoader>
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
