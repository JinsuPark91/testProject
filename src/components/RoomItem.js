import React, { useCallback, useMemo, useState } from 'react';
import { List } from 'antd';
import styled, { css } from 'styled-components';
import { Observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import Photos from './Photos';

const { Item } = List;

const MAX_PROFILE_COUNT = 4;

const RoomItem = ({ roomInfo, selected, onClick }) => {
  const { userStore } = useCoreStores();
  const isMyRoom = roomInfo.type === 'WKS0001';
  const userPhotos = roomInfo.memberIdListString
    .split(',')
    .splice(0, MAX_PROFILE_COUNT)
    .map(
      userId =>
        `/${userStore.getUserProfilePhoto({
          userId,
          size: 'small',
          isLocal: true,
        })}`,
    );

  const handleRoomClick = useCallback(() => {
    console.log(roomInfo.metadata);
    onClick(roomInfo);
  }, []);

  const content = useMemo(() => {
    return (
      <>
        <Item.Meta
          avatar={<Photos srcList={userPhotos} />}
          title={
            <Title>
              <Observer>
                {() => <RoomNameText>{roomInfo.name}</RoomNameText>}
              </Observer>
              <Observer>
                {() => <UserCountText>{roomInfo.userCount}</UserCountText>}
              </Observer>
            </Title>
          }
          description={
            <Observer>
              {() => (
                <StyleRoomMessage>
                  {roomInfo.metadata?.lastMessage}
                </StyleRoomMessage>
              )}
            </Observer>
          }
        />

        <UnreadCount>99+</UnreadCount>
      </>
    );
  }, []);

  return (
    // selected 가 바뀌면 자식 전부를 새로그린다.
    // content를 memo 해두고 쓰자
    <StyledItem onClick={handleRoomClick} isMyRoom={isMyRoom}>
      <ItemWrapper selected={selected}>{content}</ItemWrapper>
    </StyledItem>
  );
};

const Title = styled.div`
  display: flex;
  font-size: 0.8125rem;
`;

const StyleRoomMessage = styled.span`
  font-size: 0.6875rem;
  line-height: 1.063rem;
  color: #47474d;
  letter-spacing: 0;
`;

const RoomNameText = styled.span`
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const UserCountText = styled.span`
  opacity: 0.5;
  color: #000000;
  margin-left: 0.375rem;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex: 1;
  ${({ selected }) =>
    selected &&
    css`
      background: #e2e3fb;
    `}

  border-radius: 1.875rem;
  padding: 0.625rem;
  &:hover {
    background: #eaeafb;
  }
`;

/* https://milooy.wordpress.com/2019/09/19/react-external-component%EB%A5%BC-styledcomponent%EB%A1%9C-%EA%B0%90%EC%8C%8C%EC%9D%84-%EB%95%8C-warning-unknown-props-%EC%9B%8C%EB%8B%9D-%ED%95%B4%EA%B2%B0/ */
const StyledItem = styled(({ isMyRoom, children, ...rest }) => (
  <Item {...rest}>{children}</Item>
))`
  user-select: none;
  cursor: pointer;
  padding: 0;

  ${({ isMyRoom }) =>
    isMyRoom &&
    css`
      border-bottom: 0.0625rem solid #e3e7eb;
    `}

  & .ant-list-item-meta-avatar {
    margin-right: 0.3125rem;
  }

  & .ant-list-item-meta-content {
    margin-right: 0.625rem;
  }

  & button {
    display: none;
  }

  & .ant-list-item-meta-title {
    margin: 0;
    line-height: 1.188rem;
  }
  & .ant-list-item-meta-description {
    font-size: 0.6875rem;
    color: #47474d;
    line-height: 1.063rem;
  }
`;

const UnreadCount = styled.div`
  width: 1.5rem;
  background-color: #ff486d;
  height: fit-content;
  align-self: center;
  color: #fff;
  text-align: center;
  font-weight: 400;
  line-height: 0.9375rem;
  font-size: 0.63rem;
  padding: 0 0.3125rem;
  border-radius: 0.625rem;
`;

export default RoomItem;
