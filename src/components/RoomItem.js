import React, { useCallback, useMemo } from 'react';
import { List } from 'antd';
import styled, { css } from 'styled-components';
import { Observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import Photos from './Photos';
import { ViewMoreIcon, ExportIcon, DisableAlarmIcon, PinIcon } from './Icons';

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

  const handleViewMore = e => {
    e.stopPropagation();
    console.log('handleViewMore');
  };

  const handleExport = e => {
    e.stopPropagation();
    console.log('handleExport');
  };

  const handleRoomClick = useCallback(() => {
    console.log(roomInfo);
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

              <Observer>
                {() =>
                  roomInfo.isAlarmUsed ? (
                    <TitleIconWrapper>
                      <DisableAlarmIcon width={0.8} height={0.8} />
                    </TitleIconWrapper>
                  ) : null
                }
              </Observer>
              <Observer>
                {() =>
                  roomInfo.isRoomBookmarked ? (
                    <TitleIconWrapper>
                      <PinIcon width={0.8} height={0.8} />
                    </TitleIconWrapper>
                  ) : null
                }
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
        {roomInfo.metadata?.unreadCount ? (
          <UnreadCount className="room-item__unread">
            {roomInfo.metadata?.unreadCount}
          </UnreadCount>
        ) : null}
        <IconWrapper className="room-item__icon" onClick={handleViewMore}>
          <ViewMoreIcon />
        </IconWrapper>
        <IconWrapper className="room-item__icon" onClick={handleExport}>
          <ExportIcon width={1} height={1} />
        </IconWrapper>
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
  align-items: center;
  font-size: 0.8125rem;
`;

const StyleRoomMessage = styled.span`
  font-size: 0.69rem;
  color: #47474d;
`;

const RoomNameText = styled.span`
  font-size: 0.81rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const UserCountText = styled.span`
  font-size: 0.81rem;
  opacity: 0.5;
  color: #000000;
  margin-left: 0.375rem;
`;

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
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

    .room-item__unread {
      display: none;
    }

    .room-item__icon {
      display: flex;
    }
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
    margin-right: 0.3rem;
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
  background-color: #ff486d;
  height: fit-content;
  color: #fff;
  font-weight: 400;
  font-size: 0.63rem;
  padding: 0.06rem 0.19rem;
  border-radius: 0.56rem;
`;

const TitleIconWrapper = styled.div`
  display: flex;
  flex: 0 0 0.81rem;
  padding: 0 0.15rem;
`;
const IconWrapper = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  &:hover {
    background: #dcddff;
  }
`;

export default RoomItem;
