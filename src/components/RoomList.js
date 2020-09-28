import React from 'react';
import styled from 'styled-components';
import { List, Avatar } from 'antd';

const { Item } = List;

const roomList = [
  {
    name: '나지훈방',
    lastMessage: '마지막 메세지1',
  },
  {
    name: '내방',
    lastMessage: '밥먹자',
  },
  {
    name: '누구방',
    lastMessage: '마지막 메세지2',
  },
  {
    name: 'TS본부',
    lastMessage: 'ㄲㅈ',
  },
];

function RoomItem(roomInfo) {
  return (
    <Item>
      <Item.Meta
        avatar={
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        }
        title={roomInfo.name}
        description={roomInfo.lastMessage}
      />
    </Item>
  );
}

function RoomList() {
  return (
    <List itemLayout="horizontal" dataSource={roomList} renderItem={RoomItem} />
  );
}

export default RoomList;
