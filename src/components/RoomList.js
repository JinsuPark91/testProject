import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useObserver, Observer } from 'mobx-react';
import { List } from 'antd';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import RoomItem from './RoomItem';

const DEFAULT_MAIN_APP = 'talk';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const history = useHistory();
  const params = useParams();
  const { userStore, roomStore } = useCoreStores();

  useEffect(() => {
    try {
      (async () => {
        const response = await roomStore.updateRoomList({
          userId: userStore.myProfile.id,
        });
        const roomList = Object.values(response)?.map(obj => obj.room);
        setRooms(roomList);
      })();
    } catch (e) {
      console.warn('GET ROOMLIST ERROR : ', e);
      setRooms([]);
    }
  }, [roomStore]);

  const handleRoomClick = roomId => {
    history.push({
      pathname: `/s/${roomId}/${DEFAULT_MAIN_APP}`,
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
