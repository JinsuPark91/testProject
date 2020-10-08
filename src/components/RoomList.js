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
      pathname: `/${params['0']}/${roomId}/${params.mainApp}`,
      search: history.location.search,
    });
  };

  return useObserver(() => {
    return (
      <Wrapper>
        <button
          type="button"
          onClick={() => {
            rooms[0].unreadCount++;
          }}
        >
          unread test
        </button>
        <button
          type="button"
          onClick={() => {
            rooms.splice(rooms.length - 1, 1);
          }}
        >
          remove test
        </button>

        <List
          itemLayout="horizontal"
          // rooms 그대로 넣으면 안터진다.
          // https://github.com/mobxjs/mobx-react/issues/484
          dataSource={rooms.slice()}
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
    );
  });
}

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
`;

export default RoomList;
