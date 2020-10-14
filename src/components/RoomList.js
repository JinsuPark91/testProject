import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useObserver, Observer } from 'mobx-react';
import { List } from 'antd';
import styled from 'styled-components';
import RoomItem from './RoomItem';

function RoomList({ rooms }) {
  const history = useHistory();
  const params = useParams();

  const handleRoomClick = roomId => {
    history.push({
      pathname: `/s/${roomId}/${params.mainApp}`,
      search: history.location.search,
    });
  };

  return useObserver(() => (
    <Wrapper>
      <List
        itemLayout="horizontal"
        // rooms 그대로 넣으면 안터진다.
        // https://github.com/mobxjs/mobx-react/issues/484
        dataSource={rooms}
        renderItem={roomInfo => (
          // 그냥 값 바꾸면 안터진다.
          // https://github.com/mobxjs/mobx-react/issues/484
          <Observer>
            {() => (
              <RoomItem
                id={roomInfo.roomId}
                thumbs={[
                  'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                  'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                  'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                  'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                ]}
                maxThumbs={2}
                unreadCount={roomInfo.unreadCount}
                name={roomInfo.name}
                lastMessage={roomInfo.lastMessage}
                onClick={() => {
                  handleRoomClick(roomInfo.id);
                }}
              />
            )}
          </Observer>
        )}
      />
    </Wrapper>
  ));
}

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
`;

export default RoomList;
