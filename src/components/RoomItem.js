import React from 'react';
import { List } from 'antd';
import styled from 'styled-components';
import Photos from './Photos';

const { Item } = List;

function RoomItem({ roomInfo, onClick }) {
  const { uids: roomName, lastMessage, unreadCount } = roomInfo;

  const handleMoreMenuClick = () => {
    console.log('MORE : ', roomInfo);
  };

  const handleNewWindowClick = () => {
    console.log('NEW WINDOW : ', roomInfo);
  };

  return (
    <StyledItem onClick={onClick}>
      <Item.Meta
        avatar={
          <Photos
            srcList={[
              'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            ]}
            maxCount={3}
          />
        }
        title={`${roomName}`}
        description={`${lastMessage.body}`}
      />
      {unreadCount * 1 ? (
        <UnreadCount className="room-item__unread-count">
          {unreadCount}
        </UnreadCount>
      ) : null}

      <button type="button" onClick={handleMoreMenuClick}>
        ...
      </button>
      <button type="button" onClick={handleNewWindowClick}>
        o
      </button>
    </StyledItem>
  );
}

const StyledItem = styled(Item)`
  padding: 10px;
  user-select: none;
  cursor: pointer;

  & .ant-list-item-meta-avatar {
    margin-right: 5px;
  }

  & .ant-list-item-meta-content {
    margin-right: 10px;
  }

  & button {
    display: none;
  }

  &:hover {
    background: #eaeafb;
    border-radius: 20px;
  }

  &:hover .room-item__unread-count {
    display: none;
  }

  &:hover button {
    display: block;
  }
`;

const UnreadCount = styled.div`
  background: red;
  color: white;
  font-size: 13px;
  font-weight: 800;
  padding: 0 5px;
  border-radius: 10px;
`;

export default RoomItem;
